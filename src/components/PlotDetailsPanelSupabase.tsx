import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { 
  X, 
  MapPin, 
  Ruler, 
  Tag, 
  FileText,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PlotRow } from '@/types/database'
import { useState, useCallback } from 'react'

interface PlotDetailsPanelSupabaseProps {
  plot: PlotRow | null
  onClose: () => void
  onStartRouting?: (plot: PlotRow) => void
}

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'sage' }> = {
  'Trống': { label: 'Còn trống', variant: 'sage' },
  'Đã bán': { label: 'Đã bán', variant: 'secondary' },
  'Đặt cọc': { label: 'Đã đặt cọc', variant: 'outline' },
  'Đã an táng': { label: 'Đã an táng', variant: 'secondary' },
  'Khác': { label: 'Khác', variant: 'default' }
}

export function PlotDetailsPanelSupabase({ plot, onClose, onStartRouting }: PlotDetailsPanelSupabaseProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyCoords = useCallback(() => {
    if (!plot) return
    const coords = `${plot.lat}, ${plot.lng}`
    navigator.clipboard.writeText(coords)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [plot])

  const handleDownloadQR = useCallback(() => {
    if (!plot) return
    const svg = document.getElementById(`qr-plot-${plot.id}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      
      const link = document.createElement('a')
      link.download = `qr-${plot.zone || 'plot'}-${plot.id.slice(-8)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }, [plot])

  const statusInfo = plot ? STATUS_LABELS[plot.status] || STATUS_LABELS['Khác'] : null
  const googleMapsUrl = plot ? `https://www.google.com/maps/dir/?api=1&destination=${plot.lat},${plot.lng}` : ''

  return (
    <AnimatePresence>
      {plot && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-stone-900">Chi tiết vị trí</h2>
                {statusInfo && (
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 cursor-pointer hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* ID and Name */}
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Mã vị trí</p>
                <p className="text-lg font-semibold text-stone-900">{plot.id}</p>
                {plot.name && (
                  <p className="text-stone-600 mt-1">{plot.name}</p>
                )}
              </div>

              {/* Zone */}
              {plot.zone && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">Khu vực</p>
                    <p className="font-medium text-stone-900">{plot.zone}</p>
                  </div>
                </div>
              )}

              {/* Area */}
              {plot.area && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Ruler className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">Diện tích</p>
                    <p className="font-medium text-stone-900">{plot.area} m²</p>
                  </div>
                </div>
              )}

              {/* Price */}
              {plot.price && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">Giá</p>
                    <p className="font-semibold text-amber-600 text-lg">
                      {plot.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {plot.notes && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">Ghi chú</p>
                    <p className="text-stone-700 text-sm leading-relaxed">{plot.notes}</p>
                  </div>
                </div>
              )}

              {/* Coordinates */}
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">Tọa độ</p>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-stone-700">
                    {plot.lat.toFixed(6)}, {plot.lng.toFixed(6)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCoords}
                    className="h-8 cursor-pointer hover:bg-stone-200"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="w-4 h-4 text-stone-600" />
                  <p className="text-xs text-stone-500 uppercase tracking-wide">Mã QR Chỉ Đường</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-stone-200">
                    <QRCodeSVG
                      id={`qr-plot-${plot.id}`}
                      value={googleMapsUrl}
                      size={100}
                      level="M"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#1c1917"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-stone-700 mb-2">
                      Quét mã QR để mở Google Maps và nhận hướng dẫn đường đi
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadQR}
                      className="cursor-pointer text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Tải QR Code
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Button 
                  onClick={() => onStartRouting?.(plot)}
                  className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Dẫn đường đến đây
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open(`https://www.google.com/maps?q=${plot.lat},${plot.lng}`, '_blank')}
                  className="w-full cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Mở trên Google Maps
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
