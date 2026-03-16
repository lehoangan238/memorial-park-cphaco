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
import Map, { NavigationControl, ScaleControl, Source, Layer } from 'react-map-gl/maplibre'
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

function normalizeOverlayOpacity(rawOpacity: unknown): number {
  const value = Number(rawOpacity)
  if (!Number.isFinite(value)) return 0.85

  // Accept both DB formats: 0-1 and 0-100.
  const normalized = value > 1 ? value / 100 : value
  return Math.min(1, Math.max(0.05, normalized))
}

function parseCoordinate(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const normalized = value.trim().replace(',', '.')
    if (!normalized) return null
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function getPlotCoordinates(plot: PlotRow): { lat: number; lng: number } | null {
  const lat = parseCoordinate(plot.lat)
  const lng = parseCoordinate(plot.lng)
  if (lat === null || lng === null) return null
  return { lat, lng }
}

function getOverlayBounds(overlay: OverlayRow) {
  const rawNwLng = Number(overlay.nw_lng)
  const rawNwLat = Number(overlay.nw_lat)
  const rawSeLng = Number(overlay.se_lng)
  const rawSeLat = Number(overlay.se_lat)

  if (!isFinite(rawNwLng) || !isFinite(rawNwLat) || !isFinite(rawSeLng) || !isFinite(rawSeLat)) {
    return null
  }

  // Normalize bounds to tolerate swapped NW/SE data from admin inputs.
  const west = Math.min(rawNwLng, rawSeLng)
  const east = Math.max(rawNwLng, rawSeLng)
  const south = Math.min(rawNwLat, rawSeLat)
  const north = Math.max(rawNwLat, rawSeLat)

  if (west === east || south === north) {
    return null
  }

  return { west, east, south, north }
}

export function MapEditorPage() {
  const mapRef = useRef<MapRef>(null)
  const { plots, loading, updatePlotLocation, fetchPlots } = usePlots()
  const { data: overlays = [], isLoading: overlaysLoading } = useOverlays()
  const { showToast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [overlayQuery, setOverlayQuery] = useState('')
  const [selectedPlot, setSelectedPlot] = useState<PlotRow | null>(null)
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
      .filter((p) => !getPlotCoordinates(p)) // Only plots without valid coordinates
      .filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.zone?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [plots, searchQuery])

  // Stats
  const plotsWithoutLocation = useMemo(() => {
    return plots.filter((p) => !getPlotCoordinates(p)).length
  }, [plots])

  const plotsWithLocation = plots.length - plotsWithoutLocation

  const assignedPlotsGeoJSON = useMemo(() => {
    const assigned = plots
      .map((plot) => {
        const coordinates = getPlotCoordinates(plot)
        return coordinates ? { plot, coordinates } : null
      })
      .filter(Boolean) as Array<{ plot: PlotRow; coordinates: { lat: number; lng: number } }>

    return {
      type: 'FeatureCollection' as const,
      features: assigned.map(({ plot, coordinates }) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [coordinates.lng, coordinates.lat] as [number, number]
        },
        properties: {
          id: plot.id,
          status: plot.status
        }
      }))
    }
  }, [plots])

  const filteredOverlays = useMemo(() => {
    const query = overlayQuery.trim().toLowerCase()
    if (!query) return overlays

    return overlays.filter((overlay) => {
      const name = (overlay.name || '').toLowerCase()
      const displayName = (overlay.display_name || '').toLowerCase()
      const id = overlay.id.toLowerCase()
      return name.includes(query) || displayName.includes(query) || id.includes(query)
    })
  }, [overlays, overlayQuery])

  const visibleOverlayIds = useMemo(() => {
    return new Set(filteredOverlays.map((overlay) => overlay.id))
  }, [filteredOverlays])

  const invalidFilteredOverlays = useMemo(() => {
    return filteredOverlays.filter((overlay) => {
      const bounds = getOverlayBounds(overlay)
      const hasUrl = Boolean((overlay.url || overlay.url_mobile || '').trim())
      return !bounds || !hasUrl
    })
  }, [filteredOverlays])

  const overlayBoundsGeoJSON = useMemo(() => {
    const features = filteredOverlays
      .map((overlay) => {
        const bounds = getOverlayBounds(overlay)
        if (!bounds) return null

        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[
              [bounds.west, bounds.north],
              [bounds.east, bounds.north],
              [bounds.east, bounds.south],
              [bounds.west, bounds.south],
              [bounds.west, bounds.north]
            ]]
          },
          properties: {
            id: overlay.id,
            name: overlay.display_name || overlay.name || overlay.id
          }
        }
      })
      .filter((feature): feature is NonNullable<typeof feature> => feature !== null)

    return {
      type: 'FeatureCollection' as const,
      features
    }
  }, [filteredOverlays])

  // Load overlay images onto map
  useEffect(() => {
    if (!mapReady || overlays.length === 0) return
    
    const map = mapRef.current?.getMap()
    if (!map) return

    const sortedOverlays = [...overlays].sort((a, b) => {
      const zA = Number.isFinite(Number(a.z_index)) ? Number(a.z_index) : 0
      const zB = Number.isFinite(Number(b.z_index)) ? Number(b.z_index) : 0
      if (zA !== zB) return zA - zB
      return (a.name || a.id).localeCompare(b.name || b.id)
    })

    sortedOverlays.forEach((overlay: OverlayRow) => {
      const sourceId = `overlay-${overlay.id}`
      const layerId = `overlay-layer-${overlay.id}`

      // Skip if source already exists on current style.
      if (map.getSource(sourceId)) {
        return
      }

      const bounds = getOverlayBounds(overlay)
      const sourceUrl = (overlay.url || overlay.url_mobile || '').trim()

      if (!bounds) {
        console.warn(`Invalid coordinates for overlay ${overlay.id}`)
        return
      }

      if (!sourceUrl) {
        console.warn(`Missing image URL for overlay ${overlay.id}`)
        return
      }

      try {
        // Add image source
        map.addSource(sourceId, {
          type: 'image',
          url: sourceUrl,
          coordinates: [
            [bounds.west, bounds.north], // top-left
            [bounds.east, bounds.north], // top-right
            [bounds.east, bounds.south], // bottom-right
            [bounds.west, bounds.south]  // bottom-left
          ]
        })

        const overlayLayerConfig = {
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: {
            'raster-opacity': normalizeOverlayOpacity(overlay.opacity),
            'raster-fade-duration': 300
          },
          layout: {
            visibility: 'visible'
          }
        } as const

        // Add raster layer (insert below assigned dots only when that layer exists).
        if (map.getLayer('assigned-plots-circle')) {
          map.addLayer(overlayLayerConfig, 'assigned-plots-circle')
        } else {
          map.addLayer(overlayLayerConfig)
        }

        // Ensure assigned position dots stay on top after overlay updates.
        if (map.getLayer('assigned-plots-circle')) {
          map.moveLayer('assigned-plots-circle')
        }

        console.log(`Loaded overlay: ${overlay.name || overlay.id}`)
      } catch (err) {
        console.error(`Error loading overlay ${overlay.id}:`, err)
      }
    })
  }, [mapReady, overlays])

  // Toggle overlay visibility based on search filter.
  useEffect(() => {
    if (!mapReady) return

    const map = mapRef.current?.getMap()
    if (!map) return

    const sortedOverlays = [...overlays].sort((a, b) => {
      const zA = Number.isFinite(Number(a.z_index)) ? Number(a.z_index) : 0
      const zB = Number.isFinite(Number(b.z_index)) ? Number(b.z_index) : 0
      if (zA !== zB) return zA - zB
      return (a.name || a.id).localeCompare(b.name || b.id)
    })

    sortedOverlays.forEach((overlay: OverlayRow) => {
      const layerId = `overlay-layer-${overlay.id}`
      if (!map.getLayer(layerId)) return

      const shouldShow = visibleOverlayIds.has(overlay.id)
      map.setLayoutProperty(layerId, 'visibility', shouldShow ? 'visible' : 'none')
    })
  }, [mapReady, overlays, visibleOverlayIds])

  const handleFocusOverlay = useCallback((overlay: OverlayRow) => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const bounds = getOverlayBounds(overlay)

    if (!bounds) {
      showToast('Overlay này có tọa độ không hợp lệ', 'error')
      return
    }

    map.fitBounds(
      [
        [bounds.west, bounds.south],
        [bounds.east, bounds.north]
      ],
      {
        padding: 80,
        duration: 700,
        maxZoom: 20
      }
    )
  }, [showToast])

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
          {/* Debug bounds for filtered overlays (helps detect image loading issues) */}
          {overlayQuery.trim() && overlayBoundsGeoJSON.features.length > 0 && (
            <Source id="overlay-bounds-debug" type="geojson" data={overlayBoundsGeoJSON}>
              <Layer
                id="overlay-bounds-line"
                type="line"
                paint={{
                  'line-color': '#1D4ED8',
                  'line-width': 1.4,
                  'line-opacity': 0.8,
                  'line-dasharray': [2, 2]
                }}
              />
            </Source>
          )}

          {/* Assigned plot positions */}
          {assignedPlotsGeoJSON.features.length > 0 && (
            <Source id="assigned-plots" type="geojson" data={assignedPlotsGeoJSON}>
              <Layer
                id="assigned-plots-circle"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate', ['linear'], ['zoom'],
                    14, 2.4,
                    16, 3.2,
                    18, 4.2,
                    20, 5.4
                  ],
                  'circle-color': [
                    'match', ['get', 'status'],
                    'Trống', '#10B981',
                    'Đã bán', '#EF4444',
                    'Đặt cọc', '#F59E0B',
                    'Đã an táng', '#6B7280',
                    '#3B82F6'
                  ],
                  'circle-opacity': 0.9,
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 1.3
                }}
              />
            </Source>
          )}

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

        {/* Overlay Filter */}
        <div className="absolute top-16 left-4 z-10 w-[300px] bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border border-gray-100">
          <div className="text-xs font-semibold text-gray-700 mb-2">Lọc overlay theo tên</div>
          <Input
            value={overlayQuery}
            onChange={(e) => setOverlayQuery(e.target.value)}
            placeholder="Nhập tên, display name hoặc ID..."
            className="h-8 text-xs"
          />
          <div className="mt-2 text-[11px] text-gray-600 flex gap-3">
            <span>Khớp: <strong>{filteredOverlays.length}</strong></span>
            <span>Hiện: <strong>{visibleOverlayIds.size}</strong></span>
            <span>Lỗi tọa độ: <strong className="text-red-600">{invalidFilteredOverlays.length}</strong></span>
          </div>

          {filteredOverlays.length > 0 && (
            <div className="mt-2 max-h-28 overflow-auto space-y-1">
              {filteredOverlays.map((overlay) => (
                <button
                  key={overlay.id}
                  onClick={() => handleFocusOverlay(overlay)}
                  className="w-full text-left px-2 py-1 rounded text-[11px] hover:bg-blue-50 text-gray-700"
                  title="Zoom đến overlay này"
                >
                  {(overlay.display_name || overlay.name || overlay.id)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Overlay Status */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg text-xs z-10">
          <div className="flex items-center gap-2 text-gray-600">
            <Image className="w-4 h-4" />
            <span>
              {overlaysLoading 
                ? 'Đang tải bản đồ...' 
                : `${visibleOverlayIds.size}/${filteredOverlays.length} overlay`}
            </span>
          </div>
          <div className="mt-1 text-gray-600">
            Vị trí đã gán: <strong>{plotsWithLocation}</strong>
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
