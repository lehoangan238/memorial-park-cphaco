import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, MapPin, Ruler, Tag, FileText, Navigation, ExternalLink, 
  Copy, Check, Edit3, Save, User, Phone, RefreshCw, AlertCircle, 
  Loader2, Shield 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import type { PlotRow, PlotStatusDb } from '@/types/database'
import { cn } from '@/lib/utils'

interface PlotEditDrawerProps {
  plot: PlotRow | null
  onClose: () => void
  onUpdate?: (updatedPlot: PlotRow) => void
  onStartRouting?: (plot: PlotRow) => void
}

const STATUS_OPTIONS: { value: PlotStatusDb; label: string; color: string }[] = [
  { value: 'Trống', label: 'Còn trống', color: '#10B981' },
  { value: 'Đã bán', label: 'Đã bán', color: '#EF4444' },
  { value: 'Đặt cọc', label: 'Đã đặt cọc', color: '#F59E0B' },
  { value: 'Đã an táng', label: 'Đã an táng', color: '#6B7280' },
  { value: 'Khác', label: 'Khác', color: '#9CA3AF' }
]

export function PlotEditDrawer({ plot, onClose, onUpdate, onStartRouting }: PlotEditDrawerProps) {
  const { isAuthenticated } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  
  // Edit form state
  const [editStatus, setEditStatus] = useState<PlotStatusDb>('Trống')
  const [editCustomerName, setEditCustomerName] = useState('')
  const [editNotes, setEditNotes] = useState('')

  // Reset form when plot changes
  useEffect(() => {
    if (plot) {
      setEditStatus(plot.status as PlotStatusDb)
      setEditCustomerName(plot.customer_name || '')
      setEditNotes(plot.notes || '')
      setIsEditing(false)
      setSaveError(null)
    }
  }, [plot])

  const handleCopyCoords = useCallback(() => {
    if (!plot) return
    navigator.clipboard.writeText(`${plot.lat}, ${plot.lng}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [plot])

  const handleNavigate = useCallback(() => {
    if (!plot) return
    // Always use Google Maps for navigation
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${plot.lat},${plot.lng}`, '_blank')
  }, [plot])

  const handleStartEdit = useCallback(() => {
    if (!plot) return
    setEditStatus(plot.status as PlotStatusDb)
    setEditCustomerName(plot.customer_name || '')
    setEditNotes(plot.notes || '')
    setIsEditing(true)
    setSaveError(null)
  }, [plot])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setSaveError(null)
  }, [])

  const handleSave = useCallback(async () => {
    if (!plot) return
    
    setIsSaving(true)
    setSaveError(null)

    try {
      const updates = {
        status: editStatus,
        customer_name: editCustomerName.trim() || null,
        notes: editNotes.trim() || null
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('plots')
        .update(updates)
        .eq('id', plot.id)
        .select()
        .single()

      if (error) {
        setSaveError(error.message)
        return
      }

      setIsEditing(false)
      if (onUpdate && data) {
        onUpdate(data as PlotRow)
      }
    } catch (err) {
      setSaveError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsSaving(false)
    }
  }, [plot, editStatus, editCustomerName, editNotes, onUpdate])

  const handleSyncFromBaseVn = useCallback(() => {
    alert('Tính năng đồng bộ từ Base.vn đang được phát triển.')
  }, [])

  if (!plot) return null

  const statusColor = STATUS_OPTIONS.find(s => s.value === plot.status)?.color || '#9CA3AF'

  return (
    <AnimatePresence>
      {plot && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-stone-800 to-stone-900 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white text-lg">{plot.name || plot.id}</h2>
                    <p className="text-white/60 text-sm">{plot.zone || 'Khu vực chung'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <Badge style={{ backgroundColor: statusColor + '20', color: statusColor, borderColor: statusColor }}>
                  {STATUS_OPTIONS.find(s => s.value === plot.status)?.label || plot.status}
                </Badge>
                {isAuthenticated && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <Shield className="w-3 h-3 mr-1" />Admin
                  </Badge>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Error */}
              {saveError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{saveError}</p>
                </motion.div>
              )}

              {isEditing && isAuthenticated ? (
                /* ===== EDIT MODE ===== */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Status Select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Trạng thái</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setEditStatus(opt.value)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all cursor-pointer",
                            editStatus === opt.value ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-300"
                          )}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.color }} />
                          <span className="text-sm font-medium text-stone-700">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Tên khách hàng</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        value={editCustomerName}
                        onChange={(e) => setEditCustomerName(e.target.value)}
                        placeholder="Nhập tên khách hàng..."
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Ghi chú</label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Nhập ghi chú..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none text-sm"
                    />
                  </div>

                  {/* Save/Cancel */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={handleCancelEdit} className="flex-1 h-11 rounded-xl" disabled={isSaving}>
                      Hủy
                    </Button>
                    <Button onClick={handleSave} className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700" disabled={isSaving}>
                      {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang lưu...</> : <><Save className="w-4 h-4 mr-2" />Lưu thay đổi</>}
                    </Button>
                  </div>

                  {/* Sync Placeholder */}
                  <Button variant="outline" onClick={handleSyncFromBaseVn} className="w-full h-10 rounded-xl border-dashed">
                    <RefreshCw className="w-4 h-4 mr-2" />Đồng bộ từ Base.vn
                  </Button>
                </motion.div>
              ) : (
                /* ===== VIEW MODE ===== */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {plot.area && (
                      <div className="bg-stone-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Ruler className="w-4 h-4 text-stone-400" />
                          <span className="text-xs text-stone-500">Diện tích</span>
                        </div>
                        <p className="font-semibold text-stone-900">{plot.area} m²</p>
                      </div>
                    )}
                    {plot.price && (
                      <div className="bg-amber-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Tag className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-amber-600">Giá</span>
                        </div>
                        <p className="font-semibold text-amber-700">{plot.price.toLocaleString('vi-VN')}đ</p>
                      </div>
                    )}
                  </div>

                  {/* Customer (Admin Only) */}
                  {isAuthenticated && plot.customer_name && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-blue-600 font-medium">Khách hàng</span>
                      </div>
                      <p className="font-medium text-blue-900">{plot.customer_name}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {plot.notes && (
                    <div className="bg-stone-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-stone-400" />
                        <span className="text-xs text-stone-500 font-medium">Ghi chú</span>
                      </div>
                      <p className="text-sm text-stone-700">{plot.notes}</p>
                    </div>
                  )}

                  {/* Coordinates */}
                  <div className="bg-stone-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-stone-500 mb-1">Tọa độ GPS</p>
                        <code className="text-sm font-mono text-stone-700">{plot.lat.toFixed(6)}, {plot.lng.toFixed(6)}</code>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleCopyCoords} className="h-9 w-9">
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Edit Button (Admin Only) */}
                  {isAuthenticated && (
                    <Button variant="outline" onClick={handleStartEdit} className="w-full h-11 rounded-xl border-2 border-dashed border-stone-300">
                      <Edit3 className="w-4 h-4 mr-2" />Chỉnh sửa thông tin
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-5 bg-stone-50 border-t space-y-3">
              {!isAuthenticated && plot.status === 'Trống' ? (
                <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700">
                  <Phone className="w-4 h-4 mr-2" />Liên hệ tư vấn
                </Button>
              ) : (
                <Button onClick={handleNavigate} className="w-full h-12 rounded-xl bg-stone-900 hover:bg-stone-800">
                  <Navigation className="w-4 h-4 mr-2" />Dẫn đường đến đây
                </Button>
              )}
              <Button variant="outline" onClick={() => window.open(`https://www.google.com/maps?q=${plot.lat},${plot.lng}`, '_blank')} className="w-full h-10 rounded-xl">
                <ExternalLink className="w-4 h-4 mr-2" />Mở trên Google Maps
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}