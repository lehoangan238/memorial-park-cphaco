import { useEffect, useState } from 'react'
import { MapPin, Navigation, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import type { PlotRow } from '@/types/database'

// This page is accessed via QR code scan
// URL format: /qr/{plotId} or ?plot={plotId}
export function QRDirectionsPage() {
  const [plot, setPlot] = useState<PlotRow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  // Get plot ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const plotId = urlParams.get('plot') || urlParams.get('id')

  useEffect(() => {
    if (!plotId) {
      setError('Không tìm thấy mã vị trí trong QR code')
      setIsLoading(false)
      return
    }

    // Fetch plot data
    const fetchPlot = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('plots')
          .select('*')
          .eq('id', plotId)
          .single()

        if (fetchError || !data) {
          setError('Không tìm thấy vị trí này')
          return
        }

        setPlot(data as PlotRow)
      } catch {
        setError('Lỗi khi tải dữ liệu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlot()
  }, [plotId])

  // Auto-redirect countdown
  useEffect(() => {
    if (!plot || countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Open Google Maps
          window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${plot.lat},${plot.lng}`
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [plot, countdown])

  const handleOpenMaps = () => {
    if (!plot) return
    window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${plot.lat},${plot.lng}`
  }

  const handleViewOnMap = () => {
    if (!plot) return
    window.location.href = `/?plot=${plot.id}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-stone-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 mb-2">Không thể mở</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  if (!plot) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-1">
            {plot.name || plot.id}
          </h1>
          <p className="text-stone-500">{plot.zone || 'Hoa Viên Nghĩa Trang'}</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
          <div className="space-y-3">
            {plot.customer_name && (
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 text-sm">Người an nghỉ</span>
                <span className="font-medium text-stone-900">{plot.customer_name}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500 text-sm">Mã vị trí</span>
              <span className="font-mono text-stone-900">{plot.id}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-stone-500 text-sm">Tọa độ</span>
              <span className="font-mono text-xs text-stone-600">
                {plot.lat.toFixed(6)}, {plot.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        {countdown > 0 && (
          <div className="text-center mb-4">
            <p className="text-stone-500 text-sm">
              Tự động mở Google Maps trong <span className="font-bold text-emerald-600">{countdown}s</span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={handleOpenMaps}
            className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-lg"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Dẫn đường bằng Google Maps
          </Button>
          
          <Button 
            onClick={handleViewOnMap}
            variant="outline"
            className="w-full h-12 rounded-xl"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Xem trên bản đồ số
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 mt-8">
          Hoa Viên Nghĩa Trang Bình Dương
        </p>
      </div>
    </div>
  )
}
