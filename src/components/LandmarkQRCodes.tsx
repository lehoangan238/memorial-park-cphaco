import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Building2, Droplets, Flower2, Car, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { landmarks } from '@/data/parkData'

// Park's base coordinates
const PARK_BASE_COORDS = {
  lat: 34.0522,
  lng: -118.2437,
}

// Landmark coordinates (slightly offset from base)
const landmarkCoords: Record<string, { lat: number; lng: number }> = {
  entrance: { lat: PARK_BASE_COORDS.lat, lng: PARK_BASE_COORDS.lng },
  chapel: { lat: PARK_BASE_COORDS.lat + 0.002, lng: PARK_BASE_COORDS.lng + 0.003 },
  fountain: { lat: PARK_BASE_COORDS.lat + 0.001, lng: PARK_BASE_COORDS.lng + 0.002 },
  garden: { lat: PARK_BASE_COORDS.lat + 0.001, lng: PARK_BASE_COORDS.lng + 0.001 },
  office: { lat: PARK_BASE_COORDS.lat + 0.003, lng: PARK_BASE_COORDS.lng + 0.003 },
  parking: { lat: PARK_BASE_COORDS.lat - 0.001, lng: PARK_BASE_COORDS.lng - 0.001 },
}

const landmarkIcons: Record<string, React.ReactNode> = {
  gate: <MapPin className="w-5 h-5" />,
  building: <Building2 className="w-5 h-5" />,
  droplet: <Droplets className="w-5 h-5" />,
  flower: <Flower2 className="w-5 h-5" />,
  car: <Car className="w-5 h-5" />,
}

interface LandmarkQRDialogProps {
  landmark: typeof landmarks[0]
}

function LandmarkQRDialog({ landmark }: LandmarkQRDialogProps) {
  const coords = landmarkCoords[landmark.id] || PARK_BASE_COORDS
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&travelmode=driving`

  const handleDownload = () => {
    const svg = document.getElementById(`qr-landmark-${landmark.id}`)
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
      link.download = `qr-${landmark.id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 hover:bg-stone-100 cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-stone-900 text-gold flex items-center justify-center">
            {landmarkIcons[landmark.icon]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-900">{landmark.name}</p>
            <p className="text-xs text-stone-500">Nhấn để xem QR chỉ đường</p>
          </div>
          <Navigation className="w-4 h-4 text-stone-400" />
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {landmarkIcons[landmark.icon]}
            {landmark.name}
          </DialogTitle>
          <DialogDescription>
            Quét mã QR để được hướng dẫn đường đi đến {landmark.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-white p-4 rounded-2xl shadow-soft border border-stone-200"
          >
            <QRCodeSVG
              id={`qr-landmark-${landmark.id}`}
              value={googleMapsUrl}
              size={180}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1c1917"
            />
          </motion.div>

          <p className="text-xs text-stone-500">
            GPS: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </p>

          <div className="flex gap-2 w-full">
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
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LandmarkQRCodes() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-gold" />
          QR Code Chỉ Đường
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-stone-600 mb-4">
          Quét mã QR để được hướng dẫn đường đi đến các địa điểm trong công viên
        </p>
        <div className="grid gap-2">
          {landmarks.map((landmark) => (
            <LandmarkQRDialog key={landmark.id} landmark={landmark} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
