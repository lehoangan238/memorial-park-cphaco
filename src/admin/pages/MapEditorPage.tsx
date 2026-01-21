/**
 * Map Editor Page - Assign plot locations on interactive map
 * Using react-map-gl/maplibre (same as ParkMap.tsx)
 * 
 * Features:
 * 1. Only shows plots WITHOUT coordinates in the list
 * 2. Displays overlay images (cemetery map) from Supabase
 * 3. No markers on map - just click to assign location
 * 4. Auto flyTo when selecting plot
 */
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Map, { NavigationControl, ScaleControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { motion } from 'framer-motion'
import { Search, X, AlertCircle, MapPin, Image, Crosshair } from 'lucide-react'
import { usePlots } from '../hooks/useAdminData'
import { useToast } from '../components/Toast'
import { Input } from '@/components/ui/input'
import { useOverlays } from '@/hooks/useMapData'
import type { PlotRow, OverlayRow } from '@/types/database'

// Default map center (Binh Duong area)
const DEFAULT_CENTER = { lng: 106.6521, lat: 11.1836 }
const DEFAULT_ZOOM = 17

// Map style - using CartoDB Positron
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

export function MapEditorPage() {
  const mapRef = useRef<MapRef>(null)
  const { plots, loading, updatePlotLocation, fetchPlots } = usePlots()
  const { data: overlays = [], isLoading: overlaysLoading } = useOverlays()
  const { showToast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlot, setSelectedPlot] = useState<PlotRow | null>(null)
  const [loadedOverlayIds, setLoadedOverlayIds] = useState<Set<string>>(new Set())
  const [mapReady, setMapReady] = useState(false)
  
  // Map view state
  const [viewState, setViewState] = useState({
    longitude: DEFAULT_CENTER.lng,
    latitude: DEFAULT_CENTER.lat,
    zoom: DEFAULT_ZOOM,
    pitch: 0,
    bearing: 0
  })

  // Filter plots: only show plots WITHOUT location
  const filteredPlots = useMemo(() => {
    return plots
      .filter(p => !p.lat || !p.lng) // Only plots without coordinates
      .filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.zone?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [plots, searchQuery])

  // Stats
  const plotsWithoutLocation = useMemo(() => {
    return plots.filter(p => !p.lat || !p.lng).length
  }, [plots])

  const plotsWithLocation = plots.length - plotsWithoutLocation

  // Load overlay images onto map
  useEffect(() => {
    if (!mapReady || overlays.length === 0) return
    
    const map = mapRef.current?.getMap()
    if (!map) return

    overlays.forEach((overlay: OverlayRow) => {
      const sourceId = `overlay-${overlay.id}`
      const layerId = `overlay-layer-${overlay.id}`

      // Skip if already loaded
      if (loadedOverlayIds.has(overlay.id)) return
      if (map.getSource(sourceId)) return

      const nwLng = Number(overlay.nw_lng)
      const nwLat = Number(overlay.nw_lat)
      const seLng = Number(overlay.se_lng)
      const seLat = Number(overlay.se_lat)

      if (!isFinite(nwLng) || !isFinite(nwLat) || !isFinite(seLng) || !isFinite(seLat)) {
        console.warn(`Invalid coordinates for overlay ${overlay.id}`)
        return
      }

      try {
        // Add image source
        map.addSource(sourceId, {
          type: 'image',
          url: overlay.url,
          coordinates: [
            [nwLng, nwLat], // top-left
            [seLng, nwLat], // top-right
            [seLng, seLat], // bottom-right
            [nwLng, seLat]  // bottom-left
          ]
        })

        // Add raster layer
        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: {
            'raster-opacity': 0.85,
            'raster-fade-duration': 300
          }
        })

        setLoadedOverlayIds(prev => new Set([...prev, overlay.id]))
        console.log(`Loaded overlay: ${overlay.name || overlay.id}`)
      } catch (err) {
        console.error(`Error loading overlay ${overlay.id}:`, err)
      }
    })
  }, [mapReady, overlays, loadedOverlayIds])

  // Handle selecting a plot from the list
  const handlePlotSelect = useCallback((plot: PlotRow) => {
    setSelectedPlot(plot)
    showToast(`Đã chọn: ${plot.name}. Click vào bản đồ để gán vị trí.`, 'info')
  }, [showToast])

  // Handle clicking on map to assign coordinates
  const handleMapClick = useCallback(async (e: maplibregl.MapLayerMouseEvent) => {
    if (!selectedPlot) {
      showToast('Vui lòng chọn một ô từ danh sách trước', 'info')
      return
    }

    const { lng, lat } = e.lngLat
    const confirmMsg = `Gán vị trí này cho ô ${selectedPlot.name}?\n\nTọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    
    if (!window.confirm(confirmMsg)) return

    const result = await updatePlotLocation(selectedPlot.name!, lat, lng)
    
    if (result.success) {
      showToast(`Đã gán vị trí cho ${selectedPlot.name}`, 'success')
      setSelectedPlot(null)
      // Refresh plots list
      fetchPlots()
    } else {
      showToast('Lỗi: ' + result.error, 'error')
    }
  }, [selectedPlot, updatePlotLocation, showToast, fetchPlots])

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-4">
      {/* LEFT PANEL - Plot List (only plots without location) */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b bg-white z-10">
          <h2 className="font-bold text-gray-800 mb-1">Gán Vị Trí</h2>
          <p className="text-xs text-gray-500 mb-3">Chọn ô → Click bản đồ để gán tọa độ</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm ô hoặc khách hàng..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-500 flex gap-4">
          <span>Chưa gán: <strong className="text-orange-600">{plotsWithoutLocation}</strong></span>
          <span>Đã gán: <strong className="text-green-600">{plotsWithLocation}</strong></span>
        </div>

        {/* Plot List */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
            </div>
          )}
          
          <div className="divide-y divide-gray-100">
            {filteredPlots.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="font-medium">Tất cả đã có vị trí!</p>
                <p className="text-xs mt-1">Không còn ô nào cần gán tọa độ</p>
              </div>
            ) : (
              filteredPlots.map(plot => {
                const isSelected = selectedPlot?.id === plot.id

                return (
                  <div
                    key={plot.id}
                    onClick={() => handlePlotSelect(plot)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-all ${
                      isSelected 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{plot.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[140px]">
                          {plot.customer_name || 'Chưa có khách'}
                        </div>
                        {plot.zone && (
                          <div className="text-xs text-gray-400">Khu: {plot.zone}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={plot.status} />
                        <span className="text-[10px] flex items-center text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3 mr-1" /> Chưa gán
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer Panel when selected */}
        {selectedPlot && (
          <div className="p-3 bg-blue-600 text-white text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold flex items-center gap-2">
                <Crosshair className="w-4 h-4" />
                {selectedPlot.name}
              </span>
              <button 
                onClick={() => setSelectedPlot(null)}
                className="p-1 hover:bg-blue-500 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-blue-100 text-xs">
              Click vào vị trí trên bản đồ để gán tọa độ
            </div>
          </div>
        )}
      </motion.div>

      {/* RIGHT PANEL - MAP with Overlay Images */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
      >
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={handleMapClick}
          onLoad={() => setMapReady(true)}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          cursor={selectedPlot ? 'crosshair' : 'grab'}
        >
          {/* Navigation Controls */}
          <NavigationControl position="bottom-right" showCompass />
          <ScaleControl position="bottom-left" />
        </Map>

        {/* Floating Instruction */}
        <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-sm z-10 ${
          selectedPlot 
            ? 'bg-blue-600 text-white' 
            : 'bg-white/90 backdrop-blur text-gray-700'
        }`}>
          <div className="flex items-center gap-2">
            {selectedPlot ? (
              <>
                <Crosshair className="w-4 h-4" />
                <span>Click để gán vị trí cho <strong>{selectedPlot.name}</strong></span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Chọn một ô từ danh sách bên trái</span>
              </>
            )}
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow-lg">
          <p className="text-xs text-gray-600 font-mono">
            {viewState.latitude.toFixed(5)}°N, {viewState.longitude.toFixed(5)}°E | Zoom: {viewState.zoom.toFixed(1)}
          </p>
        </div>

        {/* Overlay Status */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg text-xs z-10">
          <div className="flex items-center gap-2 text-gray-600">
            <Image className="w-4 h-4" />
            <span>
              {overlaysLoading 
                ? 'Đang tải bản đồ...' 
                : `${loadedOverlayIds.size}/${overlays.length} overlay`}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// --- STATUS BADGE COMPONENT ---
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'Đã bán': 'bg-red-100 text-red-700 border-red-200',
    'Đã an táng': 'bg-red-100 text-red-700 border-red-200',
    'Đặt cọc': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Trống': 'bg-green-100 text-green-700 border-green-200'
  }

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded border ${
      colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
    }`}>
      {status}
    </span>
  )
}
