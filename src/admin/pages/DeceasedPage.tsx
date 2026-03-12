/**
 * Deceased Management Page - Quản lý thông tin người mất
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  User,
  MapPin,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react'
import { useDeceased } from '../hooks/useAdminData'
import { useToast } from '../components/Toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { DeceasedRow, DeceasedInsert, DeceasedUpdate } from '@/types/database'

const ITEMS_PER_PAGE = 10

export function DeceasedPage() {
  const { deceased, loading, error, addDeceased, updateDeceased, deleteDeceased } = useDeceased()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DeceasedRow | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterGender, setFilterGender] = useState<string>('')

  // Filter and search
  const filteredData = useMemo(() => {
    return deceased.filter(d => {
      const matchSearch = 
        d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.plot_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.birth_place?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.death_place?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchGender = !filterGender || d.gender === filterGender
      return matchSearch && matchGender
    })
  }, [deceased, searchQuery, filterGender])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleAdd = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: DeceasedRow) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteDeceased(id)
    if (result.success) {
      showToast('Đã xóa thành công', 'success')
    } else {
      showToast(result.error || 'Lỗi khi xóa', 'error')
    }
    setDeleteConfirm(null)
  }

  const handleSave = async (data: DeceasedInsert | DeceasedUpdate) => {
    if (editingItem) {
      const result = await updateDeceased(editingItem.id, data as DeceasedUpdate)
      if (result.success) {
        showToast('Cập nhật thành công', 'success')
        setIsModalOpen(false)
      } else {
        showToast(result.error || 'Lỗi khi cập nhật', 'error')
      }
    } else {
      const result = await addDeceased(data as DeceasedInsert)
      if (result.success) {
        showToast('Thêm mới thành công', 'success')
        setIsModalOpen(false)
      } else {
        showToast(result.error || 'Lỗi khi thêm', 'error')
      }
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('vi-VN')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Người mất</h1>
          <p className="text-gray-500 mt-1">Thông tin chi tiết người an táng</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm theo tên, mã plot, nơi sinh/mất..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterGender}
            onChange={(e) => { setFilterGender(e.target.value); setCurrentPage(1) }}
            className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-600">
        <span>Tổng: <strong>{deceased.length}</strong></span>
        <span>Hiển thị: <strong>{filteredData.length}</strong></span>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">
            <AlertCircle className="w-5 h-5 inline mr-2" />
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Plot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày mất</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày an táng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tôn giáo</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Không có dữ liệu</p>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.photo_url ? (
                            <img src={item.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{item.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                          <MapPin className="w-3 h-3" />
                          {item.plot_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.gender || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(item.birth_date)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(item.death_date)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(item.burial_date)}</td>
                      <td className="px-4 py-3 text-gray-600">{item.religion || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          {deleteConfirm === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                              >
                                <Check className="w-4 h-4 text-red-600" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(item.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <DeceasedModal
            item={editingItem}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


// Modal component
function DeceasedModal({
  item,
  onClose,
  onSave
}: {
  item: DeceasedRow | null
  onClose: () => void
  onSave: (data: DeceasedInsert | DeceasedUpdate) => void
}) {
  const [formData, setFormData] = useState({
    plot_id: item?.plot_id || '',
    full_name: item?.full_name || '',
    gender: item?.gender || '',
    birth_date: item?.birth_date || '',
    death_date: item?.death_date || '',
    burial_date: item?.burial_date || '',
    birth_place: item?.birth_place || '',
    death_place: item?.death_place || '',
    religion: item?.religion || '',
    photo_url: item?.photo_url || '',
    epitaph: item?.epitaph || '',
    notes: item?.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      birth_date: formData.birth_date || null,
      death_date: formData.death_date || null,
      burial_date: formData.burial_date || null
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {item ? 'Chỉnh sửa thông tin' : 'Thêm người mất mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã Plot *</label>
              <Input
                value={formData.plot_id}
                onChange={(e) => setFormData({ ...formData, plot_id: e.target.value })}
                placeholder="VD: A-001"
                required
                disabled={!!item}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nhập họ tên đầy đủ"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tôn giáo</label>
              <Input
                value={formData.religion}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                placeholder="VD: Phật giáo, Công giáo..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <Input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày mất</label>
              <Input
                type="date"
                value={formData.death_date}
                onChange={(e) => setFormData({ ...formData, death_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày an táng</label>
              <Input
                type="date"
                value={formData.burial_date}
                onChange={(e) => setFormData({ ...formData, burial_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nơi sinh</label>
              <Input
                value={formData.birth_place}
                onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                placeholder="Nhập nơi sinh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nơi mất</label>
              <Input
                value={formData.death_place}
                onChange={(e) => setFormData({ ...formData, death_place: e.target.value })}
                placeholder="Nhập nơi mất"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh</label>
            <Input
              value={formData.photo_url}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bia mộ / Epitaph</label>
            <textarea
              value={formData.epitaph}
              onChange={(e) => setFormData({ ...formData, epitaph: e.target.value })}
              placeholder="Nội dung bia mộ..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú thêm..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              {item ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
