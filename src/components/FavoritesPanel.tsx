import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, MapPin, Trash2, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFavoritesStore, useMapStore } from '@/store/mapStore'
import type { PlotRow } from '@/types/database'
import { cn } from '@/lib/utils'

// Status color mapping
const STATUS_COLORS: Record<string, string> = {
  'Trống': 'bg-emerald-100 text-emerald-700',
  'Đã bán': 'bg-red-100 text-red-700',
  'Đặt cọc': 'bg-amber-100 text-amber-700',
  'Đã an táng': 'bg-stone-100 text-stone-700',
}

interface FavoriteButtonProps {
  plotId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Heart button to toggle favorite status
 */
export function FavoriteButton({ plotId, size = 'md', className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore()
  const favorite = isFavorite(plotId)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(plotId)
      }}
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer',
        sizeClasses[size],
        favorite 
          ? 'bg-red-100 hover:bg-red-200' 
          : 'bg-stone-100 hover:bg-stone-200',
        className
      )}
      aria-label={favorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          'transition-colors duration-200',
          favorite ? 'text-red-500 fill-red-500' : 'text-stone-400'
        )} 
      />
    </button>
  )
}

interface FavoritesPanelProps {
  isOpen: boolean
  onClose: () => void
  plots: PlotRow[]
  onSelectPlot: (plot: PlotRow) => void
}

/**
 * Slide-out panel showing all favorited plots
 */
export function FavoritesPanel({ isOpen, onClose, plots, onSelectPlot }: FavoritesPanelProps) {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore()
  const { startRoute } = useMapStore()

  // Get favorited plots
  const favoritePlots = useMemo(() => {
    return plots.filter(plot => favorites.includes(plot.id))
  }, [plots, favorites])

  const handleNavigate = (plot: PlotRow) => {
    startRoute(plot)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h2 className="font-semibold text-stone-900">Yêu thích</h2>
                <Badge variant="secondary" className="text-xs">
                  {favorites.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {favorites.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFavorites}
                    className="h-8 text-xs text-stone-500 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Xóa tất cả
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors duration-150"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {favoritePlots.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500 font-medium">Chưa có vị trí yêu thích</p>
                  <p className="text-sm text-stone-400 mt-1">
                    Nhấn vào biểu tượng trái tim để lưu vị trí
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {favoritePlots.map((plot) => (
                    <li
                      key={plot.id}
                      className="bg-stone-50 rounded-xl p-4 hover:bg-stone-100 transition-colors duration-150"
                    >
                      <div className="flex items-start justify-between">
                        <button
                          onClick={() => onSelectPlot(plot)}
                          className="flex-1 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-stone-400" />
                            <span className="font-medium text-stone-900">{plot.id}</span>
                            <Badge className={cn('text-[10px]', STATUS_COLORS[plot.status])}>
                              {plot.status}
                            </Badge>
                          </div>
                          {plot.name && (
                            <p className="text-sm text-stone-600 mt-1 ml-6">{plot.name}</p>
                          )}
                          <p className="text-xs text-stone-400 mt-0.5 ml-6">
                            {plot.zone || 'Khu vực chung'}
                          </p>
                          {plot.price && (
                            <p className="text-sm font-semibold text-amber-600 mt-1 ml-6">
                              {plot.price.toLocaleString('vi-VN')} VNĐ
                            </p>
                          )}
                        </button>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleNavigate(plot)}
                            className="h-8 w-8 cursor-pointer hover:bg-emerald-100"
                            title="Chỉ đường"
                          >
                            <Navigation className="w-4 h-4 text-emerald-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFavorite(plot.id)}
                            className="h-8 w-8 cursor-pointer hover:bg-red-100"
                            title="Bỏ yêu thích"
                          >
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
