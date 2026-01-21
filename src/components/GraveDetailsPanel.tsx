import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Calendar, 
  Flower2, 
  Users, 
  Clock, 
  MapPin,
  Heart,
  Share2,
  Navigation,
  Phone,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Grave } from '@/types'
import { formatDate } from '@/lib/utils'

interface GraveDetailsPanelProps {
  grave: Grave | null
  onClose: () => void
  onStartRouting?: (grave: Grave) => void
}

const statusLabels: Record<string, { label: string; variant: 'sage' | 'secondary' | 'gold' | 'error' }> = {
  available: { label: 'Còn trống', variant: 'sage' },
  occupied: { label: 'Đã sử dụng', variant: 'secondary' },
  reserved: { label: 'Đã đặt trước', variant: 'gold' },
  maintenance: { label: 'Đang bảo trì', variant: 'error' },
}

export function GraveDetailsPanel({ grave, onClose, onStartRouting }: GraveDetailsPanelProps) {
  if (!grave) return null

  const memorial = grave.memorial
  const statusInfo = statusLabels[grave.status]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-40 pt-20 pb-4 px-4"
      >
        <Card className="h-full overflow-hidden flex flex-col shadow-2xl">
          {/* Header with Image */}
          <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 text-white">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Image or Placeholder */}
            {grave.imageUrl ? (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={grave.imageUrl} 
                  alt={grave.name || 'Memorial'} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <Badge variant={statusInfo.variant} className="mb-2">
                    {statusInfo.label}
                  </Badge>
                  <h2 className="font-serif text-2xl font-semibold">
                    {grave.name}
                  </h2>
                  {memorial && (
                    <p className="text-stone-300 text-sm flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(memorial.birthDate)} - {formatDate(memorial.deathDate)}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 pt-12">
                <Badge variant={statusInfo.variant} className="mb-2">
                  {statusInfo.label}
                </Badge>
                <h2 className="font-serif text-2xl font-semibold mb-1">
                  {grave.status === 'available' ? 'Vị trí trống' : `Mộ phần ${grave.id}`}
                </h2>
                {grave.price && (
                  <p className="text-amber-400 text-lg font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {grave.price.toLocaleString('vi-VN')} VNĐ
                  </p>
                )}
                {grave.reservedBy && (
                  <p className="text-stone-400 text-sm mt-2">
                    Đặt bởi: {grave.reservedBy}
                    {grave.reservedUntil && (
                      <span className="block text-xs">
                        Đến ngày: {formatDate(grave.reservedUntil)}
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Epitaph */}
            {memorial?.epitaph && (
              <div className="px-6 pb-4">
                <p className="text-sm italic text-stone-300 border-l-2 border-amber-500 pl-3">
                  "{memorial.epitaph}"
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 overflow-y-auto p-6">
            {/* Location Info */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                Thông tin vị trí
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-600">Mã mộ phần</p>
                  <p className="text-sm font-medium text-stone-900">{grave.id}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-600">Khu vực</p>
                  <p className="text-sm font-medium text-stone-900">{grave.area}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-stone-600">Tọa độ</p>
                  <p className="text-sm font-mono text-stone-900">
                    {grave.coordinates[0].toFixed(6)}°N, {grave.coordinates[1].toFixed(6)}°E
                  </p>
                </div>
              </div>
            </div>

            {/* Memorial Stats */}
            {memorial && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-stone-900 mb-3">
                  Hoạt động tưởng niệm
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-stone-50 rounded-lg p-3">
                    <Flower2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-stone-900">{memorial.flowers || 0}</p>
                    <p className="text-xs text-stone-600">Hoa</p>
                  </div>
                  <div className="text-center bg-stone-50 rounded-lg p-3">
                    <Users className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-stone-900">{memorial.visitors || 0}</p>
                    <p className="text-xs text-stone-600">Viếng thăm</p>
                  </div>
                  <div className="text-center bg-stone-50 rounded-lg p-3">
                    <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-stone-900">
                      {memorial.lastVisited 
                        ? Math.floor((Date.now() - new Date(memorial.lastVisited).getTime()) / (1000 * 60 * 60 * 24)) 
                        : '-'}
                    </p>
                    <p className="text-xs text-stone-600">Ngày trước</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {grave.status === 'occupied' && memorial ? (
                <>
                  <Button className="w-full cursor-pointer" variant="accent">
                    <Flower2 className="w-4 h-4 mr-2" />
                    Đặt hoa tưởng niệm
                  </Button>
                  <Button className="w-full cursor-pointer" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Thêm vào yêu thích
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 cursor-pointer" 
                      variant="default"
                      onClick={() => onStartRouting?.(grave)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Chỉ đường
                    </Button>
                    <Button className="flex-1 cursor-pointer" variant="ghost">
                      <Share2 className="w-4 h-4 mr-2" />
                      Chia sẻ
                    </Button>
                  </div>
                </>
              ) : grave.status === 'available' ? (
                <>
                  <Button className="w-full cursor-pointer" variant="accent">
                    Đặt mua vị trí này
                  </Button>
                  <Button className="w-full cursor-pointer" variant="outline">
                    Đặt lịch tham quan
                  </Button>
                  <Button 
                    className="w-full cursor-pointer" 
                    variant="default"
                    onClick={() => onStartRouting?.(grave)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Chỉ đường đến vị trí
                  </Button>
                </>
              ) : grave.status === 'reserved' ? (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-amber-800">
                      Vị trí này đã được đặt trước
                    </p>
                  </div>
                  <Button className="w-full cursor-pointer" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Liên hệ quản lý
                  </Button>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-red-800">
                    Vị trí đang được bảo trì
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
