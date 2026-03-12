/**
 * Drawing Editor Page
 * Draw polygons, polylines, circles on the map
 */
import { useState, useCallback, useRef } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre'
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { MapDrawingRow, MapDrawingInsert, DrawingType } from '@/types/database'
import { 
  Pencil, 
  Square, 
  Minus, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  MousePointer,
  Undo
} from 'lucide-react'
import { useToast } from '../components/Toast'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const DEFAULT_CENTER: [number, number] = [106.651891, 11.168266]

type DrawMode = 'select' | 'polygon' | 'polyline' | 'rectangle' | 'circle'

export function DrawingEditorPage() {
  const mapRef = useRef<MapRef>(null)
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  
  // State
  const [drawMode, setDrawMode] = useState<DrawMode>('select')
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([])
  const [selectedDrawing, setSelectedDrawing] = useState<MapDrawingRow | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  
  // Form state for new/edit drawing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stroke_color: '#3B82F6',
    stroke_width: 2,
    fill_color: '#3B82F680',
    fill_opacity: 0.5
  })

  // Fetch drawings
  const { data: drawings = [], isLoading } = useQuery({
    queryKey: ['map_drawings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('map_drawings')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as MapDrawingRow[]
    }
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (drawing: MapDrawingInsert) => {
      const { data, error } = await supabase
        .from('map_drawings')
        .insert(drawing as never)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_drawings'] })
      showToast('Đã lưu hình vẽ', 'success')
      resetDrawing()
    },
    onError: (error) => {
      showToast(`Lỗi: ${error.message}`, 'error')
    }
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MapDrawingRow> & { id: string }) => {
      const { error } = await supabase
        .from('map_drawings')
        .update(updates as never)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_drawings'] })
      showToast('Đã cập nhật', 'success')
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('map_drawings')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_drawings'] })
      showToast('Đã xóa', 'success')
      setSelectedDrawing(null)
    }
  })

  // Reset drawing state
  const resetDrawing = useCallback(() => {
    setCurrentPoints([])
    setIsDrawing(false)
    setDrawMode('select')
    setFormData({
      name: '',
      description: '',
      stroke_color: '#3B82F6',
      stroke_width: 2,
      fill_color: '#3B82F680',
      fill_opacity: 0.5
    })
  }, [])

  // Handle map click
  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    if (drawMode === 'select') return
    
    const point: [number, number] = [e.lngLat.lng, e.lngLat.lat]
    
    if (drawMode === 'polygon' || drawMode === 'polyline') {
      setCurrentPoints(prev => [...prev, point])
      setIsDrawing(true)
    } else if (drawMode === 'rectangle') {
      if (currentPoints.length === 0) {
        setCurrentPoints([point])
        setIsDrawing(true)
      } else if (currentPoints.length === 1) {
        // Create rectangle from 2 corners
        const [lng1, lat1] = currentPoints[0]
        const [lng2, lat2] = point
        const rectPoints: [number, number][] = [
          [lng1, lat1],
          [lng2, lat1],
          [lng2, lat2],
          [lng1, lat2],
          [lng1, lat1] // Close the polygon
        ]
        setCurrentPoints(rectPoints)
        setIsDrawing(true)
      }
    } else if (drawMode === 'circle') {
      if (currentPoints.length === 0) {
        setCurrentPoints([point])
        setIsDrawing(true)
      }
    }
  }, [drawMode, currentPoints])

  // Handle double click to finish drawing
  const handleMapDblClick = useCallback((e: MapLayerMouseEvent) => {
    e.preventDefault()
    if (isDrawing && currentPoints.length >= 2) {
      setIsDrawing(false)
    }
  }, [isDrawing, currentPoints.length])

  // Handle mouse move for preview
  const [previewPoint, setPreviewPoint] = useState<[number, number] | null>(null)
  
  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    if (isDrawing && (drawMode === 'polygon' || drawMode === 'polyline' || drawMode === 'rectangle')) {
      setPreviewPoint([e.lngLat.lng, e.lngLat.lat])
    }
  }, [isDrawing, drawMode])

  // Undo last point
  const handleUndo = useCallback(() => {
    setCurrentPoints(prev => prev.slice(0, -1))
    if (currentPoints.length <= 1) {
      setIsDrawing(false)
    }
  }, [currentPoints.length])

  // Save drawing
  const handleSave = useCallback(() => {
    if (!formData.name.trim()) {
      showToast('Vui lòng nhập tên', 'error')
      return
    }
    if (currentPoints.length < 2) {
      showToast('Cần ít nhất 2 điểm', 'error')
      return
    }

    let finalCoords = [...currentPoints]
    
    // Close polygon if needed
    if (drawMode === 'polygon' && currentPoints.length >= 3) {
      const first = currentPoints[0]
      const last = currentPoints[currentPoints.length - 1]
      if (first[0] !== last[0] || first[1] !== last[1]) {
        finalCoords.push(first)
      }
    }

    const drawing: MapDrawingInsert = {
      name: formData.name,
      description: formData.description || null,
      drawing_type: drawMode === 'rectangle' ? 'polygon' : drawMode as DrawingType,
      coordinates: finalCoords,
      stroke_color: formData.stroke_color,
      stroke_width: formData.stroke_width,
      fill_color: formData.fill_color,
      fill_opacity: formData.fill_opacity
    }

    createMutation.mutate(drawing)
  }, [formData, currentPoints, drawMode, createMutation, showToast])

  // Toggle visibility
  const toggleVisibility = useCallback((drawing: MapDrawingRow) => {
    updateMutation.mutate({
      id: drawing.id,
      is_visible: !drawing.is_visible
    })
  }, [updateMutation])

  // Convert drawings to GeoJSON
  const drawingsGeoJSON = {
    type: 'FeatureCollection' as const,
    features: drawings
      .filter(d => d.is_visible)
      .map(d => ({
        type: 'Feature' as const,
        properties: {
          id: d.id,
          name: d.name,
          stroke_color: d.stroke_color,
          stroke_width: d.stroke_width,
          fill_color: d.fill_color,
          fill_opacity: d.fill_opacity,
          drawing_type: d.drawing_type
        },
        geometry: d.drawing_type === 'polyline' 
          ? { type: 'LineString' as const, coordinates: d.coordinates }
          : { type: 'Polygon' as const, coordinates: [d.coordinates] }
      }))
  }

  // Current drawing preview GeoJSON
  const currentDrawingGeoJSON = currentPoints.length > 1 ? {
    type: 'FeatureCollection' as const,
    features: [{
      type: 'Feature' as const,
      properties: {},
      geometry: drawMode === 'polyline'
        ? { 
            type: 'LineString' as const, 
            coordinates: previewPoint 
              ? [...currentPoints, previewPoint] 
              : currentPoints 
          }
        : { 
            type: 'Polygon' as const, 
            coordinates: [
              previewPoint && currentPoints.length >= 2 
                ? [...currentPoints, previewPoint, currentPoints[0]] 
                : currentPoints.length >= 3 
                  ? [...currentPoints, currentPoints[0]]
                  : [...currentPoints, currentPoints[0]]
            ]
          }
    }]
  } : null

  // Line preview while drawing (shows line from points to cursor, and closing line for polygon)
  const linePreviewGeoJSON = currentPoints.length >= 1 && isDrawing ? {
    type: 'FeatureCollection' as const,
    features: [
      // Main line connecting all points + preview point
      {
        type: 'Feature' as const,
        properties: { lineType: 'main' },
        geometry: {
          type: 'LineString' as const,
          coordinates: previewPoint 
            ? [...currentPoints, previewPoint] 
            : currentPoints
        }
      },
      // Closing line (from preview/last point back to first point) - only for polygon with 3+ points
      ...(drawMode === 'polygon' && currentPoints.length >= 2 ? [{
        type: 'Feature' as const,
        properties: { lineType: 'closing' },
        geometry: {
          type: 'LineString' as const,
          coordinates: previewPoint 
            ? [previewPoint, currentPoints[0]]
            : [currentPoints[currentPoints.length - 1], currentPoints[0]]
        }
      }] : [])
    ]
  } : null

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Sidebar */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        {/* Tools */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Công cụ vẽ</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { resetDrawing(); setDrawMode('select') }}
              className={`p-2 rounded-lg transition-colors ${
                drawMode === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Chọn"
            >
              <MousePointer className="w-5 h-5" />
            </button>
            <button
              onClick={() => { resetDrawing(); setDrawMode('polygon') }}
              className={`p-2 rounded-lg transition-colors ${
                drawMode === 'polygon' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Vẽ đa giác"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => { resetDrawing(); setDrawMode('polyline') }}
              className={`p-2 rounded-lg transition-colors ${
                drawMode === 'polyline' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Vẽ đường"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => { resetDrawing(); setDrawMode('rectangle') }}
              className={`p-2 rounded-lg transition-colors ${
                drawMode === 'rectangle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Vẽ hình chữ nhật"
            >
              <Square className="w-5 h-5" />
            </button>
          </div>
          
          {drawMode !== 'select' && (
            <p className="text-xs text-gray-500 mt-2">
              Click trên bản đồ để thêm điểm. {drawMode === 'polygon' && 'Cần ít nhất 3 điểm.'} 
              <br />Double-click hoặc nhấn "Hoàn thành" để kết thúc.
            </p>
          )}
        </div>

        {/* Drawing Form */}
        {isDrawing && (
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Hình vẽ mới</h4>
              <div className="flex gap-1">
                <button
                  onClick={handleUndo}
                  disabled={currentPoints.length === 0}
                  className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50"
                  title="Hoàn tác"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={resetDrawing}
                  className="p-1.5 hover:bg-red-100 text-red-600 rounded"
                  title="Hủy"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Finish Drawing Button */}
            {currentPoints.length >= 2 && (
              <button
                onClick={() => setIsDrawing(false)}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
              >
                ✓ Hoàn thành vẽ ({currentPoints.length} điểm)
              </button>
            )}
            
            <input
              type="text"
              placeholder="Tên hình vẽ *"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            
            <textarea
              placeholder="Mô tả (tùy chọn)"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              rows={2}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">Màu viền</label>
                <input
                  type="color"
                  value={formData.stroke_color}
                  onChange={e => setFormData(prev => ({ ...prev, stroke_color: e.target.value }))}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Màu nền</label>
                <input
                  type="color"
                  value={formData.fill_color.slice(0, 7)}
                  onChange={e => setFormData(prev => ({ ...prev, fill_color: e.target.value + '80' }))}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Điểm: {currentPoints.length}</span>
              <button
                onClick={handleSave}
                disabled={currentPoints.length < 2 || createMutation.isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        )}

        {/* Drawings List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Danh sách ({drawings.length})
          </h4>
          
          {isLoading ? (
            <p className="text-sm text-gray-500">Đang tải...</p>
          ) : drawings.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có hình vẽ nào</p>
          ) : (
            <div className="space-y-2">
              {drawings.map(drawing => (
                <div
                  key={drawing.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedDrawing?.id === drawing.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDrawing(drawing)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: drawing.fill_color }}
                      />
                      <span className="font-medium text-sm">{drawing.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleVisibility(drawing) }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {drawing.is_visible ? (
                          <Eye className="w-4 h-4 text-gray-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Xóa hình vẽ này?')) {
                            deleteMutation.mutate(drawing.id)
                          }
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {drawing.drawing_type} • {drawing.coordinates.length} điểm
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: DEFAULT_CENTER[0],
            latitude: DEFAULT_CENTER[1],
            zoom: 17
          }}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          onClick={handleMapClick}
          onDblClick={handleMapDblClick}
          onMouseMove={handleMouseMove}
          cursor={drawMode !== 'select' ? 'crosshair' : 'grab'}
          doubleClickZoom={false}
        >
          {/* Existing drawings */}
          <Source id="drawings" type="geojson" data={drawingsGeoJSON}>
            <Layer
              id="drawings-fill"
              type="fill"
              filter={['==', ['get', 'drawing_type'], 'polygon']}
              paint={{
                'fill-color': ['get', 'fill_color'],
                'fill-opacity': ['get', 'fill_opacity']
              }}
            />
            <Layer
              id="drawings-line"
              type="line"
              paint={{
                'line-color': ['get', 'stroke_color'],
                'line-width': ['get', 'stroke_width']
              }}
            />
          </Source>

          {/* Current drawing preview */}
          {currentDrawingGeoJSON && !isDrawing && (
            <Source id="current-drawing" type="geojson" data={currentDrawingGeoJSON}>
              <Layer
                id="current-fill"
                type="fill"
                filter={['==', '$type', 'Polygon']}
                paint={{
                  'fill-color': formData.fill_color,
                  'fill-opacity': 0.3
                }}
              />
              <Layer
                id="current-line"
                type="line"
                paint={{
                  'line-color': formData.stroke_color,
                  'line-width': 2
                }}
              />
            </Source>
          )}

          {/* Line preview while drawing */}
          {linePreviewGeoJSON && (
            <Source id="line-preview" type="geojson" data={linePreviewGeoJSON}>
              <Layer
                id="preview-line"
                type="line"
                paint={{
                  'line-color': formData.stroke_color,
                  'line-width': 2,
                  'line-dasharray': [4, 4]
                }}
              />
            </Source>
          )}

          {/* Point markers for current drawing */}
          {currentPoints.map((point, idx) => (
            <Marker
              key={idx}
              longitude={point[0]}
              latitude={point[1]}
              anchor="center"
            >
              <div className={`w-3 h-3 border-2 border-white rounded-full shadow ${
                idx === 0 ? 'bg-green-600' : 'bg-blue-600'
              }`} />
            </Marker>
          ))}
        </Map>
      </div>
    </div>
  )
}

export default DrawingEditorPage
