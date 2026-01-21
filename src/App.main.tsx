import { useState, useCallback, useEffect } from 'react'
import { ParkMapSupabase } from '@/components/ParkMapSupabase'
import { PlotEditDrawer } from '@/components/PlotEditDrawer'
import { AuthHeader } from '@/components/AuthHeader'
import { SidebarSkeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { LoginPage } from '@/pages/LoginPage'
import { QRDirectionsPage } from '@/pages/QRDirectionsPage'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow } from '@/types/database'

interface MainAppProps {
  onNavigateToLogin: () => void
}

function MainApp({ onNavigateToLogin }: MainAppProps) {
  const [selectedPlot, setSelectedPlot] = useState<PlotRow | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'map' | 'overview'>('map')
  const [flyToPlot, setFlyToPlot] = useState<PlotRow | null>(null)
  const [initialPlotId, setInitialPlotId] = useState<string | null>(null)

  const { plots, isLoading, isError, error, refetch } = useMapData()

  // Check URL for shared plot link on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const plotId = urlParams.get('plot') || urlParams.get('id')
    if (plotId) {
      setInitialPlotId(plotId)
    }
  }, [])

  // Open shared plot when data is loaded
  useEffect(() => {
    if (initialPlotId && plots.length > 0 && !isLoading) {
      const plot = plots.find(p => p.id === initialPlotId)
      if (plot) {
        setActiveTab('map')
        setFlyToPlot(plot)
        setSelectedPlot(plot)
        setTimeout(() => setFlyToPlot(null), 100)
        // Clear the URL param after opening
        window.history.replaceState({}, '', window.location.pathname)
      }
      setInitialPlotId(null)
    }
  }, [initialPlotId, plots, isLoading])

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
      />
    </div>
  )
}

// App Router - Simple state-based routing (no react-router needed)
function AppRouter() {
  const [currentPage, setCurrentPage] = useState<'main' | 'login' | 'qr'>('main')
  const { isAuthenticated } = useAuth()

  // Check URL for QR page on mount
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/qr' || path.startsWith('/qr/')) {
      setCurrentPage('qr')
    }
  }, [])

  // After successful login, go back to main
  const handleLoginSuccess = useCallback(() => {
    setCurrentPage('main')
  }, [])

  const handleNavigateToLogin = useCallback(() => {
    setCurrentPage('login')
  }, [])

  // QR Directions page (standalone, no auth needed)
  if (currentPage === 'qr') {
    return <QRDirectionsPage />
  }

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
