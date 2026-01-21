import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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
  Wifi
} from 'lucide-react'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow } from '@/types/database'
import { cn } from '@/lib/utils'

// Status filter options
const STATUS_FILTERS = [
  { value: 'all', label: 'Tất cả', color: '#6B7280' },
  { value: 'Trống', label: 'Còn trống', color: '#10B981' },
  { value: 'Đã bán', label: 'Đã bán', color: '#EF4444' },
  { value: 'Đặt cọc', label: 'Đã đặt cọc', color: '#F59E0B' },
  { value: 'Đã an táng', label: 'Đã an táng', color: '#6B7280' }
]

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
      />
    </div>
  )
}

export default AppSupabase
