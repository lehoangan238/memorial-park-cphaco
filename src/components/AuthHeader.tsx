import { motion } from 'framer-motion'
import { MapPin, RefreshCw, Wifi, LogIn, LogOut, Shield, Map, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { SearchAutocomplete } from '@/components/SearchAutocomplete'
import { useAuth } from '@/context/AuthContext'
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

interface AuthHeaderProps {
  plots: PlotRow[]
  isLoading: boolean
  onSearchResultSelect: (plot: PlotRow) => void
  onRefetch: () => void
  isMenuOpen: boolean
  onMenuToggle: () => void
  onNavigateToLogin: () => void
  // New props for integrated UI
  activeTab: 'map' | 'overview'
  onTabChange: (tab: 'map' | 'overview') => void
  filterStatus: string
  onFilterChange: (status: string) => void
}

export function AuthHeader({
  plots,
  isLoading,
  onSearchResultSelect,
  onRefetch,
  onNavigateToLogin,
  activeTab,
  onTabChange,
  filterStatus,
  onFilterChange
}: AuthHeaderProps) {
  const { user, isAuthenticated, signOut, isLoading: authLoading } = useAuth()

  const handleLogin = () => {
    onNavigateToLogin()
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-3 pt-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl px-3 py-2 max-w-7xl mx-auto shadow-lg"
      >
        {/* Row 1: Logo + Search + Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo - Compact */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-stone-900 text-sm leading-tight">Hoa Viên Nghĩa Trang</h1>
              <p className="text-[10px] text-stone-500">Bình Dương</p>
            </div>
          </div>

          {/* Search - Centered */}
          <SearchAutocomplete
            plots={plots}
            onSelect={onSearchResultSelect}
            isLoading={isLoading}
            className="flex-1 max-w-sm mx-2"
            searchCustomerName={isAuthenticated}
          />

          {/* Actions - Compact */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] font-medium text-emerald-700">Live</span>
            </div>

            {/* Refresh */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRefetch}
                    className="h-8 w-8 cursor-pointer hover:bg-stone-100"
                    disabled={isLoading}
                  >
                    <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Làm mới</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Auth */}
            {isAuthenticated ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="h-8 w-8 cursor-pointer hover:bg-red-50 hover:text-red-600"
                      disabled={authLoading}
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{user?.email}</p>
                    <p className="text-[10px] text-stone-400">Đăng xuất</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                className="h-8 px-3 rounded-lg text-xs"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </Button>
            )}
          </div>
        </div>

        {/* Row 2: Tabs + Filters - Integrated */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/50">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
            <button
              onClick={() => onTabChange('map')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                activeTab === 'map'
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              <Map className="w-3.5 h-3.5" />
              Bản đồ
            </button>
            <button
              onClick={() => onTabChange('overview')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                activeTab === 'overview'
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Tổng quan
            </button>
          </div>

          {/* Status Filters - Only show on map tab */}
          {activeTab === 'map' && (
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => onFilterChange(filter.value)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                    filterStatus === filter.value
                      ? "bg-stone-900 text-white"
                      : "bg-white/80 text-stone-600 hover:bg-white border border-stone-200"
                  )}
                >
                  <span 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: filter.color }}
                  />
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Admin Badge - Show when authenticated */}
          {isAuthenticated && activeTab === 'map' && (
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-200">
              <Shield className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] font-medium text-amber-700">Admin</span>
            </div>
          )}
        </div>
      </motion.div>
    </header>
  )
}