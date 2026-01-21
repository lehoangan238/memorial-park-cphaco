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
import type { MapLayerMouseEvent, MapRef, ViewStateChangeEvent } from 'react-map-gl/maplibre'
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
  Map as MapIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Compass } from '@/components/Compass'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow, OverlayRow, SpiritualSiteRow, PlotFeatureCollection } from '@/types/database'
import { cn } from '@/lib/utils'

// Hoa Viên coordinates
const DEFAULT_CENTER: [number, number] = [106.6521, 11.1836]

interface ViewState {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}

const INITIAL_VIEW_STATE: ViewState = {
  longitude: DEFAULT_CENTER[0],
  latitude: DEFAULT_CENTER[1],
  zoom: 17,
  pitch: 45,
  bearing: 0
}

// Map styles
const MAP_STYLES = {
  satellite: 'https://api.maptiler.com/maps/hybrid/style.json?key=get_your_key',
  // Fallback to free satellite style
  satelliteFree: {
    version: 8,
    sources: {
      'satellite': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '© Esri'
      }
    },
    layers: [
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  } as maplibregl.StyleSpecification,
  streets: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
}

// Circle layer paint
const plotsCirclePaint = {
  'circle-radius': [
    'interpolate', ['linear'], ['zoom'],
    14, 4, 17, 8, 19, 12, 22, 18
  ],
  'circle-color': ['get', '_statusColor'],
  'circle-stroke-color': '#ffffff',
  'circle-stroke-width': 2,
  'circle-opacity': 0.9
}

// Text label layer (visible at high zoom)
const plotsLabelPaint = {
  'text-color': '#1c1917',
  'text-halo-color': '#ffffff',
  'text-halo-width': 2
}

const plotsLabelLayout = {
  'text-field': ['get', 'name'],
  'text-size': [
    'interpolate', ['linear'], ['zoom'],
    17, 0,
    18, 10,
    20, 14
  ],
  'text-offset': [0, 1.5],
  'text-anchor': 'top',
  'text-optional': true
}

interface ParkMapProps {
  onPlotSelect: (plot: PlotRow | null) => void
  selectedPlot: PlotRow | null
  filterStatus: string
  flyToPlot?: PlotRow | null
}

export function ParkMapWithSatellite({ 
  onPlotSelect, 
  selectedPlot, 
  filterStatus,
  flyToPlot 
}: ParkMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('satellite')
  const [showOverlays, setShowOverlays] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null)
  const [loadedOverlayIds, setLoadedOverlayIds] = useState<Set<string>>(new Set())
  const [mapReady, setMapReady] = useState(false)

  const { 
    plots, 
    plotsGeoJSON, 
    overlays, 
    spiritualSites, 
    isLoading, 
    isError, 
    error 
  } = useMapData()

  // Filter plots
  const filteredGeoJSON = useMemo<PlotFeatureCollection | null>(() => {
    if (!plotsGeoJSON) return null
    const filtered = plotsGeoJSON.features.filter(feature => {
      return filterStatus === 'all' || feature.properties.status === filterStatus
    })
    return { type: 'FeatureCollection', features: filtered }
  }, [plotsGeoJSON, filterStatus])

  // Get hovered plot data
  const hoveredPlot = useMemo(() => {
    if (!hoveredPlotId || !plots) return null
    return plots.find(p => p.id === hoveredPlotId) || null
  }, [hoveredPlotId, plots])

  // Fly to plot
  useEffect(() => {
    if (flyToPlot) {
      setViewState(prev => ({
        ...prev,
        longitude: flyToPlot.lng,
        latitude: flyToPlot.lat,
        zoom: 19,
        pitch: 60
      }))
    }
  }, [flyToPlot])

  // Check if overlay is in viewport
  const isOverlayInViewport = useCallback((overlay: OverlayRow, bounds: maplibregl.LngLatBounds) => {
    const nw = { lng: Number(overlay.nw_lng), lat: Number(overlay.nw_lat) }
    const se = { lng: Number(overlay.se_lng), lat: Number(overlay.se_lat) }
    
    if (!isFinite(nw.lng) || !isFinite(nw.lat) || !isFinite(se.lng) || !isFinite(se.lat)) return false

    const overlayWest = Math.min(nw.lng, se.lng)
    const overlayEast = Math.max(nw.lng, se.lng)
    const overlaySouth = Math.min(nw.lat, se.lat)
    const overlayNorth = Math.max(nw.lat, se.lat)

    const expand = 0.2
    const viewW = bounds.getWest() - (bounds.getEast() - bounds.getWest()) * expand
    const viewE = bounds.getEast() + (bounds.getEast() - bounds.getWest()) * expand
    const viewS = bounds.getSouth() - (bounds.getNorth() - bounds.getSouth()) * expand
    const viewN = bounds.getNorth() + (bounds.getNorth() - bounds.getSouth()) * expand

    return !(overlayEast < viewW || overlayWest > viewE || overlayNorth < viewS || overlaySouth > viewN)
  }, [])

  // Lazy load overlays
  const loadVisibleOverlays = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map || !mapReady || overlays.length === 0) return

    const bounds = map.getBounds()
    if (!bounds) return

    overlays.forEach((overlay: OverlayRow) => {
      const sourceId = `overlay-${overlay.id}`
      const layerId = `overlay-layer-${overlay.id}`

      if (loadedOverlayIds.has(overlay.id)) return
      if (!isOverlayInViewport(overlay, bounds)) return

      const nw = { lng: Number(overlay.nw_lng), lat: Number(overlay.nw_lat) }
      const se = { lng: Number(overlay.se_lng), lat: Number(overlay.se_lat) }

      try {
        const coordinates: [[number, number], [number, number], [number, number], [number, number]] = [
          [nw.lng, nw.lat], [se.lng, nw.lat], [se.lng, se.lat], [nw.lng, se.lat]
        ]

        map.addSource(sourceId, { type: 'image', url: overlay.url, coordinates })
        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: { 'raster-opacity': 0.85, 'raster-fade-duration': 300 }
        })
        map.setLayoutProperty(layerId, 'visibility', showOverlays ? 'visible' : 'none')
        setLoadedOverlayIds(prev => new Set([...prev, overlay.id]))
      } catch (err) {
        console.error(`Failed to load overlay ${overlay.id}:`, err)
      }
    })

    // Move plot layers to top
    const plotLayers = ['plots-circle', 'plots-labels', 'plots-hover', 'plots-selected']
    plotLayers.forEach(id => {
      if (map.getLayer(id)) map.moveLayer(id)
    })
  }, [overlays, loadedOverlayIds, mapReady, isOverlayInViewport, showOverlays])

  useEffect(() => {
    if (mapReady && overlays.length > 0) {
      const timer = setTimeout(loadVisibleOverlays, 100)
      return () => clearTimeout(timer)
    }
  }, [mapReady, overlays.length, loadVisibleOverlays])

  // Toggle overlay visibility
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

  // Debounced move handler
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState)
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
    moveTimeoutRef.current = setTimeout(loadVisibleOverlays, 200)
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

  const handlePlotClick = useCallback((e: MapLayerMouseEvent) => {
    if (!e.features || e.features.length === 0) return
    const props = e.features[0].properties as PlotRow
    setViewState(prev => ({
      ...prev,
      longitude: props.lng,
      latitude: props.lat,
      zoom: Math.max(prev.zoom, 18)
    }))
    onPlotSelect(props)
  }, [onPlotSelect])

  const handlePlotHover = useCallback((e: MapLayerMouseEvent) => {
    setHoveredPlotId(e.features?.[0]?.properties?.id || null)
  }, [])

  const handlePlotLeave = useCallback(() => {
    setHoveredPlotId(null)
  }, [])

  const handleMapLoad = useCallback(() => {
    setMapReady(true)
  }, [])

  const toggleMapStyle = useCallback(() => {
    setMapStyle(prev => prev === 'satellite' ? 'streets' : 'satellite')
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
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
      <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-stone-900 font-medium mb-2">Không thể tải dữ liệu</p>
          <p className="text-stone-600 text-sm mb-4">{error?.message}</p>
          <Button onClick={() => window.location.reload()} variant="outline">Thử lại</Button>
        </div>
      </div>
    )
  }

  const currentMapStyle = mapStyle === 'satellite' ? MAP_STYLES.satelliteFree : MAP_STYLES.streets

  return (
    <div className="absolute inset-0 w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onLoad={handleMapLoad}
        mapStyle={currentMapStyle}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
        interactiveLayerIds={['plots-circle']}
        onClick={handlePlotClick}
        onMouseMove={handlePlotHover}
        onMouseLeave={handlePlotLeave}
        cursor={hoveredPlotId ? 'pointer' : 'grab'}
      >
        <NavigationControl position="bottom-right" showCompass={false} showZoom={false} />
        <GeolocateControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {/* Plots GeoJSON */}
        {filteredGeoJSON && (
          <Source id="plots" type="geojson" data={filteredGeoJSON}>
            {/* Circle layer */}
            <Layer id="plots-circle" type="circle" paint={plotsCirclePaint as any} />
            
            {/* Labels at high zoom */}
            <Layer 
              id="plots-labels" 
              type="symbol" 
              layout={plotsLabelLayout as any}
              paint={plotsLabelPaint as any}
              minzoom={18}
            />
            
            {/* Hover effect */}
            {hoveredPlotId && (
              <Layer
                id="plots-hover"
                type="circle"
                filter={['==', ['get', 'id'], hoveredPlotId]}
                paint={{
                  'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 8, 17, 14, 19, 20, 22, 28],
                  'circle-color': 'rgba(59, 130, 246, 0.3)',
                  'circle-stroke-color': '#3B82F6',
                  'circle-stroke-width': 2
                } as any}
              />
            )}
            
            {/* Selected plot */}
            {selectedPlot && (
              <Layer
                id="plots-selected"
                type="circle"
                filter={['==', ['get', 'id'], selectedPlot.id]}
                paint={{
                  'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 10, 17, 16, 19, 24, 22, 32],
                  'circle-color': 'rgba(59, 130, 246, 0.2)',
                  'circle-stroke-color': '#2563EB',
                  'circle-stroke-width': 3
                } as any}
              />
            )}
          </Source>
        )}

        {/* Hovered plot popup */}
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
                <Badge variant={hoveredPlot.status === 'Trống' ? 'sage' : 'secondary'} className="text-[10px] py-0">
                  {hoveredPlot.status}
                </Badge>
              </div>
              {hoveredPlot.name && (
                <p className="font-semibold text-sm text-stone-900">{hoveredPlot.name}</p>
              )}
              <p className="text-xs text-stone-500 mt-1">{hoveredPlot.zone || 'Khu vực chung'}</p>
              {hoveredPlot.price && (
                <p className="text-xs font-semibold text-amber-600 mt-1">
                  {hoveredPlot.price.toLocaleString('vi-VN')} VNĐ
                </p>
              )}
            </div>
          </Popup>
        )}

        {/* Spiritual Sites Markers */}
        <AnimatePresence>
          {showMarkers && spiritualSites.map((site: SpiritualSiteRow) => (
            <Marker key={site.id} longitude={site.lng} latitude={site.lat} anchor="center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
                        {site.image_url ? (
                          <img src={site.image_url} alt={site.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <Church className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-medium text-sm">{site.name}</p>
                    {site.type && <p className="text-xs text-stone-500">{site.type}</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Marker>
          ))}
        </AnimatePresence>
      </Map>

      {/* Compass */}
      <div className="absolute top-4 right-4 z-10">
        <Compass bearing={viewState.bearing} />
      </div>

      {/* Map Controls */}
      <div className="absolute top-24 right-4 z-10 flex flex-col gap-2">
        <div className="glass rounded-xl p-1 flex flex-col gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Phóng to</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Thu nhỏ</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8">
                  <Navigation className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Đặt lại góc nhìn</TooltipContent>
            </Tooltip>

            <div className="h-px bg-stone-200 my-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMapStyle}
                  className={cn('h-8 w-8', mapStyle === 'satellite' && 'bg-stone-100')}
                >
                  <MapIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {mapStyle === 'satellite' ? 'Bản đồ đường' : 'Bản đồ vệ tinh'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMarkers(!showMarkers)}
                  className={cn('h-8 w-8', showMarkers && 'bg-stone-100')}
                >
                  <Layers className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Bật/tắt điểm tâm linh</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={cn('h-8 w-8', showOverlays && 'bg-stone-100')}
                >
                  <Image className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Bật/tắt bản vẽ CAD</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 glass rounded-xl p-3">
        <p className="text-xs font-medium text-stone-700 mb-2">Chú thích</p>
        <div className="flex flex-wrap gap-2">
          {[
            { color: '#10B981', label: 'Trống' },
            { color: '#EF4444', label: 'Đã bán' },
            { color: '#F59E0B', label: 'Đặt cọc' },
            { color: '#6B7280', label: 'Đã an táng' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-stone-600">{item.label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-2 border-t border-stone-200 space-y-1">
          <p className="text-xs text-stone-500">
            Vị trí: <span className="font-medium text-stone-700">{filteredGeoJSON?.features.length || 0}</span> / {plots.length}
          </p>
          <p className="text-xs text-stone-500">
            Lớp phủ: <span className="font-medium text-stone-700">{loadedOverlayIds.size}</span> / {overlays.length}
          </p>
        </div>
      </div>

      {/* Coordinates */}
      <div className="absolute top-4 left-4 z-10 glass rounded-xl px-3 py-2">
        <p className="text-xs text-stone-600 font-mono">
          {viewState.latitude.toFixed(4)}°N, {viewState.longitude.toFixed(4)}°E | Zoom: {viewState.zoom.toFixed(1)}
        </p>
      </div>
    </div>
  )
}