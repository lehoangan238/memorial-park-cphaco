import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface QRCodeDirectionsProps {
  plotId: string
  plotName?: string
  sectionName: string
  // Simulated GPS coordinates - in real app, these would come from database
  latitude?: number
  longitude?: number
  className?: string
}

// Park's base coordinates (example: a fictional cemetery in California)
const PARK_BASE_COORDS = {
  lat: 34.0522,
  lng: -118.2437,
}

// Generate slightly offset coordinates based on plot position
function getPlotCoordinates(sectionId: string, row: number, col: number) {
  // Create slight variations based on section and position
  const sectionOffsets: Record<string, { lat: number; lng: number }> = {
    'garden-of-peace': { lat: 0.001, lng: 0.001 },
    'eternal-rest': { lat: 0.002, lng: 0.001 },
    'sunrise-meadow': { lat: 0.001, lng: 0.002 },
    'reflection-pond': { lat: 0.002, lng: 0.002 },
    'heritage-grove': { lat: 0.003, lng: 0.001 },
  }

  const offset = sectionOffsets[sectionId] || { lat: 0, lng: 0 }
  
  return {
    lat: PARK_BASE_COORDS.lat + offset.lat + (row * 0.0001),
    lng: PARK_BASE_COORDS.lng + offset.lng + (col * 0.0001),
  }
}

export function QRCodeDirections({
  plotId,
  plotName,
  sectionName,
  latitude,
  longitude,
  className,
}: QRCodeDirectionsProps) {
  // Parse plot ID to get section and position
  const parts = plotId.split('-')
  const section = parts.slice(0, -2).join('-')
  const row = parseInt(parts[parts.length - 2]) || 1
  const col = parseInt(parts[parts.length - 1]) || 1

  // Get coordinates
  const coords = latitude && longitude 
    ? { lat: latitude, lng: longitude }
    : getPlotCoordinates(section, row, col)

  // Generate Google Maps URL for directions
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&travelmode=driving`
  
  // Generate Google Maps URL for viewing location
  const googleMapsViewUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`

  // Download QR code as image
  const handleDownload = () => {
    const svg = document.getElementById(`qr-${plotId}`)
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
      link.download = `qr-directions-${plotId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', className)}>
          <Navigation className="w-4 h-4" />
          Mã QR Chỉ Đường
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" />
            Chỉ Đường Đến Vị Trí
          </DialogTitle>
          <DialogDescription>
            Quét mã QR để mở Google Maps và nhận chỉ dẫn đường đi
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Plot Info */}
          <div className="text-center">
            <p className="text-lg font-semibold text-stone-900">
              {plotName || `Plot ${plotId}`}
            </p>
            <p className="text-sm text-stone-600 capitalize">
              {sectionName.replace(/-/g, ' ')}
            </p>
          </div>

          {/* QR Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-white p-4 rounded-2xl shadow-soft border border-stone-200"
          >
            <QRCodeSVG
              id={`qr-${plotId}`}
              value={googleMapsUrl}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1c1917"
              imageSettings={{
                src: '/vite.svg', // You can replace with park logo
                x: undefined,
                y: undefined,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </motion.div>

          {/* Coordinates Display */}
          <div className="text-center text-sm text-stone-500">
            <p>GPS: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="accent"
              className="flex-1 gap-2"
              onClick={() => window.open(googleMapsUrl, '_blank')}
            >
              <Navigation className="w-4 h-4" />
              Mở Google Maps
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Tải QR Code
            </Button>
          </div>

          {/* View on Map Link */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-stone-600"
            onClick={() => window.open(googleMapsViewUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            Xem vị trí trên bản đồ
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-stone-50 rounded-lg p-4 mt-2">
          <p className="text-xs text-stone-600 text-center">
            💡 Mở camera điện thoại và quét mã QR để được hướng dẫn đường đi trực tiếp đến vị trí này
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Compact QR code for inline display
export function QRCodeInline({
  plotId,
  size = 80,
  className,
}: {
  plotId: string
  size?: number
  className?: string
}) {
  const parts = plotId.split('-')
  const section = parts.slice(0, -2).join('-')
  const row = parseInt(parts[parts.length - 2]) || 1
  const col = parseInt(parts[parts.length - 1]) || 1

  const coords = getPlotCoordinates(section, row, col)
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&travelmode=driving`

  return (
    <div className={cn('bg-white p-2 rounded-lg shadow-sm border border-stone-200', className)}>
      <QRCodeSVG
        value={googleMapsUrl}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#1c1917"
      />
    </div>
  )
}
