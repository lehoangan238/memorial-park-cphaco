import { useState, useCallback, useEffect } from 'react'
import { 
  Plus, Trash2, Edit3, Save, X, Church, Search,
  Loader2, Download, Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import type { SpiritualSiteRow, SpiritualSiteInsert, SpiritualSiteUpdate } from '@/types/database'

const SITE_TYPES = ['Chùa', 'Miếu', 'Đền', 'Nhà thờ', 'Tượng', 'Khác']

export function SpiritualSitesPage() {
  const [sites, setSites] = useState<SpiritualSiteRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<SpiritualSiteRow>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSite, setNewSite] = useState({
    name: '', type: 'Chùa', lat: '', lng: '', image_url: ''
  })

  const fetchSites = useCallback(async () => {
    setIsLoading(true)
    const { data } = await supabase.from('spiritual_sites').select('*').order('name')
    setSites(data || [])
    setIsLoading(false)
  }, [])

  useEffect(() => { fetchSites() }, [fetchSites])

  const filteredSites = sites.filter(site =>
    searchTerm === '' ||
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = useCallback(async () => {
    if (!newSite.name || !newSite.lat || !newSite.lng) {
      alert('Vui lòng nhập tên, Lat và Lng')
      return
    }
    setIsSaving(true)
    try {
      const insertData: SpiritualSiteInsert = {
        name: newSite.name.trim(),
        type: newSite.type || null,
        lat: parseFloat(newSite.lat),
        lng: parseFloat(newSite.lng),
        image_url: newSite.image_url.trim() || null
      }
      const { error } = await supabase.from('spiritual_sites').insert(insertData as any)
      if (error) throw error
      setNewSite({ name: '', type: 'Chùa', lat: '', lng: '', image_url: '' })
      setShowAddForm(false)
      fetchSites()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }, [newSite, fetchSites])

  const handleDelete = useCallback(async (site: SpiritualSiteRow) => {
    if (!confirm(`Xóa "${site.name}"?`)) return
    await supabase.from('spiritual_sites').delete().eq('id', site.id)
    fetchSites()
  }, [fetchSites])

  const handleStartEdit = useCallback((site: SpiritualSiteRow) => {
    setEditingId(site.id)
    setEditForm({ ...site })
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return
    setIsSaving(true)
    try {
      const updateData: SpiritualSiteUpdate = {
        name: editForm.name,
        type: editForm.type,
        lat: editForm.lat,
        lng: editForm.lng,
        image_url: editForm.image_url
      }
      // @ts-ignore - Supabase types issue
      const { error } = await supabase.from('spiritual_sites').update(updateData).eq('id', editingId)
      if (error) throw error
      setEditingId(null)
      fetchSites()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }, [editingId, editForm, fetchSites])

  const handleExport = useCallback(() => {
    const csv = [
      ['ID', 'Tên', 'Loại', 'Lat', 'Lng', 'Hình ảnh'].join(','),
      ...filteredSites.map(s => [s.id, s.name, s.type || '', s.lat, s.lng, s.image_url || ''].map(v => `"${v}"`).join(','))
    ].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spiritual_sites_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }, [filteredSites])

  if (isLoading) {
    return <div className="p-6 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Church className="w-7 h-7 text-amber-600" />
          Quản lý Điểm Tâm Linh
        </h1>
        <p className="text-stone-500 mt-1">Chùa, miếu, đền và các điểm tâm linh</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 border border-stone-200">
          <p className="text-2xl font-bold text-stone-900">{sites.length}</p>
          <p className="text-xs text-stone-500">Tổng cộng</p>
        </div>
        {SITE_TYPES.slice(0, 3).map(type => (
          <div key={type} className="bg-white rounded-xl p-3 border border-stone-200">
            <p className="text-xl font-bold text-stone-900">{sites.filter(s => s.type === type).length}</p>
            <p className="text-xs text-stone-500">{type}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo tên, loại..." className="pl-10" />
          </div>
        </div>
        <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
        <Button onClick={() => setShowAddForm(true)} className="bg-amber-600 hover:bg-amber-700"><Plus className="w-4 h-4 mr-2" />Thêm mới</Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-3">Thêm điểm tâm linh mới</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
            <Input value={newSite.name} onChange={(e) => setNewSite(p => ({...p, name: e.target.value}))} placeholder="Tên *" />
            <select value={newSite.type} onChange={(e) => setNewSite(p => ({...p, type: e.target.value}))} className="h-10 px-3 rounded-md border border-stone-200">
              {SITE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Input type="number" step="any" value={newSite.lat} onChange={(e) => setNewSite(p => ({...p, lat: e.target.value}))} placeholder="Lat *" />
            <Input type="number" step="any" value={newSite.lng} onChange={(e) => setNewSite(p => ({...p, lng: e.target.value}))} placeholder="Lng *" />
            <Input value={newSite.image_url} onChange={(e) => setNewSite(p => ({...p, image_url: e.target.value}))} placeholder="URL hình ảnh" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Thêm'}
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Hủy</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600">Tên</th>
              <th className="text-left p-3 font-medium text-stone-600">Loại</th>
              <th className="text-left p-3 font-medium text-stone-600">Tọa độ</th>
              <th className="text-left p-3 font-medium text-stone-600">Hình ảnh</th>
              <th className="text-right p-3 font-medium text-stone-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredSites.map(site => (
              <tr key={site.id} className="border-b border-stone-100 hover:bg-stone-50">
                {editingId === site.id ? (
                  <>
                    <td className="p-2"><Input value={editForm.name || ''} onChange={(e) => setEditForm(p => ({...p, name: e.target.value}))} className="h-8 text-xs" /></td>
                    <td className="p-2">
                      <select value={editForm.type || ''} onChange={(e) => setEditForm(p => ({...p, type: e.target.value}))} className="h-8 px-2 text-xs rounded border">
                        {SITE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Input type="number" step="any" value={editForm.lat || ''} onChange={(e) => setEditForm(p => ({...p, lat: parseFloat(e.target.value)}))} className="h-8 text-xs w-24" placeholder="Lat" />
                        <Input type="number" step="any" value={editForm.lng || ''} onChange={(e) => setEditForm(p => ({...p, lng: parseFloat(e.target.value)}))} className="h-8 text-xs w-24" placeholder="Lng" />
                      </div>
                    </td>
                    <td className="p-2"><Input value={editForm.image_url || ''} onChange={(e) => setEditForm(p => ({...p, image_url: e.target.value}))} className="h-8 text-xs" /></td>
                    <td className="p-2 text-right">
                      <Button size="sm" variant="ghost" onClick={handleSaveEdit} disabled={isSaving}><Save className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 font-medium">{site.name}</td>
                    <td className="p-3 text-stone-500">{site.type || '-'}</td>
                    <td className="p-3 font-mono text-xs">{site.lat?.toFixed(6) ?? '-'}, {site.lng?.toFixed(6) ?? '-'}</td>
                    <td className="p-3">
                      {site.image_url ? (
                        <a href={site.image_url} target="_blank" rel="noopener" className="text-blue-600 hover:underline flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" /> Xem
                        </a>
                      ) : '-'}
                    </td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => handleStartEdit(site)}><Edit3 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(site)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSites.length === 0 && (
          <div className="p-8 text-center text-stone-500">Chưa có dữ liệu</div>
        )}
      </div>
    </div>
  )
}
