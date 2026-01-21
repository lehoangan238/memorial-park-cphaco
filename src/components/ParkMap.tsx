import { useCallback, useMemo, useState, useEffect } from 'react'
import Map, { NavigationControl, GeolocateControl, ScaleControl, Marker, Popup, Source, Layer } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ZoomIn, 
  ZoomOut, 
  Layers,
  MapPin,
  Droplets,
  Building2,
  Flower2,
  Car,
  Navigation,
  User,
  Flag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { graves, areas } from '@/data/graves_data'
import { landmarks } from '@/data/parkData'
import type { Grave, PlotStatus } from '@/types'
import { cn } from '@/lib/utils'
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre'
import { CEMETERY_GATE } from './RoutingPanel'
import { generateRouteGeoJSON } from './RoutingPanel'
import type { OSRMRoute } from '@/lib/routing'

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
  zoom: 16,
  pitch: 45,
  bearing: 0
}

// OpenStreetMap style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

interface ParkMapProps {
  onGraveSelect: (grave: Grave | null) => void
  selectedGrave: Grave | null
  searchQuery: string
  filterStatus: PlotStatus | 'all'
  flyToGrave?: Grave | null
  routingDestination?: Grave | null
  userLocation?: [number, number] | null
  onUserLocationChange?: (location: [number, number] | null) => void
  osrmRoute?: OSRMRoute | null
}

const statusColors: Record<PlotStatus, { fill: string; stroke: string; label: string; labelVi: string }> = {
  available: { fill: '#84a98c', stroke: '#52796f', label: 'Available', labelVi: 'Còn trống' },
  occupied: { fill: '#78716c', stroke: '#57534e', label: 'Occupied', labelVi: 'Đã sử dụng' },
  reserved: { fill: '#ca8a04', stroke: '#a16207', label: 'Reserved', labelVi: 'Đã đặt' },
  maintenance: { fill: '#dc2626', stroke: '#b91c1c', label: 'Maintenance', labelVi: 'Bảo trì' },
}

const landmarkIcons: Record<string, React.ReactNode> = {
  gate: <MapPin className="w-4 h-4" />,
  building: <Building2 className="w-4 h-4" />,
  droplet: <Droplets className="w-4 h-4" />,
  flower: <Flower2 className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
}

const landmarkToGeoCoords = (landmark: { x: number; y: number }) => {
  const lng = DEFAULT_CENTER[0] - 0.005 + (landmark.x / 750) * 0.01
  const lat = DEFAULT_CENTER[1] + 0.003 - (landmark.y / 420) * 0.006
  return { lng, lat }
}

export function ParkMap({ 
  onGraveSelect, 
  selectedGrave, 
  searchQuery, 
  filterStatus, 
  flyToGrave,
  routingDestination,
  userLocation,
  onUserLocationChange,
  osrmRoute
}: ParkMapProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const [showMarkers, setShowMarkers] = useState(true)
  const [hoveredGrave, setHoveredGrave] = useState<Grave | null>(null)

  // Generate route line GeoJSON from OSRM or fallback
  const routeGeoJSON = useMemo(() => {
    if (!routingDestination) return null
    
    const startPoint = userLocation || CEMETERY_GATE
    return generateRouteGeoJSON(osrmRoute || null, startPoint, routingDestination.coordinates)
  }, [routingDestination, userLocation, osrmRoute])

  // Fly to grave when flyToGrave prop changes
  useEffect(() => {
    if (flyToGrave) {
      setViewState(prev => ({
        ...prev,
        longitude: flyToGrave.coordinates[1],
        latitude: flyToGrave.coordinates[0],
        zoom: 19, // Zoom in closer when flying to a specific grave
        pitch: 60,
        bearing: 0
      }))
    }
  }, [flyToGrave])

  // Adjust view when routing starts to show the full route
  useEffect(() => {
    if (routingDestination) {
      const startPoint = userLocation || CEMETERY_GATE
      const midLat = (startPoint[0] + routingDestination.coordinates[0]) / 2
      const midLng = (startPoint[1] + routingDestination.coordinates[1]) / 2
      
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

  const filteredGraves = useMemo(() => {
    return graves.filter((grave) => {
      const matchesStatus = filterStatus === 'all' || grave.status === filterStatus
      const matchesSearch = !searchQuery || 
        grave.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grave.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grave.area.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [searchQuery, filterStatus])

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState)
  }, [])

  const handleZoomIn = useCallback(() => {
    setViewState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 20) }))
  }, [])

  const handleZoomOut = useCallback(() => {
    setViewState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 10) }))
  }, [])

  const handleReset = useCallback(() => {
    setViewState(INITIAL_VIEW_STATE)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* MapLibre GL Map */}
      <Map
        {...viewState}
        onMove={handleMove}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
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
            {/* Route line dashed overlay for animation effect */}
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
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg border-3 border-white">
                {userLocation ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Flag className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-emerald-500" />
            </motion.div>
          </Marker>
        )}

        {/* Destination Marker (highlighted) */}
        {routingDestination && (
          <Marker
            longitude={routingDestination.coordinates[1]}
            latitude={routingDestination.coordinates[0]}
            anchor="bottom"
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
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-3 border-white relative z-10">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-amber-500 z-10" />
            </motion.div>
          </Marker>
        )}

        {/* Grave Markers */}
        <AnimatePresence>
          {showMarkers && filteredGraves.map((grave) => {
            const isSelected = selectedGrave?.id === grave.id
            const colors = statusColors[grave.status]
            const areaInfo = areas.find(a => a.id === grave.area)

            return (
              <Marker
                key={grave.id}
                longitude={grave.coordinates[1]}
                latitude={grave.coordinates[0]}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  onGraveSelect(isSelected ? null : grave)
                }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.15 }}
                  className={cn(
                    "relative cursor-pointer transition-all duration-200",
                    isSelected && "z-10"
                  )}
                  onMouseEnter={() => setHoveredGrave(grave)}
                  onMouseLeave={() => setHoveredGrave(null)}
                >
                  {/* Marker Pin */}
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2",
                      isSelected && "ring-2 ring-sky-500 ring-offset-2"
                    )}
                    style={{ 
                      backgroundColor: colors.fill,
                      borderColor: isSelected ? '#0284c7' : colors.stroke,
                      boxShadow: isSelected ? '0 0 16px rgba(2, 132, 199, 0.6)' : '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    {grave.status === 'occupied' && grave.imageUrl ? (
                      <img 
                        src={grave.imageUrl} 
                        alt={grave.name || 'Memorial'} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white/80" />
                    )}
                  </div>
                  {/* Area indicator */}
                  {areaInfo && (
                    <div 
                      className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white"
                      style={{ backgroundColor: areaInfo.color }}
                    />
                  )}
                </motion.div>
              </Marker>
            )
          })}
        </AnimatePresence>

        {/* Hovered Grave Popup */}
        {hoveredGrave && (
          <Popup
            longitude={hoveredGrave.coordinates[1]}
            latitude={hoveredGrave.coordinates[0]}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
            offset={20}
          >
            <div className="p-3 min-w-[160px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-stone-500">{hoveredGrave.id}</span>
                <Badge 
                  variant={hoveredGrave.status === 'available' ? 'sage' : 'secondary'} 
                  className="text-[10px] py-0"
                >
                  {statusColors[hoveredGrave.status].labelVi}
                </Badge>
              </div>
              {hoveredGrave.name ? (
                <p className="font-semibold text-sm text-stone-900">{hoveredGrave.name}</p>
              ) : (
                <p className="text-sm text-stone-600 italic">
                  {hoveredGrave.status === 'available' ? 'Vị trí trống' : 'Đã đặt trước'}
                </p>
              )}
              <p className="text-xs text-stone-500 mt-1">{hoveredGrave.area}</p>
              {hoveredGrave.price && (
                <p className="text-xs font-semibold text-amber-600 mt-1">
                  {hoveredGrave.price.toLocaleString('vi-VN')} VNĐ
                </p>
              )}
            </div>
          </Popup>
        )}

        {/* Landmark Markers */}
        {showMarkers && landmarks.map((landmark) => {
          const coords = landmarkToGeoCoords(landmark)
          return (
            <Marker
              key={landmark.id}
              longitude={coords.lng}
              latitude={coords.lat}
              anchor="center"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center cursor-pointer shadow-lg"
                    >
                      <span className="text-amber-500">
                        {landmarkIcons[landmark.icon]}
                      </span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium text-xs">{landmark.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Marker>
          )
        })}
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
              <TooltipContent side="left">Zoom In</TooltipContent>
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
              <TooltipContent side="left">Zoom Out</TooltipContent>
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
              <TooltipContent side="left">Reset View</TooltipContent>
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
              <TooltipContent side="left">Toggle Markers</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 glass rounded-xl p-3">
        <p className="text-xs font-medium text-stone-700 mb-2">Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusColors).map(([status, { fill, label }]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: fill }}
              />
              <span className="text-xs text-stone-600">{label}</span>
            </div>
          ))}
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
