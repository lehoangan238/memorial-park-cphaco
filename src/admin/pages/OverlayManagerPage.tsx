import { useState, useCallback, useMemo, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { 
  Upload, Trash2, Edit3, Save, X, Image,
  Loader2, AlertCircle, Eye, EyeOff, Layers, RefreshCw,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, Search, Download, Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useMapData } from '@/hooks/useMapData'
import type { OverlayRow, OverlayType, OverlayInsert, OverlayUpdate } from '@/types/database'

const OVERLAY_TYPES: { value: OverlayType; label: string }[] = [
  { value: 'zone_map', label: 'Bản đồ khu vực' },
  { value: 'satellite', label: 'Ảnh vệ tinh' },
  { value: 'blueprint', label: 'Bản vẽ' },
  { value: 'decoration', label: 'Trang trí' },
  { value: 'other', label: 'Khác' }
]

const MAX_IMAGE_SIZE = 2048

const resizeImage = (file: File, maxSize: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      if (img.width <= maxSize && img.height <= maxSize) { resolve(file); return }
      const ratio = Math.min(maxSize / img.width, maxSize / img.height)
      const canvas = document.createElement('canvas')
      canvas.width = Math.floor(img.width * ratio)
      canvas.height = Math.floor(img.height * ratio)
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Cannot get canvas context')); return }
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Failed')), 'image/png', 0.92)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export function OverlayManagerPage() {
  const { overlays, refetch } = useMapData()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<OverlayRow>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceFileRef = useRef<HTMLInputElement>(null)

  const [newOverlay, setNewOverlay] = useState({
    name: '', display_name: '', description: '',
    nw_lat: '', nw_lng: '', se_lat: '', se_lng: '',
    type: 'zone_map' as OverlayType, opacity: 85
  })

  const filteredData = useMemo(() => {
    if (filterType === 'all') return overlays
    return overlays.filter(o => o.type === filterType)
  }, [overlays, filterType])

  const stats = useMemo(() => ({
    total: overlays.length,
    visible: overlays.filter(o => o.is_visible).length,
    byType: OVERLAY_TYPES.map(t => ({ ...t, count: overlays.filter(o => o.type === t.value).length }))
  }), [overlays])

  const columns = useMemo<ColumnDef<OverlayRow>[]>(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()} className="h-8 px-2 -ml-2">
          Tên {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-3 w-3" /> : <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
            <img src={row.original.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect fill="%23f5f5f4" width="48" height="48"/></svg>' }} />
          </div>
          <div>
            <p className="font-medium">{row.getValue('name') || 'Không tên'}</p>
            {row.original.display_name && <p className="text-xs text-stone-500">{row.original.display_name}</p>}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Loại',
      cell: ({ row }) => <Badge variant="secondary" className="text-xs">{OVERLAY_TYPES.find(t => t.value === row.getValue('type'))?.label || row.getValue('type')}</Badge>,
    },
    {
      accessorKey: 'is_visible',
      header: 'Hiển thị',
      cell: ({ row }) => row.getValue('is_visible') ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-stone-400" />,
    },
    {
      accessorKey: 'opacity',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()} className="h-8 px-2 -ml-2">
          Opacity {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-3 w-3" /> : <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}
        </Button>
      ),
      cell: ({ row }) => `${row.getValue('opacity') ?? 85}%`,
    },
    {
      accessorKey: 'z_index',
      header: 'Z-Index',
      cell: ({ row }) => row.getValue('z_index') ?? 0,
    },
    {
      id: 'coords',
      header: 'Tọa độ',
      cell: ({ row }) => (
        <div className="text-xs text-stone-500 font-mono">
          <div>NW: {row.original.nw_lat?.toFixed(4)}, {row.original.nw_lng?.toFixed(4)}</div>
          <div>SE: {row.original.se_lat?.toFixed(4)}, {row.original.se_lng?.toFixed(4)}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Thao tác</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleToggleVisibility(row.original)} className="h-8 w-8 p-0" title={row.original.is_visible ? 'Ẩn' : 'Hiện'}>
            {row.original.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-stone-400" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleStartEdit(row.original)} className="h-8 w-8 p-0"><Edit3 className="w-4 h-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(row.original)} className="h-8 w-8 p-0 text-red-500"><Trash2 className="w-4 h-4" /></Button>
        </div>
      ),
    },
  ], [])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) { setUploadError('Chỉ chấp nhận file ảnh'); return }
    if (!newOverlay.name.trim()) { setUploadError('Vui lòng nhập tên overlay trước'); return }
    if (!newOverlay.nw_lat || !newOverlay.nw_lng || !newOverlay.se_lat || !newOverlay.se_lng) { setUploadError('Vui lòng nhập đầy đủ tọa độ'); return }

    setIsUploading(true)
    setUploadError(null)
    setUploadProgress('Đang xử lý ảnh...')

    try {
      const baseName = newOverlay.name.replace(/\s+/g, '_')
      const timestamp = Date.now()
      setUploadProgress('Đang resize ảnh (max 2048px)...')
      const resizedBlob = await resizeImage(file, MAX_IMAGE_SIZE)
      const fileName = `${baseName}_${timestamp}.png`
      
      setUploadProgress('Đang upload...')
      const { error: uploadErr } = await supabase.storage.from('overlays').upload(fileName, resizedBlob, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr

      const { data: urlData } = supabase.storage.from('overlays').getPublicUrl(fileName)

      setUploadProgress('Đang lưu vào database...')
      const insertData: OverlayInsert = {
        name: newOverlay.name.trim(),
        display_name: newOverlay.display_name.trim() || null,
        description: newOverlay.description.trim() || null,
        url: urlData.publicUrl,
        nw_lat: parseFloat(newOverlay.nw_lat),
        nw_lng: parseFloat(newOverlay.nw_lng),
        se_lat: parseFloat(newOverlay.se_lat),
        se_lng: parseFloat(newOverlay.se_lng),
        type: newOverlay.type,
        opacity: newOverlay.opacity,
        is_visible: true,
        z_index: overlays.length
      }
      // @ts-ignore
      const { error: dbError } = await supabase.from('overlays').insert(insertData)
      if (dbError) throw dbError

      setNewOverlay({ name: '', display_name: '', description: '', nw_lat: '', nw_lng: '', se_lat: '', se_lng: '', type: 'zone_map', opacity: 85 })
      if (fileInputRef.current) fileInputRef.current.value = ''
      setUploadProgress('')
      setShowAddForm(false)
      refetch()
    } catch (err: any) {
      setUploadError(err.message || 'Lỗi khi upload')
    } finally {
      setIsUploading(false)
    }
  }, [newOverlay, overlays.length, refetch])

  const handleDelete = useCallback(async (overlay: OverlayRow) => {
    if (!confirm(`Xóa overlay "${overlay.name}"?`)) return
    try {
      const urlParts = overlay.url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      await supabase.storage.from('overlays').remove([fileName])
      await supabase.from('overlays').delete().eq('id', overlay.id)
      refetch()
    } catch {
      alert('Lỗi khi xóa overlay')
    }
  }, [refetch])

  const handleToggleVisibility = useCallback(async (overlay: OverlayRow) => {
    // @ts-ignore
    await supabase.from('overlays').update({ is_visible: !overlay.is_visible }).eq('id', overlay.id)
    refetch()
  }, [refetch])

  const handleStartEdit = useCallback((overlay: OverlayRow) => {
    setEditingId(overlay.id)
    setEditForm({ ...overlay })
  }, [])

  const handleReplaceImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/') || !editingId) return
    setIsSaving(true)
    try {
      const baseName = (editForm.name || editingId).replace(/\s+/g, '_')
      const resizedBlob = await resizeImage(file, MAX_IMAGE_SIZE)
      const fileName = `${baseName}_${Date.now()}.png`
      const { error: uploadErr } = await supabase.storage.from('overlays').upload(fileName, resizedBlob, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr
      const { data: urlData } = supabase.storage.from('overlays').getPublicUrl(fileName)
      // @ts-ignore
      await supabase.from('overlays').update({ url: urlData.publicUrl }).eq('id', editingId)
      setEditForm(prev => ({ ...prev, url: urlData.publicUrl }))
      refetch()
    } catch (err: any) {
      alert('Lỗi khi thay ảnh: ' + err.message)
    } finally {
      setIsSaving(false)
      if (replaceFileRef.current) replaceFileRef.current.value = ''
    }
  }, [editingId, editForm.name, refetch])

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return
    setIsSaving(true)
    try {
      const updateData: OverlayUpdate = {
        name: editForm.name, display_name: editForm.display_name, description: editForm.description,
        nw_lat: editForm.nw_lat, nw_lng: editForm.nw_lng, se_lat: editForm.se_lat, se_lng: editForm.se_lng,
        opacity: editForm.opacity, z_index: editForm.z_index, type: editForm.type, is_visible: editForm.is_visible
      }
      // @ts-ignore
      await supabase.from('overlays').update(updateData).eq('id', editingId)
      setEditingId(null)
      refetch()
    } catch {
      alert('Lỗi khi lưu')
    } finally {
      setIsSaving(false)
    }
  }, [editingId, editForm, refetch])

  const handleExport = useCallback(() => {
    const data = table.getFilteredRowModel().rows.map(r => r.original)
    const csv = [
      ['ID', 'Tên', 'Display Name', 'Type', 'URL', 'NW Lat', 'NW Lng', 'SE Lat', 'SE Lng', 'Opacity', 'Z-Index', 'Visible'].join(','),
      ...data.map(o => [o.id, o.name || '', o.display_name || '', o.type, o.url, o.nw_lat, o.nw_lng, o.se_lat, o.se_lng, o.opacity, o.z_index, o.is_visible].map(v => `"${v}"`).join(','))
    ].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `overlays_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }, [table])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Layers className="w-7 h-7 text-emerald-600" />
          Quản lý Overlay
        </h1>
        <p className="text-stone-500 mt-1">Upload và quản lý các lớp ảnh phủ trên bản đồ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 border border-stone-200">
          <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
          <p className="text-xs text-stone-500">Tổng cộng</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-stone-200">
          <p className="text-2xl font-bold text-emerald-600">{stats.visible}</p>
          <p className="text-xs text-stone-500">Đang hiện</p>
        </div>
        {stats.byType.slice(0, 5).map(t => (
          <div key={t.value} className="bg-white rounded-xl p-3 border border-stone-200 cursor-pointer hover:border-stone-300" onClick={() => setFilterType(filterType === t.value ? 'all' : t.value)}>
            <p className="text-xl font-bold text-stone-900">{t.count}</p>
            <p className="text-xs text-stone-500 truncate">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm theo tên..." className="pl-10" />
          </div>
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 px-3 rounded-md border border-stone-200">
          <option value="all">Tất cả loại</option>
          {OVERLAY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <Button variant="outline" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
        <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
        <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4 mr-2" />Thêm Overlay</Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-200">
          <h3 className="font-semibold text-emerald-900 mb-3">Thêm Overlay mới</h3>
          {uploadError && <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700"><AlertCircle className="w-4 h-4" />{uploadError}</div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <Input value={newOverlay.name} onChange={(e) => setNewOverlay(p => ({...p, name: e.target.value}))} placeholder="Tên overlay *" />
            <Input value={newOverlay.display_name} onChange={(e) => setNewOverlay(p => ({...p, display_name: e.target.value}))} placeholder="Tên hiển thị (gom nhóm)" />
            <select value={newOverlay.type} onChange={(e) => setNewOverlay(p => ({...p, type: e.target.value as OverlayType}))} className="h-10 px-3 rounded-md border border-stone-200">
              {OVERLAY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <Input value={newOverlay.description} onChange={(e) => setNewOverlay(p => ({...p, description: e.target.value}))} placeholder="Mô tả" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
            <Input type="number" step="any" value={newOverlay.nw_lat} onChange={(e) => setNewOverlay(p => ({...p, nw_lat: e.target.value}))} placeholder="NW Lat *" />
            <Input type="number" step="any" value={newOverlay.nw_lng} onChange={(e) => setNewOverlay(p => ({...p, nw_lng: e.target.value}))} placeholder="NW Lng *" />
            <Input type="number" step="any" value={newOverlay.se_lat} onChange={(e) => setNewOverlay(p => ({...p, se_lat: e.target.value}))} placeholder="SE Lat *" />
            <Input type="number" step="any" value={newOverlay.se_lng} onChange={(e) => setNewOverlay(p => ({...p, se_lng: e.target.value}))} placeholder="SE Lng *" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">Opacity:</span>
              <input type="range" min="0" max="100" value={newOverlay.opacity} onChange={(e) => setNewOverlay(p => ({...p, opacity: parseInt(e.target.value)}))} className="flex-1" />
              <span className="text-sm w-10">{newOverlay.opacity}%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-emerald-600 hover:bg-emerald-700">
              {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{uploadProgress}</> : <><Upload className="w-4 h-4 mr-2" />Chọn ảnh & Upload</>}
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Hủy</Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Chỉnh sửa Overlay</h3>
            <div className="flex gap-4 mb-4">
              <div className="w-32 h-32 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                <img src={editForm.url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-stone-500 mb-2">Thay đổi ảnh:</p>
                <input ref={replaceFileRef} type="file" accept="image/*" onChange={handleReplaceImage} className="text-sm file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-sm text-stone-500">Tên</label><Input value={editForm.name || ''} onChange={(e) => setEditForm(p => ({...p, name: e.target.value}))} /></div>
              <div><label className="text-sm text-stone-500">Tên hiển thị</label><Input value={editForm.display_name || ''} onChange={(e) => setEditForm(p => ({...p, display_name: e.target.value}))} /></div>
              <div><label className="text-sm text-stone-500">Loại</label>
                <select value={editForm.type || 'zone_map'} onChange={(e) => setEditForm(p => ({...p, type: e.target.value as OverlayType}))} className="w-full h-10 px-3 rounded-md border border-stone-200">
                  {OVERLAY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div><label className="text-sm text-stone-500">Mô tả</label><Input value={editForm.description || ''} onChange={(e) => setEditForm(p => ({...p, description: e.target.value}))} /></div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div><label className="text-sm text-stone-500">NW Lat</label><Input type="number" step="any" value={editForm.nw_lat || ''} onChange={(e) => setEditForm(p => ({...p, nw_lat: parseFloat(e.target.value)}))} /></div>
              <div><label className="text-sm text-stone-500">NW Lng</label><Input type="number" step="any" value={editForm.nw_lng || ''} onChange={(e) => setEditForm(p => ({...p, nw_lng: parseFloat(e.target.value)}))} /></div>
              <div><label className="text-sm text-stone-500">SE Lat</label><Input type="number" step="any" value={editForm.se_lat || ''} onChange={(e) => setEditForm(p => ({...p, se_lat: parseFloat(e.target.value)}))} /></div>
              <div><label className="text-sm text-stone-500">SE Lng</label><Input type="number" step="any" value={editForm.se_lng || ''} onChange={(e) => setEditForm(p => ({...p, se_lng: parseFloat(e.target.value)}))} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm text-stone-500">Opacity: {editForm.opacity}%</label>
                <input type="range" min="0" max="100" value={editForm.opacity || 85} onChange={(e) => setEditForm(p => ({...p, opacity: parseInt(e.target.value)}))} className="w-full" />
              </div>
              <div><label className="text-sm text-stone-500">Z-Index</label><Input type="number" value={editForm.z_index || 0} onChange={(e) => setEditForm(p => ({...p, z_index: parseInt(e.target.value)}))} /></div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" checked={editForm.is_visible ?? true} onChange={(e) => setEditForm(p => ({...p, is_visible: e.target.checked}))} className="w-4 h-4" />
                <label className="text-sm">Hiển thị trên bản đồ</label>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" />Hủy</Button>
              <Button onClick={handleSaveEdit} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" />Lưu</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DataTable */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="text-left p-3 font-medium text-stone-600">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} className="p-8 text-center text-stone-500"><Image className="w-12 h-12 mx-auto mb-2 text-stone-300" />Chưa có overlay nào</td></tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-stone-200 bg-stone-50">
          <div className="text-sm text-stone-500">
            Hiển thị {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} / {table.getFilteredRowModel().rows.length}
          </div>
          <div className="flex items-center gap-2">
            <select value={table.getState().pagination.pageSize} onChange={e => table.setPageSize(Number(e.target.value))} className="h-8 px-2 rounded border border-stone-200 text-sm">
              {[10, 20, 50].map(size => <option key={size} value={size}>{size} / trang</option>)}
            </select>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="h-8 w-8 p-0"><ChevronsLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8 w-8 p-0"><ChevronLeft className="w-4 h-4" /></Button>
              <span className="flex items-center px-2 text-sm">Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-8 w-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="h-8 w-8 p-0"><ChevronsRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
