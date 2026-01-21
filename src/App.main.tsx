import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ParkMapSupabase } from '@/components/ParkMapSupabase'
import { PlotEditDrawer } from '@/components/PlotEditDrawer'
import { AuthHeader } from '@/components/AuthHeader'
import { SidebarSkeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { LoginPage } from '@/pages/LoginPage'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow } from '@/types/database'
import { findRoute, formatDistance, formatWalkingTime, getBearingName, getOSRMRoute, getDirectionsFromOSRM, calculateDistance, type OSRMRoute } from '@/lib/routing'
import { 
  X, 
  Navigation, 
  Clock, 
  Footprints, 
  AlertCircle, 
  MapPin,
  ChevronUp,
  ChevronDown,
  Loader2,
  Navigation2,
  CheckCircle2
} from 'lucide-react'

// Cemetery gate coordinates (entrance) - [lat, lng]
const CEMETERY_GATE: [number, number] = [11.168266, 106.651891]

// Find closest point on route to user location
function findProgressOnRoute(
  userLat: number, 
  userLng: number, 
  routeCoords: [number, number][] // [lng, lat] format from OSRM
): { 
  closestIndex: number
  distanceToRoute: number
  remainingDistance: number
  progress: number // 0-100%
} {
  let closestIndex = 0
  let minDistance = Infinity
  
  // Find closest point on route
  for (let i = 0; i < routeCoords.length; i++) {
    const [lng, lat] = routeCoords[i]
    const dist = calculateDistance(userLat, userLng, lat, lng)
    if (dist < minDistance) {
      minDistance = dist
      closestIndex = i
    }
  }
  
  // Calculate remaining distance from closest point to end
  let remainingDistance = 0
  for (let i = closestIndex; i < routeCoords.length - 1; i++) {
    const [lng1, lat1] = routeCoords[i]
    const [lng2, lat2] = routeCoords[i + 1]
    remainingDistance += calculateDistance(lat1, lng1, lat2, lng2)
  }
  
  // Calculate total route distance
  let totalDistance = 0
  for (let i = 0; i < routeCoords.length - 1; i++) {
    const [lng1, lat1] = routeCoords[i]
    const [lng2, lat2] = routeCoords[i + 1]
    totalDistance += calculateDistance(lat1, lng1, lat2, lng2)
  }
  
  const progress = totalDistance > 0 
    ? Math.min(100, Math.max(0, ((totalDistance - remainingDistance) / totalDistance) * 100))
    : 0
  
  return {
    closestIndex,
    distanceToRoute: minDistance,
    remainingDistance,
    progress
  }
}

interface MainAppProps {
  onNavigateToLogin: () => void
}

function MainApp({ onNavigateToLogin }: MainAppProps) {
  const [selectedPlot, setSelectedPlot] = useState<PlotRow | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'map' | 'overview'>('map')
  const [flyToPlot, setFlyToPlot] = useState<PlotRow | null>(null)
  const [routingDestination, setRoutingDestination] = useState<PlotRow | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isRoutingPanelExpanded, setIsRoutingPanelExpanded] = useState(true)
  const [osrmRoute, setOsrmRoute] = useState<OSRMRoute | null>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false) // Real-time navigation mode

  const { plots, roadNodes, roadEdges, isLoading, isError, error, refetch } = useMapData()

  // Calculate real-time progress when navigating
  const navigationProgress = useMemo(() => {
    if (!isNavigating || !userLocation || !osrmRoute?.geometry?.coordinates) {
      return null
    }
    
    return findProgressOnRoute(
      userLocation[0], 
      userLocation[1], 
      osrmRoute.geometry.coordinates
    )
  }, [isNavigating, userLocation, osrmRoute])

  // Get current step based on progress
  const currentStepIndex = useMemo(() => {
    if (!navigationProgress || !osrmRoute) return 0
    
    const directions = getDirectionsFromOSRM(osrmRoute)
    if (!directions.length) return 0
    
    // Find which step we're on based on distance traveled
    let distanceCovered = 0
    const totalDistance = osrmRoute.distance
    const distanceTraveled = totalDistance * (navigationProgress.progress / 100)
    
    for (let i = 0; i < directions.length; i++) {
      distanceCovered += directions[i].distance
      if (distanceCovered >= distanceTraveled) {
        return i
      }
    }
    
    return directions.length - 1
  }, [navigationProgress, osrmRoute])

  const handlePlotSelect = useCallback((plot: PlotRow | null) => {
    setSelectedPlot(plot)
  }, [])

  const handleSearchResultSelect = useCallback((plot: PlotRow) => {
    setActiveTab('map')
    setIsMenuOpen(false)
    setFlyToPlot(plot)
    setSelectedPlot(plot)
    setTimeout(() => setFlyToPlot(null), 100)
  }, [])

  const handlePlotUpdate = useCallback((updatedPlot: PlotRow) => {
    setSelectedPlot(updatedPlot)
    refetch()
  }, [refetch])

  const handleFilterChange = useCallback((status: string) => {
    setFilterStatus(status)
  }, [])

  // Start in-app routing
  const handleStartRouting = useCallback((plot: PlotRow) => {
    setRoutingDestination(plot)
    setActiveTab('map')
    setSelectedPlot(null)
    setIsRoutingPanelExpanded(true)
  }, [])

  // Stop routing
  const handleStopRouting = useCallback(() => {
    setRoutingDestination(null)
    setOsrmRoute(null)
    setRouteError(null)
    setIsNavigating(false)
  }, [])

  // Start real-time navigation
  const handleStartNavigation = useCallback(() => {
    setIsNavigating(true)
  }, [])

  // Fetch OSRM route when destination changes
  useEffect(() => {
    if (!routingDestination) {
      setOsrmRoute(null)
      setRouteError(null)
      return
    }

    const startPoint = userLocation || CEMETERY_GATE
    const destCoords: [number, number] = [routingDestination.lat, routingDestination.lng]

    console.log('🚀 Starting OSRM fetch...', {
      start: startPoint,
      dest: destCoords,
      plot: routingDestination.id
    })

    setIsLoadingRoute(true)
    setRouteError(null)

    getOSRMRoute(
      startPoint[0], startPoint[1],
      destCoords[0], destCoords[1],
      'foot'
    ).then(route => {
      if (route) {
        setOsrmRoute(route)
        console.log('✅ OSRM route loaded:', route.distance, 'm', route.geometry.coordinates.length, 'points')
      } else {
        setRouteError('Không tìm được đường đi theo đường thực tế')
        console.log('⚠️ OSRM route not found, using fallback')
      }
    }).catch(err => {
      console.error('❌ OSRM error:', err)
      setRouteError('Lỗi khi tìm đường')
    }).finally(() => {
      setIsLoadingRoute(false)
    })
  }, [routingDestination, userLocation])

  const handleTabChange = useCallback((tab: 'map' | 'overview') => {
    setActiveTab(tab)
  }, [])

  const filteredPlots = plots.filter(plot => {
    return filterStatus === 'all' || plot.status === filterStatus
  })

  const stats = {
    total: plots.length,
    available: plots.filter(p => p.status === 'Trống').length,
    sold: plots.filter(p => p.status === 'Đã bán').length,
    reserved: plots.filter(p => p.status === 'Đặt cọc').length
  }

  return (
    <div className="relative min-h-screen bg-background kiosk-full-height overflow-hidden">
      {/* Full-Screen Map */}
      {activeTab === 'map' && (
        <div className="fixed inset-0 z-0">
          <ParkMapSupabase
            onPlotSelect={handlePlotSelect}
            selectedPlot={selectedPlot}
            filterStatus={filterStatus}
            flyToPlot={flyToPlot}
            routingDestination={routingDestination}
            userLocation={userLocation}
            onUserLocationChange={setUserLocation}
            osrmRoute={osrmRoute}
          />
        </div>
      )}

      {/* Integrated Header with Tabs & Filters */}
      <AuthHeader
        plots={plots}
        isLoading={isLoading}
        onSearchResultSelect={handleSearchResultSelect}
        onRefetch={refetch}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        onNavigateToLogin={onNavigateToLogin}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        filterStatus={filterStatus}
        onFilterChange={handleFilterChange}
      />

      {/* Overview Content - Only show when overview tab is active */}
      {activeTab === 'overview' && (
        <main className="relative z-10 pt-28 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-6 shadow-lg">
              {isLoading ? (
                <SidebarSkeleton />
              ) : isError ? (
                <div className="text-center py-8">
                  <p className="text-red-600 font-medium mb-2">Không thể tải dữ liệu</p>
                  <p className="text-stone-500 text-sm mb-4">{error?.message}</p>
                  <Button onClick={() => refetch()} variant="outline">
                    Thử lại
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center shadow">
                      <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
                      <p className="text-sm text-stone-500">Tổng số</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
                      <p className="text-sm text-emerald-700">Còn trống</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">{stats.sold}</p>
                      <p className="text-sm text-red-700">Đã bán</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-amber-600">{stats.reserved}</p>
                      <p className="text-sm text-amber-700">Đặt cọc</p>
                    </div>
                  </div>

                  {/* Plot List */}
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {filteredPlots.slice(0, 20).map((plot) => (
                      <button
                        key={plot.id}
                        onClick={() => handleSearchResultSelect(plot)}
                        className="w-full bg-white rounded-xl p-4 text-left hover:shadow-md transition-shadow cursor-pointer border border-stone-100"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-stone-900">{plot.name || plot.id}</p>
                            <p className="text-xs text-stone-500 mt-1">{plot.zone || 'Khu vực chung'}</p>
                          </div>
                          <Badge 
                            variant={plot.status === 'Trống' ? 'sage' : 'secondary'}
                            className="text-xs"
                          >
                            {plot.status}
                          </Badge>
                        </div>
                        {plot.price && (
                          <p className="text-sm font-semibold text-amber-600 mt-2">
                            {plot.price.toLocaleString('vi-VN')} VNĐ
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Plot Details Drawer */}
      <PlotEditDrawer
        plot={selectedPlot}
        onClose={() => setSelectedPlot(null)}
        onUpdate={handlePlotUpdate}
        onStartRouting={handleStartRouting}
      />

      {/* Routing Panel */}
      <AnimatePresence>
        {routingDestination && (
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
                    {isLoadingRoute ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold block text-sm">
                      {isLoadingRoute ? 'Đang tìm đường...' : 'Đang dẫn đường'}
                    </span>
                    <span className="text-xs text-emerald-100">{routingDestination.id} • {routingDestination.zone || 'Khu vực chung'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsRoutingPanelExpanded(!isRoutingPanelExpanded)}
                    className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                  >
                    {isRoutingPanelExpanded ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronUp className="w-5 h-5 text-white" />}
                  </button>
                  <button onClick={handleStopRouting} className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-colors">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isRoutingPanelExpanded && (() => {
                  const startPoint = userLocation || CEMETERY_GATE
                  const destCoords: [number, number] = [routingDestination.lat, routingDestination.lng]
                  
                  // Use OSRM route if available, otherwise fallback to internal routing
                  const internalRoute = roadNodes.length > 0 && roadEdges.length > 0
                    ? findRoute(startPoint[0], startPoint[1], destCoords[0], destCoords[1], roadNodes, roadEdges)
                    : null
                  
                  // Prioritize OSRM
                  const distance = osrmRoute?.distance ?? internalRoute?.totalDistance ?? 0
                  const direction = getBearingName(startPoint[0], startPoint[1], destCoords[0], destCoords[1])
                  
                  // Format walking time - OSRM gives duration in seconds
                  const walkingTime = osrmRoute?.duration 
                    ? `${Math.ceil(osrmRoute.duration / 60)} phút`
                    : formatWalkingTime(distance)
                  
                  // Get OSRM directions
                  const osrmDirections = osrmRoute ? getDirectionsFromOSRM(osrmRoute) : null

                  return (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Route source indicator */}
                      {osrmRoute && !isNavigating && (
                        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                          <span className="text-xs text-emerald-700">✓ Đường đi theo đường thực tế</span>
                          {userLocation && (
                            <button
                              onClick={handleStartNavigation}
                              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                            >
                              Bắt đầu dẫn đường
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Real-time navigation mode */}
                      {isNavigating && navigationProgress && (
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Navigation2 className="w-4 h-4 animate-pulse" />
                              <span className="text-sm font-medium">Đang dẫn đường</span>
                            </div>
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                              {Math.round(navigationProgress.progress)}% hoàn thành
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-white rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${navigationProgress.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          
                          {/* Remaining info */}
                          <div className="flex items-center justify-between mt-2 text-xs text-blue-100">
                            <span>Còn {formatDistance(navigationProgress.remainingDistance)}</span>
                            <span>~{Math.ceil(navigationProgress.remainingDistance / 80)} phút</span>
                          </div>
                          
                          {/* Off-route warning */}
                          {navigationProgress.distanceToRoute > 50 && (
                            <div className="mt-2 flex items-center gap-1 text-amber-200 text-xs">
                              <AlertCircle className="w-3 h-3" />
                              <span>Bạn đang cách đường {Math.round(navigationProgress.distanceToRoute)}m</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {routeError && (
                        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <p className="text-xs text-amber-700">{routeError}</p>
                        </div>
                      )}
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 divide-x divide-stone-100 border-b border-stone-100">
                        <div className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-1">
                            <Footprints className="w-3 h-3" /><span>Còn lại</span>
                          </div>
                          <p className="font-bold text-2xl text-stone-900">
                            {isLoadingRoute ? '...' : (
                              isNavigating && navigationProgress 
                                ? formatDistance(navigationProgress.remainingDistance)
                                : (distance > 0 ? formatDistance(distance) : '---')
                            )}
                          </p>
                        </div>
                        <div className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-1">
                            <Clock className="w-3 h-3" /><span>Thời gian</span>
                          </div>
                          <p className="font-bold text-2xl text-emerald-600">
                            {isLoadingRoute ? '...' : (
                              isNavigating && navigationProgress
                                ? `${Math.ceil(navigationProgress.remainingDistance / 80)} phút`
                                : (distance > 0 ? walkingTime : '---')
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Route Points */}
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
                              <p className="text-sm font-medium text-stone-900">{userLocation ? 'Vị trí của bạn' : 'Cổng chính nghĩa trang'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-stone-500">Điểm đến</p>
                              <p className="text-sm font-medium text-stone-900">{routingDestination.name || `Vị trí ${routingDestination.id}`}</p>
                              <p className="text-xs text-stone-400">{routingDestination.zone || 'Khu vực chung'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Directions */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-medium text-stone-500 mb-3 uppercase tracking-wide">Hướng dẫn đi</h4>
                        <ol className="space-y-3 max-h-48 overflow-y-auto">
                          {osrmDirections && osrmDirections.length > 0 ? (
                            // OSRM turn-by-turn directions
                            osrmDirections.map((step, index) => {
                              const isCompleted = isNavigating && index < currentStepIndex
                              const isCurrent = isNavigating && index === currentStepIndex
                              const isLast = index === osrmDirections.length - 1
                              
                              return (
                                <li key={index} className={`flex items-start gap-3 transition-opacity ${isCompleted ? 'opacity-50' : ''}`}>
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                    isCompleted ? 'bg-emerald-500' :
                                    isCurrent ? 'bg-blue-500 ring-2 ring-blue-300 ring-offset-1' :
                                    isLast ? 'bg-amber-500' : 'bg-emerald-100'
                                  }`}>
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    ) : isLast ? (
                                      <MapPin className="w-3.5 h-3.5 text-white" />
                                    ) : isCurrent ? (
                                      <Navigation2 className="w-3.5 h-3.5 text-white animate-pulse" />
                                    ) : (
                                      <span className="text-xs font-bold text-emerald-700">{index + 1}</span>
                                    )}
                                  </div>
                                  <div className="pt-1">
                                    <p className={`text-sm ${isCurrent ? 'font-semibold text-blue-700' : isCompleted ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                                      {step.instruction}
                                    </p>
                                    {step.distance > 10 && !isCompleted && (
                                      <p className="text-xs text-stone-400 mt-0.5">{formatDistance(step.distance)}</p>
                                    )}
                                  </div>
                                </li>
                              )
                            })
                          ) : internalRoute && internalRoute.path.length > 0 ? (
                            // Internal road network directions
                            internalRoute.path.map((node, index) => (
                              <li key={node.id} className="flex items-start gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                  index === internalRoute.path.length - 1 ? 'bg-amber-500' : 'bg-emerald-100'
                                }`}>
                                  {index === internalRoute.path.length - 1 ? (
                                    <MapPin className="w-3.5 h-3.5 text-white" />
                                  ) : (
                                    <span className="text-xs font-bold text-emerald-700">{index + 1}</span>
                                  )}
                                </div>
                                <p className={`text-sm pt-1 ${index === internalRoute.path.length - 1 ? 'font-medium text-stone-900' : 'text-stone-700'}`}>
                                  {node.name || (index === 0 ? 'Điểm xuất phát' : `Điểm ${index + 1}`)}
                                </p>
                              </li>
                            ))
                          ) : (
                            // Fallback simple directions
                            <>
                              <li className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                  <span className="text-xs font-bold text-emerald-700">1</span>
                                </div>
                                <p className="text-sm text-stone-700 pt-1">
                                  {userLocation ? 'Từ vị trí hiện tại' : 'Từ cổng chính'}, đi theo hướng <span className="font-semibold text-emerald-700">{direction}</span>
                                </p>
                              </li>
                              <li className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                                  <MapPin className="w-3.5 h-3.5 text-white" />
                                </div>
                                <p className="text-sm font-medium text-stone-900 pt-1">Đến {routingDestination.name || `vị trí ${routingDestination.id}`}</p>
                              </li>
                            </>
                          )}
                        </ol>
                      </div>

                      {/* Note */}
                      <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700">Cần hỗ trợ? Liên hệ bảo vệ hoặc gọi Hotline: <span className="font-semibold">1900 xxxx</span></p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })()}
              </AnimatePresence>

              {/* Collapsed Summary */}
              {!isRoutingPanelExpanded && (() => {
                const startPoint = userLocation || CEMETERY_GATE
                const destCoords: [number, number] = [routingDestination.lat, routingDestination.lng]
                const internalRoute = roadNodes.length > 0 && roadEdges.length > 0
                  ? findRoute(startPoint[0], startPoint[1], destCoords[0], destCoords[1], roadNodes, roadEdges)
                  : null
                const distance = osrmRoute?.distance ?? internalRoute?.totalDistance ?? 0
                const direction = getBearingName(startPoint[0], startPoint[1], destCoords[0], destCoords[1])
                const walkingTime = osrmRoute?.duration 
                  ? `${Math.ceil(osrmRoute.duration / 60)} phút`
                  : formatWalkingTime(distance)
                
                return (
                  <div className="px-4 py-2 flex items-center justify-between bg-stone-50">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-stone-900">
                        {isLoadingRoute ? '...' : (distance > 0 ? formatDistance(distance) : '---')}
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {isLoadingRoute ? '...' : (distance > 0 ? walkingTime : '---')}
                      </span>
                    </div>
                    <span className="text-sm text-stone-500">Hướng {direction}</span>
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// App Router - Simple state-based routing (no react-router needed)
function AppRouter() {
  const [currentPage, setCurrentPage] = useState<'main' | 'login'>('main')
  const { isAuthenticated } = useAuth()

  // After successful login, go back to main
  const handleLoginSuccess = useCallback(() => {
    setCurrentPage('main')
  }, [])

  const handleNavigateToLogin = useCallback(() => {
    setCurrentPage('login')
  }, [])

  if (currentPage === 'login' && !isAuthenticated) {
    return <LoginPage onSuccess={handleLoginSuccess} />
  }

  return <MainApp onNavigateToLogin={handleNavigateToLogin} />
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
