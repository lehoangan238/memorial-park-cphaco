import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, X, Clock, Footprints, AlertCircle, MapPin, ChevronUp, ChevronDown, Loader2 } from 'lucide-react'
import type { Grave } from '@/types'
import { getOSRMRoute, getDirectionsFromOSRM, type OSRMRoute } from '@/lib/routing'

// Cemetery gate coordinates (entrance) - [lat, lng]
export const CEMETERY_GATE: [number, number] = [11.168266, 106.651891]

/**
 * Calculate bearing direction name in Vietnamese
 */
function getBearingName(bearing: number): string {
  const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc']
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}

/**
 * Calculate bearing between two points [lat, lng]
 */
function calculateBearing(from: [number, number], to: [number, number]): number {
  const [lat1, lng1] = from.map(x => x * Math.PI / 180)
  const [lat2, lng2] = to.map(x => x * Math.PI / 180)
  
  const dLng = lng2 - lng1
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  const bearing = Math.atan2(y, x) * 180 / Math.PI
  
  return (bearing + 360) % 360
}

/**
 * Calculate distance between two points using Haversine formula [lat, lng]
 */
export function calculateDistance(from: [number, number], to: [number, number]): number {
  const R = 6371000 // Earth's radius in meters
  const [lat1, lng1] = from.map(x => x * Math.PI / 180)
  const [lat2, lng2] = to.map(x => x * Math.PI / 180)
  
  const dLat = lat2 - lat1
  const dLng = lng2 - lng1
  
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  
  return R * c
}

/**
 * Format distance for display
 */
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Format walking time from seconds
 */
function formatWalkingTime(seconds: number): string {
  const minutes = Math.ceil(seconds / 60)
  if (minutes < 1) return '< 1 phút'
  if (minutes === 1) return '1 phút'
  return `${minutes} phút`
}

/**
 * Generate route GeoJSON from OSRM or fallback to straight line
 */
export function generateRouteGeoJSON(route: OSRMRoute | null, from: [number, number], to: [number, number]) {
  if (route) {
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: route.geometry
    }
  }
  
  // Fallback: straight line
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [from[1], from[0]], // [lng, lat]
        [to[1], to[0]]
      ]
    }
  }
}

interface RoutingPanelProps {
  destination: Grave
  onClose: () => void
  userLocation?: [number, number] | null
  onRouteReady?: (route: OSRMRoute | null) => void
}

/**
 * Panel showing route from gate/user location to selected grave
 */
export function RoutingPanel({ destination, onClose, userLocation, onRouteReady }: RoutingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [route, setRoute] = useState<OSRMRoute | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const startPoint = userLocation || CEMETERY_GATE
  const destCoords = destination.coordinates

  // Fetch route from OSRM
  useEffect(() => {
    let cancelled = false
    
    async function fetchRoute() {
      setIsLoading(true)
      setError(null)
      
      const osrmRoute = await getOSRMRoute(
        startPoint[0], startPoint[1],
        destCoords[0], destCoords[1],
        'walking'
      )
      
      if (cancelled) return
      
      if (osrmRoute) {
        setRoute(osrmRoute)
        onRouteReady?.(osrmRoute)
      } else {
        setError('Không tìm được đường đi. Hiển thị đường thẳng.')
        onRouteReady?.(null)
      }
      
      setIsLoading(false)
    }
    
    fetchRoute()
    
    return () => { cancelled = true }
  }, [startPoint[0], startPoint[1], destCoords[0], destCoords[1], onRouteReady])

  const distance = route?.distance ?? calculateDistance(startPoint, destCoords)
  const duration = route?.duration ?? (distance / 1.33) // fallback: 80m/min = 1.33m/s
  const bearing = useMemo(() => calculateBearing(startPoint, destCoords), [startPoint, destCoords])
  const direction = getBearingName(bearing)
  
  const directions = useMemo(() => {
    if (route) {
      return getDirectionsFromOSRM(route)
    }
    return null
  }, [route])

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="font-semibold block text-sm">
                {isLoading ? 'Đang tìm đường...' : 'Đang dẫn đường'}
              </span>
              <span className="text-xs text-emerald-100">{destination.id} • {destination.area}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-colors duration-150"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-white" />
              ) : (
                <ChevronUp className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-colors duration-150"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Route Summary */}
              <div className="grid grid-cols-2 divide-x divide-stone-100 border-b border-stone-100">
                <div className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-1">
                    <Footprints className="w-3 h-3" />
                    <span>Khoảng cách</span>
                  </div>
                  <p className="font-bold text-2xl text-stone-900">
                    {isLoading ? '...' : formatDistance(distance)}
                  </p>
                </div>
                <div className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-1">
                    <Clock className="w-3 h-3" />
                    <span>Đi bộ</span>
                  </div>
                  <p className="font-bold text-2xl text-emerald-600">
                    {isLoading ? '...' : formatWalkingTime(duration)}
                  </p>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                  <p className="text-xs text-amber-700">{error}</p>
                </div>
              )}

              {/* Start/End Points */}
              <div className="px-4 py-3 border-b border-stone-100">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow" />
                    <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-stone-500">Điểm xuất phát</p>
                      <p className="text-sm font-medium text-stone-900">
                        {userLocation ? 'Vị trí của bạn' : 'Cổng chính nghĩa trang'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Điểm đến</p>
                      <p className="text-sm font-medium text-stone-900">
                        {destination.name || `Mộ phần ${destination.id}`}
                      </p>
                      <p className="text-xs text-stone-400">{destination.area}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Directions */}
              <div className="px-4 py-3">
                <h4 className="text-xs font-medium text-stone-500 mb-3 uppercase tracking-wide">
                  Hướng dẫn đi
                </h4>
                <ol className="space-y-3 max-h-48 overflow-y-auto">
                  {directions && directions.length > 0 ? (
                    // OSRM turn-by-turn directions
                    directions.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          index === directions.length - 1 ? 'bg-amber-500' : 'bg-emerald-100'
                        }`}>
                          {index === directions.length - 1 ? (
                            <MapPin className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <span className="text-xs font-bold text-emerald-700">{index + 1}</span>
                          )}
                        </div>
                        <div className="pt-1">
                          <p className="text-sm text-stone-700">{step.instruction}</p>
                          {step.distance > 10 && (
                            <p className="text-xs text-stone-400 mt-0.5">{formatDistance(step.distance)}</p>
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    // Fallback simple directions
                    <>
                      <li className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-emerald-700">1</span>
                        </div>
                        <div className="pt-1">
                          <p className="text-sm text-stone-700">
                            {userLocation ? 'Từ vị trí hiện tại' : 'Từ cổng chính'}, đi theo hướng <span className="font-semibold text-emerald-700">{direction}</span>
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-emerald-700">2</span>
                        </div>
                        <div className="pt-1">
                          <p className="text-sm text-stone-700">
                            Đi khoảng <span className="font-semibold">{formatDistance(distance)}</span>
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5">Theo biển chỉ dẫn {destination.area}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-medium text-stone-900">
                            Đến {destination.name || `mộ phần ${destination.id}`}
                          </p>
                        </div>
                      </li>
                    </>
                  )}
                </ol>
              </div>

              {/* Note */}
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Cần hỗ trợ? Liên hệ bảo vệ hoặc gọi Hotline: <span className="font-semibold">1900 xxxx</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Summary */}
        {!isExpanded && (
          <div className="px-4 py-2 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-stone-900">
                {isLoading ? '...' : formatDistance(distance)}
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-lg font-bold text-emerald-600">
                {isLoading ? '...' : formatWalkingTime(duration)}
              </span>
            </div>
            <span className="text-sm text-stone-500">Hướng {direction}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
