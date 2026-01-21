import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import Map, { 
  NavigationControl, 
  GeolocateControl, 
  ScaleControl, 
  Marker, 
  Popup,
  Source,
  Layer
} from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ZoomIn, 
  ZoomOut, 
  Layers,
  Navigation,
  Loader2,
  AlertCircle,
  Church,
  Image
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow, OverlayRow, SpiritualSiteRow, PlotFeatureCollection } from '@/types/database'
import { cn } from '@/lib/utils'
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre'

// Hoa Viên Nghĩa Trang Bình Dương coordinates (gate entrance)
const DEFAULT_CENTER = [106.651891, 11.168266] as const

const INITIAL_VIEW_STATE: {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
} = {
  longitude: DEFAULT_CENTER[0],
  latitude: DEFAULT_CENTER[1],
  zoom: 17,
  pitch: 0,
  bearing: 0
}

// Map style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

interface ParkMapProps {
  onPlotSelect: (plot: PlotRow | null) => void
  selectedPlot: PlotRow | null
  filterStatus: string
  flyToPlot?: PlotRow | null
}

// Circle layer paint for plots - hide when zoomed out (< 17)
const plotsCirclePaint = {
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    16, 0,      // Hidden at zoom 16
    17, 6,      // Start showing at zoom 17
    18, 8,
    19, 12,
    22, 18
  ],
  'circle-color': ['get', '_statusColor'],
  'circle-stroke-color': '#ffffff',
  'circle-stroke-width': [
    'interpolate',
    ['linear'],
    ['zoom'],
    16, 0,
    17, 1.5,
    19, 2
  ],
  'circle-opacity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    16, 0,
    17, 0.9
  ]
}

// Circle layer for hover effect - also hide when zoomed out
const plotsHoverPaint = {
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    16, 0,
    17, 12,
    18, 14,
    19, 20,
    22, 28
  ],
  'circle-color': 'rgba(59, 130, 246, 0.3)',
  'circle-stroke-color': '#3B82F6',
  'circle-stroke-width': [
    'interpolate',
    ['linear'],
    ['zoom'],
    16, 0,
    17, 2
  ]
}

export function ParkMapSupabase({ 
  onPlotSelect, 
  selectedPlot, 
  filterStatus,
  flyToPlot
}: ParkMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const [showOverlays, setShowOverlays] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null)
  const [loadedOverlayIds, setLoadedOverlayIds] = useState<Set<string>>(new Set())
  const [mapReady, setMapReady] = useState(false)
  const [failedOverlayIds, setFailedOverlayIds] = useState<Set<string>>(new Set())

  // Fetch data from Supabase
  const { 
    plots, 
    plotsGeoJSON, 
    overlays, 
    spiritualSites,
    isLoading, 
    isError, 
    error 
  } = useMapData()

  // Filter plots based on status only (search is handled by autocomplete)
  const filteredGeoJSON = useMemo<PlotFeatureCollection | null>(() => {
    if (!plotsGeoJSON) return null

    const filtered = plotsGeoJSON.features.filter(feature => {
      const props = feature.properties
      return filterStatus === 'all' || props.status === filterStatus
    })

    return {
      type: 'FeatureCollection',
      features: filtered
    }
  }, [plotsGeoJSON, filterStatus])

  // Find hovered plot data
  const hoveredPlot = useMemo(() => {
    if (!hoveredPlotId || !plots) return null
    return plots.find(p => p.id === hoveredPlotId) || null
  }, [hoveredPlotId, plots])

  // Fly to plot when flyToPlot prop changes
  useEffect(() => {
    if (flyToPlot) {
      setViewState(prev => ({
        ...prev,
        longitude: flyToPlot.lng,
        latitude: flyToPlot.lat,
        zoom: 19,
        pitch: 60,
        bearing: 0
      }))
    }
  }, [flyToPlot])

  // Helper function to check if overlay intersects with viewport bounds
  const isOverlayInViewport = useCallback((overlay: OverlayRow, bounds: maplibregl.LngLatBounds) => {
    const nwLng = Number(overlay.nw_lng)
    const nwLat = Number(overlay.nw_lat)
    const seLng = Number(overlay.se_lng)
    const seLat = Number(overlay.se_lat)

    if (!isFinite(nwLng) || !isFinite(nwLat) || !isFinite(seLng) || !isFinite(seLat)) {
      return false
    }

    // Check if overlay bounds intersect with viewport bounds
    const overlayWest = Math.min(nwLng, seLng)
    const overlayEast = Math.max(nwLng, seLng)
    const overlaySouth = Math.min(nwLat, seLat)
    const overlayNorth = Math.max(nwLat, seLat)

    const viewWest = bounds.getWest()
    const viewEast = bounds.getEast()
    const viewSouth = bounds.getSouth()
    const viewNorth = bounds.getNorth()

    // Expand viewport by 20% for preloading nearby overlays
    const expandX = (viewEast - viewWest) * 0.2
    const expandY = (viewNorth - viewSouth) * 0.2

    return !(
      overlayEast < viewWest - expandX ||
      overlayWest > viewEast + expandX ||
      overlayNorth < viewSouth - expandY ||
      overlaySouth > viewNorth + expandY
    )
  }, [])

  // Minimum zoom level to load overlays (helps weak mobile devices)
  const isMobile = window.innerWidth < 768
  const MIN_OVERLAY_ZOOM = isMobile ? 17.5 : 16

  // Lazy load overlays based on viewport - runs on map move
  const loadVisibleOverlays = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map || !mapReady || overlays.length === 0) return

    const currentZoom = map.getZoom()
    const bounds = map.getBounds()
    if (!bounds) return

    // If zoom is too low, hide all loaded overlays and don't load new ones
    if (currentZoom < MIN_OVERLAY_ZOOM) {
      loadedOverlayIds.forEach((overlayId) => {
        const layerId = `overlay-layer-${overlayId}`
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', 'none')
        }
      })
      return
    }

    // Show overlays when zoom is high enough
    if (showOverlays) {
      loadedOverlayIds.forEach((overlayId) => {
        const layerId = `overlay-layer-${overlayId}`
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', 'visible')
        }
      })
    }

    let newlyLoaded = 0

    // Limit number of overlays loaded at once on mobile to prevent memory issues
    const maxOverlaysToLoad = isMobile ? 2 : 20

    // Sort overlays by z_index (lower values load first, appear below)
    const sortedOverlays = [...overlays].sort((a, b) => (a.z_index ?? 0) - (b.z_index ?? 0))

    sortedOverlays.forEach((overlay: OverlayRow) => {
      // Stop if we've loaded enough overlays this round (mobile optimization)
      if (newlyLoaded >= maxOverlaysToLoad) return

      const sourceId = `overlay-${overlay.id}`
      const layerId = `overlay-layer-${overlay.id}`

      // Skip if already loaded
      if (loadedOverlayIds.has(overlay.id)) return

      // Skip if previously failed
      if (failedOverlayIds.has(overlay.id)) return

      // Skip if not visible
      if (overlay.is_visible === false) return

      // Check if overlay is in viewport
      if (!isOverlayInViewport(overlay, bounds)) return

      // Ensure coordinates are numbers
      const nwLng = Number(overlay.nw_lng)
      const nwLat = Number(overlay.nw_lat)
      const seLng = Number(overlay.se_lng)
      const seLat = Number(overlay.se_lat)

      if (!isFinite(nwLng) || !isFinite(nwLat) || !isFinite(seLng) || !isFinite(seLat)) {
        return
      }

      // Image overlay coordinates: [top-left, top-right, bottom-right, bottom-left]
      const coordinates: [[number, number], [number, number], [number, number], [number, number]] = [
        [nwLng, nwLat], // Top Left (NW)
        [seLng, nwLat], // Top Right (NE)
        [seLng, seLat], // Bottom Right (SE)
        [nwLng, seLat]  // Bottom Left (SW)
      ]

      // Add cache-busting timestamp to URL
      const imageUrl = overlay.url.includes('?') 
        ? `${overlay.url}&_t=${Date.now()}` 
        : `${overlay.url}?_t=${Date.now()}`

      // Load overlay image
      const loadOverlayImage = async () => {
        try {
          map.addSource(sourceId, {
            type: 'image',
            url: imageUrl,
            coordinates: coordinates
          })

          // Use opacity from database (default 85, convert to 0-1 range)
          const opacityValue = (overlay.opacity ?? 85) / 100

          map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: { 
              'raster-opacity': opacityValue,
              'raster-fade-duration': 300
            }
          })

          // Apply current visibility state
          map.setLayoutProperty(layerId, 'visibility', showOverlays ? 'visible' : 'none')

          setLoadedOverlayIds(prev => new Set([...prev, overlay.id]))
          console.log(`[Overlays] Loaded: ${overlay.name || overlay.id}`)

          // Move plot layers to top
          const plotLayers = ['plots-circle', 'plots-hover', 'plots-selected']
          plotLayers.forEach(plotLayerId => {
            if (map.getLayer(plotLayerId)) {
              map.moveLayer(plotLayerId)
            }
          })
        } catch (err) {
          console.error(`[Overlays] Failed to load ${overlay.name || overlay.id}:`, err)
          setFailedOverlayIds(prev => new Set([...prev, overlay.id]))
        }
      }

      loadOverlayImage()
      newlyLoaded++
    })

    if (newlyLoaded > 0) {
      console.log(`[Overlays] Started loading ${newlyLoaded} overlays`)
    }
  }, [overlays, loadedOverlayIds, failedOverlayIds, mapReady, isOverlayInViewport, showOverlays, isMobile])

  // Initial load of visible overlays when map is ready
  useEffect(() => {
    if (mapReady && overlays.length > 0) {
      // Small delay to ensure map is fully rendered
      const timer = setTimeout(loadVisibleOverlays, 100)
      return () => clearTimeout(timer)
    }
  }, [mapReady, overlays.length, loadVisibleOverlays])

  // Clear loaded overlays when overlay data changes (e.g., image replaced)
  const overlayUrlsRef = useRef<Record<string, string>>({})
  
  useEffect(() => {
    const mapInstance = mapRef.current?.getMap()
    if (!mapInstance || !mapReady) return

    // Check if any overlay URLs have changed
    let hasChanges = false
    overlays.forEach(overlay => {
      const prevUrl = overlayUrlsRef.current[overlay.id]
      if (prevUrl && prevUrl !== overlay.url) {
        hasChanges = true
        // Remove old source and layer
        const layerId = `overlay-layer-${overlay.id}`
        const sourceId = `overlay-${overlay.id}`
        if (mapInstance.getLayer(layerId)) mapInstance.removeLayer(layerId)
        if (mapInstance.getSource(sourceId)) mapInstance.removeSource(sourceId)
        // Remove from loaded set so it will be reloaded
        setLoadedOverlayIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(overlay.id)
          return newSet
        })
        console.log(`[Overlays] URL changed for ${overlay.name}, will reload`)
      }
      overlayUrlsRef.current[overlay.id] = overlay.url
    })

    if (hasChanges) {
      // Trigger reload
      setTimeout(loadVisibleOverlays, 100)
    }
  }, [overlays, mapReady, loadVisibleOverlays])

  // Toggle overlay visibility for loaded overlays only
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    loadedOverlayIds.forEach((overlayId) => {
      const layerId = `overlay-layer-${overlayId}`
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', showOverlays ? 'visible' : 'none')
      }
    })
  }, [showOverlays, loadedOverlayIds])

  // Debounced overlay loading on map move
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState)
    
    // Debounce overlay loading - wait 200ms after last move
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current)
    }
    moveTimeoutRef.current = setTimeout(() => {
      loadVisibleOverlays()
    }, 200)
  }, [loadVisibleOverlays])

  const handleZoomIn = useCallback(() => {
    setViewState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 22) }))
  }, [])

  const handleZoomOut = useCallback(() => {
    setViewState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 10) }))
  }, [])

  const handleReset = useCallback(() => {
    setViewState(INITIAL_VIEW_STATE)
  }, [])

  // Handle plot click
  const handlePlotClick = useCallback((e: MapLayerMouseEvent) => {
    if (!e.features || e.features.length === 0) return
    
    const feature = e.features[0]
    const props = feature.properties as PlotRow
    
    // Zoom to the clicked plot
    setViewState(prev => ({
      ...prev,
      longitude: props.lng,
      latitude: props.lat,
      zoom: Math.max(prev.zoom, 18)
    }))
    
    onPlotSelect(props)
  }, [onPlotSelect])

  // Handle plot hover
  const handlePlotHover = useCallback((e: MapLayerMouseEvent) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0]
      setHoveredPlotId(feature.properties?.id || null)
    } else {
      setHoveredPlotId(null)
    }
  }, [])

  const handlePlotLeave = useCallback(() => {
    setHoveredPlotId(null)
  }, [])

  // Handle map load
  const handleMapLoad = useCallback(() => {
    console.log('[Map] Map loaded and ready')
    setMapReady(true)
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-stone-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-stone-600 font-medium">Đang tải dữ liệu bản đồ...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-stone-100">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-stone-900 font-medium mb-2">Không thể tải dữ liệu</p>
          <p className="text-stone-600 text-sm mb-4">{error?.message || 'Đã có lỗi xảy ra'}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* MapLibre GL Map */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onLoad={handleMapLoad}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
        interactiveLayerIds={['plots-circle']}
        onClick={handlePlotClick}
        onMouseMove={handlePlotHover}
        onMouseLeave={handlePlotLeave}
        cursor={hoveredPlotId ? 'pointer' : 'grab'}
      >
        {/* Navigation Controls */}
        <NavigationControl position="bottom-right" showCompass showZoom={false} />
        <GeolocateControl 
          position="bottom-right" 
          trackUserLocation
        />
        <ScaleControl position="bottom-left" />

        {/* GeoJSON Source for Plots */}
        {filteredGeoJSON && (
          <Source id="plots" type="geojson" data={filteredGeoJSON}>
            {/* Main circle layer */}
            <Layer
              id="plots-circle"
              type="circle"
              paint={plotsCirclePaint as any}
            />
            {/* Hover highlight layer */}
            {hoveredPlotId && (
              <Layer
                id="plots-hover"
                type="circle"
                filter={['==', ['get', 'id'], hoveredPlotId]}
                paint={plotsHoverPaint as any}
              />
            )}
            {/* Selected plot highlight */}
            {selectedPlot && (
              <Layer
                id="plots-selected"
                type="circle"
                filter={['==', ['get', 'id'], selectedPlot.id]}
                paint={{
                  'circle-radius': [
                    'interpolate', ['linear'], ['zoom'],
                    14, 10, 17, 16, 19, 24, 22, 32
                  ],
                  'circle-color': 'rgba(59, 130, 246, 0.2)',
                  'circle-stroke-color': '#2563EB',
                  'circle-stroke-width': 3
                } as any}
              />
            )}
          </Source>
        )}

        {/* Hovered Plot Popup */}
        {hoveredPlot && (
          <Popup
            longitude={hoveredPlot.lng}
            latitude={hoveredPlot.lat}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
            offset={20}
          >
            <div className="p-3 min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-stone-500">{hoveredPlot.id}</span>
                <Badge 
                  variant={hoveredPlot.status === 'Trống' ? 'sage' : 'secondary'} 
                  className="text-[10px] py-0"
                >
                  {hoveredPlot.status}
                </Badge>
              </div>
              {hoveredPlot.name ? (
                <p className="font-semibold text-sm text-stone-900">{hoveredPlot.name}</p>
              ) : (
                <p className="text-sm text-stone-600 italic">
                  {hoveredPlot.status === 'Trống' ? 'Vị trí trống' : 'Chưa có thông tin'}
                </p>
              )}
              <p className="text-xs text-stone-500 mt-1">{hoveredPlot.zone || 'Khu vực chung'}</p>
              {hoveredPlot.price && (
                <p className="text-xs font-semibold text-amber-600 mt-1">
                  {hoveredPlot.price.toLocaleString('vi-VN')} VNĐ
                </p>
              )}
              {hoveredPlot.area && (
                <p className="text-xs text-stone-500 mt-0.5">
                  Diện tích: {hoveredPlot.area} m²
                </p>
              )}
            </div>
          </Popup>
        )}

        {/* Spiritual Sites Markers */}
        <AnimatePresence>
          {showMarkers && spiritualSites.map((site: SpiritualSiteRow) => (
            <Marker
              key={site.id}
              longitude={site.lng}
              latitude={site.lat}
              anchor="center"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
                        {site.image_url ? (
                          <img 
                            src={site.image_url} 
                            alt={site.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <Church className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="font-medium text-sm">{site.name}</p>
                    {site.type && (
                      <p className="text-xs text-stone-500">{site.type}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Marker>
          ))}
        </AnimatePresence>
      </Map>

      {/* Custom Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="glass rounded-xl p-1 flex flex-col gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  className="h-8 w-8 cursor-pointer hover:bg-stone-100"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Phóng to</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  className="h-8 w-8 cursor-pointer hover:bg-stone-100"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Thu nhỏ</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="h-8 w-8 cursor-pointer hover:bg-stone-100"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Đặt lại góc nhìn</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMarkers(!showMarkers)}
                  className={cn('h-8 w-8 cursor-pointer hover:bg-stone-100', showMarkers && 'bg-stone-100')}
                >
                  <Layers className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Bật/tắt điểm đánh dấu</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={cn('h-8 w-8 cursor-pointer hover:bg-stone-100', showOverlays && 'bg-stone-100')}
                >
                  <Image className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Bật/tắt lớp phủ</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 glass rounded-xl p-3">
        <p className="text-xs font-medium text-stone-700 mb-2">Chú thích</p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
            <span className="text-xs text-stone-600">Trống</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-xs text-stone-600">Đã bán</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-xs text-stone-600">Đặt cọc</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6B7280' }} />
            <span className="text-xs text-stone-600">Đã an táng</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-3 pt-2 border-t border-stone-200 space-y-1">
          <p className="text-xs text-stone-500">
            Vị trí: <span className="font-medium text-stone-700">{filteredGeoJSON?.features.length || 0}</span> / {plots.length}
          </p>
          <p className="text-xs text-stone-500">
            Lớp phủ: <span className="font-medium text-stone-700">{loadedOverlayIds.size}</span> / {overlays.length}
            {loadedOverlayIds.size > 0 && showOverlays && <span className="text-emerald-600"> ✓</span>}
            {!showOverlays && <span className="text-amber-600 text-[10px] ml-1">(tắt)</span>}
            {failedOverlayIds.size > 0 && <span className="text-red-500 text-[10px] ml-1">({failedOverlayIds.size} lỗi)</span>}
          </p>
          <p className="text-xs text-stone-500">
            Tâm linh: <span className="font-medium text-stone-700">{spiritualSites.length}</span>
          </p>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="absolute top-4 left-4 z-10 glass rounded-xl px-3 py-2">
        <p className="text-xs text-stone-600 font-mono">
          {viewState.latitude.toFixed(4)}°N, {viewState.longitude.toFixed(4)}°E | Zoom: {viewState.zoom.toFixed(1)}
        </p>
      </div>
    </div>
  )
}
