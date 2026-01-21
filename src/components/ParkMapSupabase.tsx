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
  Image,
  Flag,
  User,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow, OverlayRow, SpiritualSiteRow, PlotFeatureCollection } from '@/types/database'
import { cn } from '@/lib/utils'
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre'
import { findRoute, getOSRMRoute, type OSRMRoute } from '@/lib/routing'

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
  pitch: 45,
  bearing: 0
}

// Map style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

interface ParkMapProps {
  onPlotSelect: (plot: PlotRow | null) => void
  selectedPlot: PlotRow | null
  filterStatus: string
  flyToPlot?: PlotRow | null
  routingDestination?: PlotRow | null
  userLocation?: [number, number] | null
  onUserLocationChange?: (location: [number, number] | null) => void
  osrmRoute?: OSRMRoute | null
}

// Cemetery gate coordinates (entrance) - [lat, lng]
const CEMETERY_GATE: [number, number] = [11.168266, 106.651891]

// Circle layer paint for plots
const plotsCirclePaint = {
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    14, 4,
    17, 8,
    19, 12,
    22, 18
  ],
  'circle-color': ['get', '_statusColor'],
  'circle-stroke-color': '#ffffff',
  'circle-stroke-width': 2,
  'circle-opacity': 0.9
}

// Circle layer for hover effect
const plotsHoverPaint = {
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    14, 8,
    17, 14,
    19, 20,
    22, 28
  ],
  'circle-color': 'rgba(59, 130, 246, 0.3)',
  'circle-stroke-color': '#3B82F6',
  'circle-stroke-width': 2
}

export function ParkMapSupabase({ 
  onPlotSelect, 
  selectedPlot, 
  filterStatus,
  flyToPlot,
  routingDestination,
  userLocation,
  onUserLocationChange,
  osrmRoute
}: ParkMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const [showOverlays, setShowOverlays] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null)
  const [loadedOverlayIds, setLoadedOverlayIds] = useState<Set<string>>(new Set())
  const [mapReady, setMapReady] = useState(false)

  // Fetch data from Supabase
  const { 
    plots, 
    plotsGeoJSON, 
    overlays, 
    spiritualSites,
    roadNodes,
    roadEdges,
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

  // Generate route line GeoJSON - prioritize OSRM route
  const routeGeoJSON = useMemo(() => {
    if (!routingDestination) return null
    
    const startPoint = userLocation || CEMETERY_GATE
    const destCoords: [number, number] = [routingDestination.lat, routingDestination.lng]
    
    // Use OSRM route if available
    if (osrmRoute && osrmRoute.geometry) {
      console.log('🗺️ Using OSRM route with', osrmRoute.geometry.coordinates.length, 'points')
      return {
        type: 'Feature' as const,
        properties: { source: 'osrm', distance: osrmRoute.distance },
        geometry: osrmRoute.geometry
      }
    }
    
    // Fallback: Try internal road network
    if (roadNodes.length > 0 && roadEdges.length > 0) {
      const route = findRoute(
        startPoint[0], startPoint[1],
        destCoords[0], destCoords[1],
        roadNodes,
        roadEdges
      )
      
      if (route && route.coordinates.length > 0) {
        console.log('🛤️ Using internal road network')
        return {
          type: 'Feature' as const,
          properties: { source: 'internal', distance: route.totalDistance },
          geometry: {
            type: 'LineString' as const,
            coordinates: route.coordinates.map(([lat, lng]) => [lng, lat])
          }
        }
      }
    }
    
    // Final fallback: straight line
    console.log('📍 Using straight line fallback')
    return {
      type: 'Feature' as const,
      properties: { source: 'fallback' },
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [startPoint[1], startPoint[0]],
          [destCoords[1], destCoords[0]]
        ]
      }
    }
  }, [routingDestination, userLocation, osrmRoute, roadNodes, roadEdges])

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

  // Adjust view when routing starts to show the full route
  useEffect(() => {
    if (routingDestination) {
      const startPoint = userLocation || CEMETERY_GATE
      const midLat = (startPoint[0] + routingDestination.lat) / 2
      const midLng = (startPoint[1] + routingDestination.lng) / 2
      
      setViewState(prev => ({
        ...prev,
        longitude: midLng,
        latitude: midLat,
        zoom: 17,
        pitch: 45,
        bearing: 0
      }))
    }
  }, [routingDestination, userLocation])

  // Handle geolocate event
  const handleGeolocate = useCallback((e: { coords: { latitude: number; longitude: number } }) => {
    if (onUserLocationChange) {
      onUserLocationChange([e.coords.latitude, e.coords.longitude])
    }
  }, [onUserLocationChange])

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

  // Lazy load overlays based on viewport - runs on map move
  const loadVisibleOverlays = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map || !mapReady || overlays.length === 0) return

    const bounds = map.getBounds()
    if (!bounds) return

    let newlyLoaded = 0

    overlays.forEach((overlay: OverlayRow) => {
      const sourceId = `overlay-${overlay.id}`
      const layerId = `overlay-layer-${overlay.id}`

      // Skip if already loaded
      if (loadedOverlayIds.has(overlay.id)) return

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

      try {
        // Image overlay coordinates: [top-left, top-right, bottom-right, bottom-left]
        const coordinates: [[number, number], [number, number], [number, number], [number, number]] = [
          [nwLng, nwLat], // Top Left (NW)
          [seLng, nwLat], // Top Right (NE)
          [seLng, seLat], // Bottom Right (SE)
          [nwLng, seLat]  // Bottom Left (SW)
        ]

        map.addSource(sourceId, {
          type: 'image',
          url: overlay.url,
          coordinates: coordinates
        })

        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: { 
            'raster-opacity': 0.85,
            'raster-fade-duration': 300 // Smooth fade-in
          }
        })

        // Apply current visibility state
        map.setLayoutProperty(layerId, 'visibility', showOverlays ? 'visible' : 'none')

        newlyLoaded++
        setLoadedOverlayIds(prev => new Set([...prev, overlay.id]))

        console.log(`[Overlays] Lazy loaded: ${overlay.name || overlay.id}`)
      } catch (err) {
        console.error(`[Overlays] Failed to add overlay ${overlay.id}:`, err)
      }
    })

    // Move plot layers to top after loading new overlays
    if (newlyLoaded > 0) {
      const plotLayers = ['plots-circle', 'plots-hover', 'plots-selected']
      plotLayers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.moveLayer(layerId)
        }
      })
      console.log(`[Overlays] Loaded ${newlyLoaded} new overlays, total: ${loadedOverlayIds.size + newlyLoaded}/${overlays.length}`)
    }
  }, [overlays, loadedOverlayIds, mapReady, isOverlayInViewport, showOverlays])

  // Initial load of visible overlays when map is ready
  useEffect(() => {
    if (mapReady && overlays.length > 0) {
      // Small delay to ensure map is fully rendered
      const timer = setTimeout(loadVisibleOverlays, 100)
      return () => clearTimeout(timer)
    }
  }, [mapReady, overlays.length, loadVisibleOverlays])

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
          onGeolocate={handleGeolocate}
          trackUserLocation
        />
        <ScaleControl position="bottom-left" />

        {/* Route Line */}
        {routeGeoJSON && (
          <>
            {/* Route line shadow */}
            <Source id="route-shadow" type="geojson" data={routeGeoJSON}>
              <Layer
                id="route-shadow-layer"
                type="line"
                paint={{
                  'line-color': '#000000',
                  'line-width': 8,
                  'line-opacity': 0.15,
                  'line-blur': 3
                }}
              />
            </Source>
            {/* Route line */}
            <Source id="route" type="geojson" data={routeGeoJSON}>
              <Layer
                id="route-layer"
                type="line"
                paint={{
                  'line-color': '#10b981',
                  'line-width': 5,
                  'line-opacity': 0.9
                }}
              />
            </Source>
            {/* Route line dashed overlay */}
            <Source id="route-dash" type="geojson" data={routeGeoJSON}>
              <Layer
                id="route-dash-layer"
                type="line"
                paint={{
                  'line-color': '#ffffff',
                  'line-width': 2,
                  'line-dasharray': [2, 4],
                  'line-opacity': 0.8
                }}
              />
            </Source>
          </>
        )}

        {/* Start Point Marker (Gate or User Location) */}
        {routingDestination && (
          <Marker
            longitude={userLocation ? userLocation[1] : CEMETERY_GATE[1]}
            latitude={userLocation ? userLocation[0] : CEMETERY_GATE[0]}
            anchor="center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg border-2 border-white">
                {userLocation ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Flag className="w-5 h-5 text-white" />
                )}
              </div>
            </motion.div>
          </Marker>
        )}

        {/* Destination Marker (highlighted) */}
        {routingDestination && (
          <Marker
            longitude={routingDestination.lng}
            latitude={routingDestination.lat}
            anchor="center"
          >
            <motion.div
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="relative"
            >
              {/* Pulse animation */}
              <div className="absolute inset-0 -m-2">
                <div className="w-14 h-14 rounded-full bg-amber-500/30 animate-ping" />
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white relative z-10">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </Marker>
        )}

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
            {loadedOverlayIds.size < overlays.length && <span className="text-stone-400 text-[10px] ml-1">(lazy)</span>}
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
