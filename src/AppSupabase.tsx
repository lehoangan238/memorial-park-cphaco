import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ParkMapSupabase } from '@/components/ParkMapSupabase'
import { PlotDetailsPanelSupabase } from '@/components/PlotDetailsPanelSupabase'
import { SearchAutocomplete } from '@/components/SearchAutocomplete'
import { SidebarSkeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  MapPin,
  RefreshCw,
  Wifi,
  Navigation,
  Clock,
  Footprints,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow } from '@/types/database'
import { cn } from '@/lib/utils'
import { getOSRMRoute, getDirectionsFromOSRM, type OSRMRoute } from '@/lib/routing'

// Status filter options
const STATUS_FILTERS = [
  { value: 'all', label: 'Tất cả', color: '#6B7280' },
  { value: 'Trống', label: 'Còn trống', color: '#10B981' },
  { value: 'Đã bán', label: 'Đã bán', color: '#EF4444' },
  { value: 'Đặt cọc', label: 'Đã đặt cọc', color: '#F59E0B' },
  { value: 'Đã an táng', label: 'Đã an táng', color: '#6B7280' }
]

// Cemetery gate coordinates (entrance) - [lat, lng]
const CEMETERY_GATE: [number, number] = [11.168266, 106.651891]

// Calculate distance between two points using Haversine formula
function calculateDistance(from: [number, number], to: [number, number]): number {
  const R = 6371000 // Earth's radius in meters
  const [lat1, lng1] = from.map(x => x * Math.PI / 180)
  const [lat2, lng2] = to.map(x => x * Math.PI / 180)
  
  const dLat = lat2 - lat1
  const dLng = lng2 - lng1
  
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  
  return R * c
}

// Calculate bearing direction name in Vietnamese
function getBearingName(bearing: number): string {
  const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc']
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}

// Calculate bearing between two points
function calculateBearing(from: [number, number], to: [number, number]): number {
  const [lat1, lng1] = from.map(x => x * Math.PI / 180)
  const [lat2, lng2] = to.map(x => x * Math.PI / 180)
  
  const dLng = lng2 - lng1
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  const bearing = Math.atan2(y, x) * 180 / Math.PI
  
  return (bearing + 360) % 360
}

// Format distance for display
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

// Format walking time from seconds
function formatWalkingTime(seconds: number): string {
  const minutes = Math.ceil(seconds / 60)
  if (minutes < 1) return '< 1 phút'
  if (minutes === 1) return '1 phút'
  return `${minutes} phút`
}

// Format walking time from meters (fallback)
function formatWalkingTimeFromMeters(meters: number): string {
  const walkingSpeed = 80 // meters per minute (about 5 km/h)
  const minutes = Math.ceil(meters / walkingSpeed)
  if (minutes < 1) return '< 1 phút'
  if (minutes === 1) return '1 phút'
  return `${minutes} phút`
}

function AppSupabase() {
  const [selectedPlot, setSelectedPlot] = useState<PlotRow | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('map')
  const [flyToPlot, setFlyToPlot] = useState<PlotRow | null>(null)

  // Fetch all map data with real-time subscriptions
  const { plots, isLoading, isError, error, refetch } = useMapData()

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

  const handleFilterChange = useCallback((status: string) => {
    setFilterStatus(status)
  }, [])

  // Start routing to a plot
  const handleStartRouting = useCallback((plot: PlotRow) => {
    setRoutingDestination(plot)
    setActiveTab('map')
    setSelectedPlot(null) // Close details panel
    setIsRoutingPanelExpanded(true)
  }, [])

  // Stop routing
  const handleStopRouting = useCallback(() => {
    setRoutingDestination(null)
    setOsrmRoute(null)
    setRouteError(null)
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

  // Filter plots for list display (Overview tab only)
  const filteredPlots = plots.filter(plot => {
    return filterStatus === 'all' || plot.status === filterStatus
  })

  // Stats calculation
  const stats = {
    total: plots.length,
    available: plots.filter(p => p.status === 'Trống').length,
    sold: plots.filter(p => p.status === 'Đã bán').length,
    reserved: plots.filter(p => p.status === 'Đặt cọc').length
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Full-Screen Map Background */}
      {activeTab === 'map' && (
        <div className="fixed inset-0 z-0">
          <ParkMapSupabase
            onPlotSelect={handlePlotSelect}
            selectedPlot={selectedPlot}
            filterStatus={filterStatus}
            flyToPlot={flyToPlot}
          />
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 pt-4">
        <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-stone-900 text-sm">Hoa Viên Nghĩa Trang</h1>
              <p className="text-xs text-stone-500">Bình Dương</p>
            </div>
          </div>

          {/* Search with Autocomplete */}
          <SearchAutocomplete
            plots={plots}
            onSelect={handleSearchResultSelect}
            isLoading={isLoading}
            className="flex-1 max-w-md mx-4 hidden md:block"
          />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Real-time indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] font-medium text-emerald-700">Live</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 cursor-pointer hover:bg-stone-100"
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-9 w-9 cursor-pointer hover:bg-stone-100 md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="fixed top-20 left-4 right-4 z-20 md:hidden">
        <SearchAutocomplete
          plots={plots}
          onSelect={handleSearchResultSelect}
          isLoading={isLoading}
          placeholder="Tìm kiếm..."
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-32 md:pt-24 pb-8 px-4 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          {/* Hero Title */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 pointer-events-auto"
          >
            <div className="glass rounded-2xl px-6 py-4 inline-block">
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-stone-900 mb-2">
                Hoa Viên Nghĩa Trang Bình Dương
              </h1>
              <p className="text-stone-600 max-w-xl mx-auto text-sm md:text-base">
                Nơi an nghỉ vĩnh hằng - Tôn vinh ký ức muôn đời
              </p>
            </div>
          </motion.section>

          {/* Tabs */}
          <Tabs 
            defaultValue="map" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-4 pointer-events-auto">
              <TabsList className="grid w-full max-w-xs grid-cols-2 glass">
                <TabsTrigger value="map">Bản đồ</TabsTrigger>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              </TabsList>
            </div>

            {/* Map Tab - Filter chips only */}
            <TabsContent value="map" className="pointer-events-auto">
              <div className="flex flex-wrap gap-2 justify-center">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleFilterChange(filter.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer",
                      filterStatus === filter.value
                        ? "bg-stone-900 text-white"
                        : "bg-white/80 text-stone-700 hover:bg-white"
                    )}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: filter.color }}
                    />
                    {filter.label}
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="pointer-events-auto">
              <div className="glass rounded-2xl p-6">
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
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-xl p-4 text-center">
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

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                      {STATUS_FILTERS.map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => handleFilterChange(filter.value)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer",
                            filterStatus === filter.value
                              ? "bg-stone-900 text-white"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                          )}
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: filter.color }}
                          />
                          {filter.label}
                        </button>
                      ))}
                    </div>

                    {/* Plot List */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {filteredPlots.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-stone-500">Không tìm thấy vị trí nào</p>
                        </div>
                      ) : (
                        filteredPlots.slice(0, 20).map((plot) => (
                          <button
                            key={plot.id}
                            onClick={() => handleSearchResultSelect(plot)}
                            className="w-full bg-white rounded-xl p-4 text-left hover:shadow-md transition-shadow cursor-pointer border border-stone-100"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-stone-900">{plot.id}</p>
                                {plot.name && (
                                  <p className="text-sm text-stone-600 mt-0.5">{plot.name}</p>
                                )}
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
                        ))
                      )}
                      {filteredPlots.length > 20 && (
                        <p className="text-center text-sm text-stone-500 py-2">
                          Hiển thị 20 / {filteredPlots.length} vị trí
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Plot Details Panel */}
      <PlotDetailsPanelSupabase
        plot={selectedPlot}
        onClose={() => setSelectedPlot(null)}
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
                    className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-colors duration-150"
                  >
                    {isRoutingPanelExpanded ? (
                      <ChevronDown className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleStopRouting}
                    className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-colors duration-150"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isRoutingPanelExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Route Summary */}
                    {(() => {
                      const startPoint = userLocation || CEMETERY_GATE
                      const destCoords: [number, number] = [routingDestination.lat, routingDestination.lng]
                      const fallbackDistance = calculateDistance(startPoint, destCoords)
                      const bearing = calculateBearing(startPoint, destCoords)
                      const direction = getBearingName(bearing)
                      
                      // Use OSRM data if available
                      const distance = osrmRoute?.distance ?? fallbackDistance
                      const walkingTime = osrmRoute?.duration 
                        ? formatWalkingTime(osrmRoute.duration)
                        : formatWalkingTimeFromMeters(fallbackDistance)
                      
                      // Get turn-by-turn directions from OSRM
                      const osrmDirections = osrmRoute ? getDirectionsFromOSRM(osrmRoute) : null

                      return (
                        <>
                          <div className="grid grid-cols-2 divide-x divide-stone-100 border-b border-stone-100">
                            <div className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-1">
                                <Footprints className="w-3 h-3" />
                                <span>Khoảng cách</span>
                              </div>
                              <p className="font-bold text-2xl text-stone-900">
                                {isLoadingRoute ? '...' : formatDistance(distance)}
                              </p>
                            </div>
                            <div className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-1 text-stone-500 text-xs mb-1">
                                <Clock className="w-3 h-3" />
                                <span>Đi bộ</span>
                              </div>
                              <p className="font-bold text-2xl text-emerald-600">
                                {isLoadingRoute ? '...' : walkingTime}
                              </p>
                            </div>
                          </div>

                          {/* Route source indicator */}
                          {routeError && (
                            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                              <p className="text-xs text-amber-700">{routeError}</p>
                            </div>
                          )}
                          {osrmRoute && !routeError && (
                            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100">
                              <p className="text-xs text-emerald-700">✓ Đường đi theo đường thực tế (OSRM)</p>
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
                                    {routingDestination.name || `Vị trí ${routingDestination.id}`}
                                  </p>
                                  <p className="text-xs text-stone-400">{routingDestination.zone || 'Khu vực chung'}</p>
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
                              {osrmDirections && osrmDirections.length > 0 ? (
                                // OSRM turn-by-turn directions
                                osrmDirections.map((step, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                      index === osrmDirections.length - 1 ? 'bg-amber-500' : 'bg-emerald-100'
                                    }`}>
                                      {index === osrmDirections.length - 1 ? (
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
                                      <p className="text-xs text-stone-400 mt-0.5">Theo biển chỉ dẫn {routingDestination.zone || 'khu vực'}</p>
                                    </div>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                                      <MapPin className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="pt-1">
                                      <p className="text-sm font-medium text-stone-900">
                                        Đến {routingDestination.name || `vị trí ${routingDestination.id}`}
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
                        </>
                      )
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed Summary */}
              {!isRoutingPanelExpanded && (() => {
                const startPoint = userLocation || CEMETERY_GATE
                const destCoords: [number, number] = [routingDestination.lat, routingDestination.lng]
                const fallbackDistance = calculateDistance(startPoint, destCoords)
                const bearing = calculateBearing(startPoint, destCoords)
                const direction = getBearingName(bearing)
                
                const distance = osrmRoute?.distance ?? fallbackDistance
                const walkingTime = osrmRoute?.duration 
                  ? formatWalkingTime(osrmRoute.duration)
                  : formatWalkingTimeFromMeters(fallbackDistance)

                return (
                  <div className="px-4 py-2 flex items-center justify-between bg-stone-50">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-stone-900">
                        {isLoadingRoute ? '...' : formatDistance(distance)}
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {isLoadingRoute ? '...' : walkingTime}
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

export default AppSupabase
