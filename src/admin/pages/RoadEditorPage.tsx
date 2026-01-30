/**
 * Road Network Editor Page
 * Cho phép admin vẽ đường đi nội bộ trên bản đồ
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  MousePointer,
  Circle,
  GitBranch,
  Loader2,
  X,
  MapPin,
  Flag,
  Crosshair,
  RotateCcw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { RoadNodeRow, RoadEdgeRow } from '@/types/database'
import { useToast } from '../components/Toast'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const DEFAULT_CENTER = { lat: 11.1712, lng: 106.6514 }

type EditorMode = 'select' | 'add-node' | 'add-edge'
type NodeType = 'gate' | 'intersection' | 'landmark' | 'endpoint'

const NODE_COLORS: Record<NodeType, string> = {
  gate: '#10B981',      // Green
  intersection: '#3B82F6', // Blue
  landmark: '#F59E0B',  // Amber
  endpoint: '#8B5CF6'   // Purple
}

export function RoadEditorPage() {
  const mapRef = useRef<MapRef>(null)
  const { showToast } = useToast()
  
  // Data state
  const [nodes, setNodes] = useState<RoadNodeRow[]>([])
  const [edges, setEdges] = useState<RoadEdgeRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Editor state
  const [mode, setMode] = useState<EditorMode>('select')
  const [selectedNode, setSelectedNode] = useState<RoadNodeRow | null>(null)
  const [edgeStartNode, setEdgeStartNode] = useState<RoadNodeRow | null>(null)
  const [newNodeType, setNewNodeType] = useState<NodeType>('intersection')
  
  // Form state for new/edit node
  const [editingNode, setEditingNode] = useState<Partial<RoadNodeRow> | null>(null)

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [nodesRes, edgesRes] = await Promise.all([
        supabase.from('road_nodes').select('*'),
        supabase.from('road_edges').select('*')
      ])
      
      if (nodesRes.error) throw nodesRes.error
      if (edgesRes.error) throw edgesRes.error
      
      setNodes(nodesRes.data || [])
      setEdges(edgesRes.data || [])
    } catch (err: any) {
      showToast('Lỗi tải dữ liệu: ' + err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate edges GeoJSON
  const edgesGeoJSON = useMemo(() => {
    const nodeMap = new globalThis.Map(nodes.map(n => [n.id, n]))
    
    const features = edges.map(edge => {
      const fromNode = nodeMap.get(edge.from_node_id)
      const toNode = nodeMap.get(edge.to_node_id)
      
      if (!fromNode || !toNode) return null
      
      return {
        type: 'Feature' as const,
        properties: {
          id: edge.id,
          road_type: edge.road_type
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [fromNode.lng, fromNode.lat],
            [toNode.lng, toNode.lat]
          ]
        }
      }
    }).filter((f): f is NonNullable<typeof f> => f !== null)

    return {
      type: 'FeatureCollection' as const,
      features
    }
  }, [nodes, edges])

  // Handle map click
  const handleMapClick = useCallback(async (e: MapLayerMouseEvent) => {
    if (mode === 'add-node') {
      const { lat, lng } = e.lngLat
      setEditingNode({
        lat,
        lng,
        node_type: newNodeType,
        name: ''
      })
    }
  }, [mode, newNodeType])

  // Handle node click
  const handleNodeClick = useCallback((node: RoadNodeRow) => {
    if (mode === 'select') {
      setSelectedNode(node)
      setEditingNode(node)
    } else if (mode === 'add-edge') {
      if (!edgeStartNode) {
        setEdgeStartNode(node)
        showToast('Chọn điểm kết thúc', 'info')
      } else if (edgeStartNode.id !== node.id) {
        // Create edge
        createEdge(edgeStartNode.id, node.id)
        setEdgeStartNode(null)
      }
    }
  }, [mode, edgeStartNode])

  // Create new node
  const createNode = async () => {
    if (!editingNode || !editingNode.lat || !editingNode.lng) return
    
    setIsSaving(true)
    try {
      const { data, error } = await (supabase as any)
        .from('road_nodes')
        .insert({
          name: editingNode.name || null,
          lat: editingNode.lat,
          lng: editingNode.lng,
          node_type: editingNode.node_type || 'intersection'
        })
        .select()
        .single()
      
      if (error) throw error
      
      setNodes(prev => [...prev, data])
      setEditingNode(null)
      setMode('select')
      showToast('Đã thêm điểm mới', 'success')
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Update node
  const updateNode = async () => {
    if (!editingNode || !editingNode.id) return
    
    setIsSaving(true)
    try {
      const { error } = await (supabase as any)
        .from('road_nodes')
        .update({
          name: editingNode.name,
          node_type: editingNode.node_type
        })
        .eq('id', editingNode.id)
      
      if (error) throw error
      
      setNodes(prev => prev.map(n => n.id === editingNode.id ? { ...n, ...editingNode } as RoadNodeRow : n))
      showToast('Đã cập nhật', 'success')
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete node
  const deleteNode = async (nodeId: string) => {
    if (!confirm('Xóa điểm này? Các đường nối liên quan cũng sẽ bị xóa.')) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('road_nodes')
        .delete()
        .eq('id', nodeId)
      
      if (error) throw error
      
      setNodes(prev => prev.filter(n => n.id !== nodeId))
      setEdges(prev => prev.filter(e => e.from_node_id !== nodeId && e.to_node_id !== nodeId))
      setSelectedNode(null)
      setEditingNode(null)
      showToast('Đã xóa', 'success')
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Create edge
  const createEdge = async (fromId: string, toId: string) => {
    // Check if edge already exists
    const exists = edges.some(e => 
      (e.from_node_id === fromId && e.to_node_id === toId) ||
      (e.from_node_id === toId && e.to_node_id === fromId)
    )
    
    if (exists) {
      showToast('Đường này đã tồn tại', 'error')
      return
    }
    
    setIsSaving(true)
    try {
      const { data, error } = await (supabase as any)
        .from('road_edges')
        .insert({
          from_node_id: fromId,
          to_node_id: toId,
          bidirectional: true,
          road_type: 'main'
        })
        .select()
        .single()
      
      if (error) throw error
      
      setEdges(prev => [...prev, data])
      showToast('Đã tạo đường nối', 'success')
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete edge
  const deleteEdge = async (edgeId: string) => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('road_edges')
        .delete()
        .eq('id', edgeId)
      
      if (error) throw error
      
      setEdges(prev => prev.filter(e => e.id !== edgeId))
      showToast('Đã xóa đường', 'success')
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Quản lý đường đi</h1>
          <p className="text-sm text-gray-500">Vẽ mạng lưới đường đi nội bộ cho tính năng dẫn đường</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {nodes.length} điểm • {edges.length} đường
          </span>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-3 border-b border-gray-200 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => { setMode('select'); setEdgeStartNode(null) }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'select' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MousePointer className="w-4 h-4 inline mr-1" />
                Chọn
              </button>
              <button
                onClick={() => { setMode('add-node'); setSelectedNode(null); setEditingNode(null) }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'add-node' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Circle className="w-4 h-4 inline mr-1" />
                Thêm điểm
              </button>
              <button
                onClick={() => { setMode('add-edge'); setSelectedNode(null); setEditingNode(null); setEdgeStartNode(null) }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'add-edge' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <GitBranch className="w-4 h-4 inline mr-1" />
                Nối đường
              </button>
            </div>

            {mode === 'add-node' && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-500">Loại:</span>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value as NodeType)}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                >
                  <option value="gate">Cổng</option>
                  <option value="intersection">Ngã rẽ</option>
                  <option value="landmark">Địa điểm</option>
                  <option value="endpoint">Điểm cuối</option>
                </select>
              </div>
            )}

            {mode === 'add-edge' && edgeStartNode && (
              <div className="flex items-center gap-2 ml-4 text-sm text-blue-600">
                <span>Từ: {edgeStartNode.name || edgeStartNode.id.slice(0, 8)}</span>
                <button
                  onClick={() => setEdgeStartNode(null)}
                  className="p-1 hover:bg-blue-100 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="h-[500px]">
            <Map
              ref={mapRef}
              initialViewState={{
                longitude: DEFAULT_CENTER.lng,
                latitude: DEFAULT_CENTER.lat,
                zoom: 17
              }}
              mapStyle={MAP_STYLE}
              onClick={handleMapClick}
              cursor={mode === 'add-node' ? 'crosshair' : 'grab'}
            >
              <NavigationControl position="top-right" />

              {/* Edges Layer */}
              <Source id="edges" type="geojson" data={edgesGeoJSON}>
                <Layer
                  id="edges-line"
                  type="line"
                  paint={{
                    'line-color': '#3B82F6',
                    'line-width': 4,
                    'line-opacity': 0.8
                  }}
                />
                <Layer
                  id="edges-line-dash"
                  type="line"
                  paint={{
                    'line-color': '#ffffff',
                    'line-width': 2,
                    'line-dasharray': [2, 2],
                    'line-opacity': 0.6
                  }}
                />
              </Source>

              {/* Node Markers */}
              {nodes.map(node => (
                <Marker
                  key={node.id}
                  longitude={node.lng}
                  latitude={node.lat}
                  anchor="center"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation()
                    handleNodeClick(node)
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    className={`cursor-pointer ${
                      selectedNode?.id === node.id || edgeStartNode?.id === node.id
                        ? 'ring-4 ring-blue-400 ring-opacity-50 rounded-full'
                        : ''
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                      style={{ backgroundColor: NODE_COLORS[node.node_type as NodeType] || '#6B7280' }}
                    >
                      {node.node_type === 'gate' && <Flag className="w-4 h-4 text-white" />}
                      {node.node_type === 'intersection' && <Crosshair className="w-4 h-4 text-white" />}
                      {node.node_type === 'landmark' && <MapPin className="w-4 h-4 text-white" />}
                      {node.node_type === 'endpoint' && <Circle className="w-4 h-4 text-white" />}
                    </div>
                  </motion.div>
                </Marker>
              ))}

              {/* New node preview */}
              {editingNode && !editingNode.id && (
                <Marker
                  longitude={editingNode.lng!}
                  latitude={editingNode.lat!}
                  anchor="center"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse"
                    style={{ backgroundColor: NODE_COLORS[editingNode.node_type as NodeType] || '#6B7280' }}
                  />
                </Marker>
              )}
            </Map>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-4">
          {/* Node Editor */}
          <AnimatePresence mode="wait">
            {editingNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <h3 className="font-medium text-gray-900 mb-4">
                  {editingNode.id ? 'Chỉnh sửa điểm' : 'Thêm điểm mới'}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Tên</label>
                    <input
                      type="text"
                      value={editingNode.name || ''}
                      onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                      placeholder="VD: Cổng chính, Ngã ba A..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Loại</label>
                    <select
                      value={editingNode.node_type || 'intersection'}
                      onChange={(e) => setEditingNode({ ...editingNode, node_type: e.target.value as NodeType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="gate">Cổng</option>
                      <option value="intersection">Ngã rẽ</option>
                      <option value="landmark">Địa điểm</option>
                      <option value="endpoint">Điểm cuối</option>
                    </select>
                  </div>

                  <div className="text-xs text-gray-500">
                    Tọa độ: {editingNode.lat?.toFixed(6)}, {editingNode.lng?.toFixed(6)}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {editingNode.id ? (
                      <>
                        <button
                          onClick={updateNode}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Lưu'}
                        </button>
                        <button
                          onClick={() => deleteNode(editingNode.id!)}
                          disabled={isSaving}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={createNode}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Thêm'}
                        </button>
                        <button
                          onClick={() => setEditingNode(null)}
                          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer"
                        >
                          Hủy
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Chú thích</h3>
            <div className="space-y-2">
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600 capitalize">
                    {type === 'gate' && 'Cổng'}
                    {type === 'intersection' && 'Ngã rẽ'}
                    {type === 'landmark' && 'Địa điểm'}
                    {type === 'endpoint' && 'Điểm cuối'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Edges List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Đường nối ({edges.length})</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {edges.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có đường nối nào</p>
              ) : (
                edges.map(edge => {
                  const fromNode = nodes.find(n => n.id === edge.from_node_id)
                  const toNode = nodes.find(n => n.id === edge.to_node_id)
                  return (
                    <div key={edge.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate flex-1">
                        {fromNode?.name || 'Điểm'} → {toNode?.name || 'Điểm'}
                      </span>
                      <button
                        onClick={() => deleteEdge(edge.id)}
                        className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-medium text-blue-900 mb-2">Hướng dẫn</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Thêm điểm:</strong> Chọn mode "Thêm điểm" rồi click vào bản đồ</li>
              <li>• <strong>Nối đường:</strong> Chọn mode "Nối đường" rồi click 2 điểm</li>
              <li>• <strong>Chỉnh sửa:</strong> Click vào điểm để sửa hoặc xóa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
