import { useState, useCallback, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Search, Download, Printer, QrCode, Copy, Check, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow } from '@/types/database'

export function QRGeneratorPage() {
  const { plots, isLoading } = useMapData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlot, setSelectedPlot] = useState<PlotRow | null>(null)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  // Base URL for QR codes
  const baseUrl = window.location.origin

  // Filter plots by search
  const filteredPlots = plots.filter(plot => {
    const query = searchQuery.toLowerCase()
    return (
      plot.id.toLowerCase().includes(query) ||
      plot.name?.toLowerCase().includes(query) ||
      plot.customer_name?.toLowerCase().includes(query) ||
      plot.zone?.toLowerCase().includes(query)
    )
  }).slice(0, 20) // Limit results

  const qrUrl = selectedPlot ? `${baseUrl}/qr?plot=${selectedPlot.id}` : ''

  const handleCopyUrl = useCallback(() => {
    if (!qrUrl) return
    navigator.clipboard.writeText(qrUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [qrUrl])

  const handleDownloadQR = useCallback(() => {
    if (!qrRef.current || !selectedPlot) return

    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    // Create canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 400
    canvas.width = size
    canvas.height = size + 80 // Extra space for text

    // White background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
      
      // Add text below QR
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 24px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(selectedPlot.name || selectedPlot.id, size / 2, size + 35)
      
      ctx.font = '16px system-ui'
      ctx.fillStyle = '#6b7280'
      ctx.fillText(selectedPlot.zone || 'Hoa Viên Nghĩa Trang', size / 2, size + 60)

      // Download
      const link = document.createElement('a')
      link.download = `QR-${selectedPlot.id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }, [selectedPlot])

  const handlePrint = useCallback(() => {
    if (!selectedPlot) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const svg = qrRef.current?.querySelector('svg')
    const svgHtml = svg ? new XMLSerializer().serializeToString(svg) : ''

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${selectedPlot.id}</title>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            min-height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .qr-container {
            text-align: center;
            padding: 30px;
            border: 2px solid #e5e7eb;
            border-radius: 16px;
          }
          h1 { margin: 20px 0 5px; font-size: 24px; color: #1f2937; }
          p { margin: 0; color: #6b7280; font-size: 14px; }
          .instructions { 
            margin-top: 20px; 
            padding: 15px; 
            background: #f3f4f6; 
            border-radius: 8px;
            font-size: 13px;
          }
          @media print {
            .qr-container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="qr-container">
          ${svgHtml}
          <h1>${selectedPlot.name || selectedPlot.id}</h1>
          <p>${selectedPlot.zone || 'Hoa Viên Nghĩa Trang Bình Dương'}</p>
          <div class="instructions">
            📱 Quét mã QR để được dẫn đường đến vị trí này
          </div>
        </div>
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }, [selectedPlot])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <QrCode className="w-7 h-7 text-emerald-600" />
          Tạo QR Code Dẫn Đường
        </h1>
        <p className="text-stone-500 mt-1">
          Tạo mã QR để khách quét và được dẫn đường đến vị trí bằng Google Maps
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Search & Select */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
          <h2 className="font-semibold text-stone-900 mb-4">Chọn vị trí</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã, tên, khu vực..."
              className="pl-10"
            />
          </div>

          {/* Plot List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <p className="text-center text-stone-500 py-8">Đang tải...</p>
            ) : filteredPlots.length === 0 ? (
              <p className="text-center text-stone-500 py-8">
                {searchQuery ? 'Không tìm thấy kết quả' : 'Nhập từ khóa để tìm kiếm'}
              </p>
            ) : (
              filteredPlots.map(plot => (
                <button
                  key={plot.id}
                  onClick={() => setSelectedPlot(plot)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedPlot?.id === plot.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-stone-100 hover:border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-stone-900">{plot.name || plot.id}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{plot.zone || 'Khu vực chung'}</p>
                      {plot.customer_name && (
                        <p className="text-xs text-stone-400 mt-1">👤 {plot.customer_name}</p>
                      )}
                    </div>
                    <Badge variant={plot.status === 'Trống' ? 'sage' : 'secondary'} className="text-xs">
                      {plot.status}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: QR Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
          <h2 className="font-semibold text-stone-900 mb-4">Mã QR</h2>

          {selectedPlot ? (
            <div className="text-center">
              {/* QR Code */}
              <div 
                ref={qrRef}
                className="inline-block p-6 bg-white rounded-2xl border-2 border-stone-100"
              >
                <QRCodeSVG
                  value={qrUrl}
                  size={250}
                  level="H"
                  includeMargin
                  imageSettings={{
                    src: '/vite.svg',
                    height: 40,
                    width: 40,
                    excavate: true
                  }}
                />
              </div>

              {/* Plot Info */}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-stone-900">
                  {selectedPlot.name || selectedPlot.id}
                </h3>
                <p className="text-stone-500">{selectedPlot.zone || 'Hoa Viên Nghĩa Trang'}</p>
                
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-stone-400">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedPlot.lat.toFixed(6)}, {selectedPlot.lng.toFixed(6)}</span>
                </div>
              </div>

              {/* URL */}
              <div className="mt-4 p-3 bg-stone-50 rounded-xl">
                <p className="text-xs text-stone-500 mb-1">URL dẫn đường:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-stone-700 truncate">{qrUrl}</code>
                  <Button size="sm" variant="ghost" onClick={handleCopyUrl}>
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button onClick={handleDownloadQR} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Tải PNG
                </Button>
                <Button onClick={handlePrint} variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  In QR
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-10 h-10 text-stone-300" />
              </div>
              <p className="text-stone-500">Chọn một vị trí để tạo mã QR</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-amber-50 rounded-2xl p-5 border border-amber-100">
        <h3 className="font-semibold text-amber-800 mb-2">💡 Hướng dẫn sử dụng</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• In mã QR và dán tại bảng thông tin, cổng vào, hoặc các điểm mốc trong nghĩa trang</li>
          <li>• Khách chỉ cần quét mã QR bằng camera điện thoại</li>
          <li>• Trang web sẽ tự động mở Google Maps và dẫn đường đến vị trí</li>
          <li>• Có thể tạo QR cho từng mộ phần hoặc các điểm quan trọng (nhà tang lễ, chùa...)</li>
        </ul>
      </div>
    </div>
  )
}
