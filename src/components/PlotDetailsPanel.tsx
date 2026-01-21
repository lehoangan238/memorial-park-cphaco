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
  QrCode
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { QRCodeDirections, QRCodeInline } from '@/components/QRCodeDirections'
import type { Plot } from '@/types'
import { formatDate } from '@/lib/utils'

interface PlotDetailsPanelProps {
  plot: Plot | null
  onClose: () => void
}

export function PlotDetailsPanel({ plot, onClose }: PlotDetailsPanelProps) {
  if (!plot) return null

  const memorial = plot.memorial

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full sm:w-96 z-40 pt-24 pb-4 px-4"
      >
        <Card className="h-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 p-6 text-white">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>

            {memorial ? (
              <div className="pt-4">
                <h2 className="font-serif text-2xl font-semibold mb-1">
                  {memorial.name}
                </h2>
                <p className="text-stone-300 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(memorial.birthDate)} - {formatDate(memorial.deathDate)}
                </p>
                {memorial.epitaph && (
                  <p className="mt-4 text-sm italic text-stone-300 border-l-2 border-gold pl-3">
                    "{memorial.epitaph}"
                  </p>
                )}
              </div>
            ) : (
              <div className="pt-4">
                <Badge variant={plot.status === 'available' ? 'sage' : 'gold'} className="mb-2">
                  {plot.status.charAt(0).toUpperCase() + plot.status.slice(1)}
                </Badge>
                <h2 className="font-serif text-2xl font-semibold mb-1">
                  Plot {plot.id}
                </h2>
                <p className="text-stone-300 text-sm">
                  {plot.status === 'available' && plot.price && (
                    <span className="text-gold font-semibold">${plot.price.toLocaleString()}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 overflow-y-auto p-6">
            {/* Location Info */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                Location Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-600">Section</p>
                  <p className="text-sm font-medium text-stone-900 capitalize">
                    {plot.section.replace(/-/g, ' ')}
                  </p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-600">Position</p>
                  <p className="text-sm font-medium text-stone-900">
                    Row {plot.row}, #{plot.number}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Directions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-gold" />
                QR Code Chỉ Đường
              </h3>
              <div className="flex items-center gap-4 bg-stone-50 rounded-lg p-4">
                <QRCodeInline plotId={plot.id} size={70} />
                <div className="flex-1">
                  <p className="text-sm text-stone-700 mb-2">
                    Quét mã QR để mở Google Maps và nhận hướng dẫn đường đi
                  </p>
                  <QRCodeDirections
                    plotId={plot.id}
                    plotName={memorial?.name}
                    sectionName={plot.section}
                  />
                </div>
              </div>
            </div>

            {/* Memorial Stats */}
            {memorial && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-stone-900 mb-3">
                  Memorial Activity
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-stone-50 rounded-lg p-3">
                    <Flower2 className="w-5 h-5 text-sage mx-auto mb-1" />
                    <p className="text-lg font-semibold text-stone-900">{memorial.flowers || 0}</p>
                    <p className="text-xs text-stone-600">Flowers</p>
                  </div>
                  <div className="text-center bg-stone-50 rounded-lg p-3">
                    <Users className="w-5 h-5 text-sky-dark mx-auto mb-1" />
                    <p className="text-lg font-semibold text-stone-900">{memorial.visitors || 0}</p>
                    <p className="text-xs text-stone-600">Visitors</p>
                  </div>
                  <div className="text-center bg-stone-50 rounded-lg p-3">
                    <Clock className="w-5 h-5 text-gold mx-auto mb-1" />
                    <p className="text-lg font-semibold text-stone-900">
                      {memorial.lastVisited ? Math.floor((Date.now() - new Date(memorial.lastVisited).getTime()) / (1000 * 60 * 60 * 24)) : '-'}
                    </p>
                    <p className="text-xs text-stone-600">Days ago</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {memorial ? (
                <>
                  <Button className="w-full" variant="accent">
                    <Flower2 className="w-4 h-4 mr-2" />
                    Leave Virtual Flowers
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Favorites
                  </Button>
                  <div className="flex gap-2">
                    <QRCodeDirections
                      plotId={plot.id}
                      plotName={memorial?.name}
                      sectionName={plot.section}
                      className="flex-1"
                    />
                    <Button className="flex-1" variant="ghost">
                      <Share2 className="w-4 h-4 mr-2" />
                      Chia sẻ
                    </Button>
                  </div>
                </>
              ) : plot.status === 'available' ? (
                <>
                  <Button className="w-full" variant="accent">
                    Đặt Chỗ Trước
                  </Button>
                  <Button className="w-full" variant="outline">
                    Đặt Lịch Tham Quan
                  </Button>
                  <QRCodeDirections
                    plotId={plot.id}
                    sectionName={plot.section}
                    className="w-full"
                  />
                </>
              ) : (
                <Button className="w-full" variant="outline">
                  Contact Administration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
