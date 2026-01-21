import { useState, useCallback, useRef } from 'react'
import { 
  Upload, Trash2, Edit3, Save, X, Image, MapPin, 
  Loader2, AlertCircle, Eye, EyeOff, Layers, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useMapData } from '@/hooks/useMapData'
import type { OverlayRow, OverlayType } from '@/types/database'

const OVERLAY_TYPES: { value: OverlayType; label: string }[] = [
  { value: 'zone_map', label: 'Bản đồ khu vực' },
  { value: 'satellite', label: 'Ảnh vệ tinh' },
  { value: 'blueprint', label: 'Bản vẽ' },
  { value: 'decoration', label: 'Trang trí' },
  { value: 'other', label: 'Khác' }
]

// Image size limit - single size for all devices
const MAX_IMAGE_SIZE = 2048

// Helper function to resize image
const resizeImage = (file: File, maxSize: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      // Check if resize needed
      if (img.width <= maxSize && img.height <= maxSize) {
        resolve(file)
        return
      }

      // Calculate new dimensions
      const ratio = Math.min(maxSize / img.width, maxSize / img.height)
      const newWidth = Math.floor(img.width * ratio)
      const newHeight = Math.floor(img.height * ratio)

      // Create canvas and resize
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Cannot get canvas context'))
        return
      }

      // Use high quality scaling
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        'image/png',
        0.92
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export function OverlayManagerPage() {
  const { overlays, refetch } = useMapData()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<OverlayRow>>({})
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New overlay form
  const [newOverlay, setNewOverlay] = useState({
    name: '',
    nw_lat: '',
    nw_lng: '',
    se_lat: '',
    se_lng: '',
    type: 'zone_map' as OverlayType,
    opacity: 85
  })

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!file.type.startsWith('image/')) {
      setUploadError('Chỉ chấp nhận file ảnh')
      return
    }

    if (!newOverlay.name.trim()) {
      setUploadError('Vui lòng nhập tên overlay trước')
      return
    }

    if (!newOverlay.nw_lat || !newOverlay.nw_lng || !newOverlay.se_lat || !newOverlay.se_lng) {
      setUploadError('Vui lòng nhập đầy đủ tọa độ')
      return
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadProgress('Đang xử lý ảnh...')

    try {
      const baseName = newOverlay.name.replace(/\s+/g, '_')
      const timestamp = Date.now()

      // Resize image to max 2048px for all devices
      setUploadProgress('Đang resize ảnh (max 2048px)...')
      const resizedBlob = await resizeImage(file, MAX_IMAGE_SIZE)
      const fileName = `${baseName}_${timestamp}.png`
      
      setUploadProgress('Đang upload...')
      const { error: uploadErr } = await supabase.storage
        .from('overlays')
        .upload(fileName, resizedBlob, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr

      const { data: urlData } = supabase.storage.from('overlays').getPublicUrl(fileName)
      const publicUrl = urlData.publicUrl

      // Insert into database
      setUploadProgress('Đang lưu vào database...')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase as any)
        .from('overlays')
        .insert({
          name: newOverlay.name.trim(),
          url: publicUrl,
          nw_lat: parseFloat(newOverlay.nw_lat),
          nw_lng: parseFloat(newOverlay.nw_lng),
          se_lat: parseFloat(newOverlay.se_lat),
          se_lng: parseFloat(newOverlay.se_lng),
          type: newOverlay.type,
          opacity: newOverlay.opacity,
          is_visible: true,
          z_index: overlays.length
        })

      if (dbError) throw dbError

      // Reset form
      setNewOverlay({
        name: '',
        nw_lat: '',
        nw_lng: '',
        se_lat: '',
        se_lng: '',
        type: 'zone_map',
        opacity: 85
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      setUploadProgress('')
      
      refetch()
    } catch (err: any) {
      console.error('Upload error:', err)
      setUploadError(err.message || 'Lỗi khi upload')
    } finally {
      setIsUploading(false)
    }
  }, [newOverlay, overlays.length, refetch])

  const handleDelete = useCallback(async (overlay: OverlayRow) => {
    if (!confirm(`Xóa overlay "${overlay.name}"?`)) return

    try {
      // Extract filename from URL
      const urlParts = overlay.url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from storage
      await supabase.storage.from('overlays').remove([fileName])

      // Delete from database
      await supabase.from('overlays').delete().eq('id', overlay.id)

      refetch()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Lỗi khi xóa overlay')
    }
  }, [refetch])

  const handleToggleVisibility = useCallback(async (overlay: OverlayRow) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('overlays')
        .update({ is_visible: !overlay.is_visible })
        .eq('id', overlay.id)
      refetch()
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }, [refetch])

  const handleStartEdit = useCallback((overlay: OverlayRow) => {
    setEditingId(overlay.id)
    setEditForm({
      name: overlay.name,
      url: overlay.url,
      nw_lat: overlay.nw_lat,
      nw_lng: overlay.nw_lng,
      se_lat: overlay.se_lat,
      se_lng: overlay.se_lng,
      opacity: overlay.opacity,
      z_index: overlay.z_index,
      type: overlay.type
    })
  }, [])

  // Handle replacing image for existing overlay
  const handleReplaceImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, overlayId: string, overlayName: string) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    setIsSaving(true)
    try {
      const baseName = (overlayName || overlayId).replace(/\s+/g, '_')
      const timestamp = Date.now()

      // Resize to max 2048px
      const resizedBlob = await resizeImage(file, MAX_IMAGE_SIZE)
      const fileName = `${baseName}_${timestamp}.png`
      
      const { error: uploadErr } = await supabase.storage
        .from('overlays')
        .upload(fileName, resizedBlob, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr

      const { data: urlData } = supabase.storage.from('overlays').getPublicUrl(fileName)
      const publicUrl = urlData.publicUrl

      // Update database
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('overlays')
        .update({ url: publicUrl })
        .eq('id', overlayId)

      // Update edit form if editing this overlay
      if (editingId === overlayId) {
        setEditForm(prev => ({ ...prev, url: publicUrl }))
      }

      refetch()
      alert('Đã thay ảnh thành công! (max 2048px)')
    } catch (err: any) {
      console.error('Replace image error:', err)
      alert('Lỗi khi thay ảnh: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }, [editingId, refetch])

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return
    setIsSaving(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('overlays')
        .update(editForm)
        .eq('id', editingId)
      
      setEditingId(null)
      refetch()
    } catch (err) {
      console.error('Save error:', err)
      alert('Lỗi khi lưu')
    } finally {
      setIsSaving(false)
    }
  }, [editingId, editForm, refetch])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Layers className="w-7 h-7 text-emerald-600" />
          Quản lý Overlay
        </h1>
        <p className="text-stone-500 mt-1">
          Upload và quản lý các lớp ảnh phủ trên bản đồ
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 mb-6">
        <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Thêm Overlay mới
        </h2>

        {uploadError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1 block">Tên overlay *</label>
            <Input
              value={newOverlay.name}
              onChange={(e) => setNewOverlay(prev => ({ ...prev, name: e.target.value }))}
              placeholder="VD: Khu B3, Khu A1..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1 block">Loại</label>
            <select
              value={newOverlay.type}
              onChange={(e) => setNewOverlay(prev => ({ ...prev, type: e.target.value as OverlayType }))}
              className="w-full h-10 px-3 rounded-md border border-stone-200"
            >
              {OVERLAY_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1 block">NW Lat *</label>
            <Input
              type="number"
              step="any"
              value={newOverlay.nw_lat}
              onChange={(e) => setNewOverlay(prev => ({ ...prev, nw_lat: e.target.value }))}
              placeholder="11.xxx"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1 block">NW Lng *</label>
            <Input
              type="number"
              step="any"
              value={newOverlay.nw_lng}
              onChange={(e) => setNewOverlay(prev => ({ ...prev, nw_lng: e.target.value }))}
              placeholder="106.xxx"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1 block">SE Lat *</label>
            <Input
              type="number"
              step="any"
              value={newOverlay.se_lat}
              onChange={(e) => setNewOverlay(prev => ({ ...prev, se_lat: e.target.value }))}
              placeholder="11.xxx"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1 block">SE Lng *</label>
            <Input
              type="number"
              step="any"
              value={newOverlay.se_lng}
              onChange={(e) => setNewOverlay(prev => ({ ...prev, se_lng: e.target.value }))}
              placeholder="106.xxx"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-stone-700 mb-1 block">
              Độ trong suốt: {newOverlay.opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newOverlay.opacity}
              onChange={(e) => setNewOverlay(prev => ({ ...prev, opacity: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isUploading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{uploadProgress || 'Đang upload...'}</>
            ) : (
              <><Upload className="w-4 h-4 mr-2" />Chọn ảnh & Upload (auto-resize 2048px)</>
            )}
          </Button>
          <p className="text-xs text-stone-500">PNG, JPG - Khuyến nghị resolution cao (4000px+)</p>
        </div>
      </div>

      {/* Overlay List */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-900">
            Danh sách Overlay ({overlays.length})
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {overlays.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">Chưa có overlay nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {overlays.map((overlay) => (
              <div
                key={overlay.id}
                className={`p-4 rounded-xl border ${
                  overlay.is_visible ? 'border-stone-200 bg-white' : 'border-stone-100 bg-stone-50'
                }`}
              >
                {editingId === overlay.id ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Tên"
                      />
                      <select
                        value={editForm.type || 'zone_map'}
                        onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as OverlayType }))}
                        className="h-10 px-3 rounded-md border border-stone-200"
                      >
                        {OVERLAY_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Input
                        type="number"
                        step="any"
                        value={editForm.nw_lat || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, nw_lat: parseFloat(e.target.value) }))}
                        placeholder="NW Lat"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={editForm.nw_lng || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, nw_lng: parseFloat(e.target.value) }))}
                        placeholder="NW Lng"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={editForm.se_lat || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, se_lat: parseFloat(e.target.value) }))}
                        placeholder="SE Lat"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={editForm.se_lng || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, se_lng: parseFloat(e.target.value) }))}
                        placeholder="SE Lng"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-stone-500">Opacity: {editForm.opacity}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editForm.opacity || 85}
                          onChange={(e) => setEditForm(prev => ({ ...prev, opacity: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-xs text-stone-500">Z-Index</label>
                        <Input
                          type="number"
                          value={editForm.z_index || 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, z_index: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>
                          {/* Replace Image */}
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                      <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden flex-shrink-0">
                        <img
                          src={editForm.url || overlay.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-700 mb-1">Thay đổi ảnh</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplaceImage(e, overlay.id, overlay.name || '')}
                          className="text-sm text-stone-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        <p className="text-xs text-stone-400 mt-1">Sau khi thay ảnh, refresh trang bản đồ để thấy thay đổi</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" />Lưu</>}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 mr-1" />Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                      <img
                        src={overlay.url}
                        alt={overlay.name || ''}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23f5f5f4" width="80" height="80"/><text x="40" y="45" text-anchor="middle" fill="%23a8a29e" font-size="12">No img</text></svg>'
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-stone-900 truncate">{overlay.name || 'Không tên'}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {OVERLAY_TYPES.find(t => t.value === overlay.type)?.label || overlay.type}
                        </Badge>
                        {!overlay.is_visible && (
                          <Badge variant="outline" className="text-xs text-stone-400">Ẩn</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          NW: {overlay.nw_lat?.toFixed(4)}, {overlay.nw_lng?.toFixed(4)}
                        </span>
                        <span>SE: {overlay.se_lat?.toFixed(4)}, {overlay.se_lng?.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                        <span>Opacity: {overlay.opacity ?? 85}%</span>
                        <span>Z: {overlay.z_index ?? 0}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleVisibility(overlay)}
                        className="h-8 w-8"
                        title={overlay.is_visible ? 'Ẩn' : 'Hiện'}
                      >
                        {overlay.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-stone-400" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(overlay)}
                        className="h-8 w-8"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(overlay)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
