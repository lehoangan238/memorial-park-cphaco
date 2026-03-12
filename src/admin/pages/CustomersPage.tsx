/**
 * Customers Management Page - Quản lý khách hàng / người đứng hợp đồng
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
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  DollarSign,
  CreditCard
} from 'lucide-react'
import { useCustomers } from '../hooks/useAdminData'
import { useToast } from '../components/Toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { CustomerRow, CustomerInsert, CustomerUpdate, PaymentStatus } from '@/types/database'

const ITEMS_PER_PAGE = 10

export function CustomersPage() {
  const { customers, loading, error, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CustomerRow | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<string>('')

  // Filter and search
  const filteredData = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = 
        c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.plot_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery) ||
        c.contract_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = !filterStatus || c.payment_status === filterStatus
      return matchSearch && matchStatus
    })
  }, [customers, searchQuery, filterStatus])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Stats
  const stats = useMemo(() => {
    const total = customers.reduce((sum, c) => sum + (c.total_amount || 0), 0)
    const paid = customers.reduce((sum, c) => sum + (c.paid_amount || 0), 0)
    return { total, paid, remaining: total - paid }
  }, [customers])

  const handleAdd = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: CustomerRow) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteCustomer(id)
    if (result.success) {
      showToast('Đã xóa thành công', 'success')
    } else {
      showToast(result.error || 'Lỗi khi xóa', 'error')
    }
    setDeleteConfirm(null)
  }

  const handleSave = async (data: CustomerInsert | CustomerUpdate) => {
    if (editingItem) {
      const result = await updateCustomer(editingItem.id, data as CustomerUpdate)
      if (result.success) {
        showToast('Cập nhật thành công', 'success')
        setIsModalOpen(false)
      } else {
        showToast(result.error || 'Lỗi khi cập nhật', 'error')
      }
    } else {
      const result = await addCustomer(data as CustomerInsert)
      if (result.success) {
        showToast('Thêm mới thành công', 'success')
        setIsModalOpen(false)
      } else {
        showToast(result.error || 'Lỗi khi thêm', 'error')
      }
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Khách hàng</h1>
          <p className="text-gray-500 mt-1">Thông tin hợp đồng và thanh toán</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng giá trị HĐ</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.total)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã thanh toán</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(stats.paid)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Còn nợ</p>
              <p className="text-lg font-semibold text-orange-600">{formatCurrency(stats.remaining)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm theo tên, SĐT, mã plot, số HĐ..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
            className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="partial">Thanh toán một phần</option>
            <option value="paid">Đã thanh toán</option>
          </select>
        </div>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Plot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hợp đồng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đã trả</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
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
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.full_name}</p>
                            {item.is_primary && (
                              <span className="text-xs text-blue-600">Chính</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                          <MapPin className="w-3 h-3" />
                          {item.plot_id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-sm">
                          {item.phone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-3 h-3" />
                              {item.phone}
                            </div>
                          )}
                          {item.email && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="w-3 h-3" />
                              {item.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {item.contract_number && (
                            <div className="flex items-center gap-1 text-gray-900">
                              <FileText className="w-3 h-3" />
                              {item.contract_number}
                            </div>
                          )}
                          <p className="text-gray-500">{formatDate(item.contract_date)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(item.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-green-600">
                        {formatCurrency(item.paid_amount)}
                      </td>
                      <td className="px-4 py-3">
                        <PaymentStatusBadge status={item.payment_status} />
                      </td>
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
          <CustomerModal
            item={editingItem}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Payment status badge
function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config: Record<PaymentStatus, { label: string; className: string }> = {
    pending: { label: 'Chờ TT', className: 'bg-yellow-100 text-yellow-700' },
    partial: { label: 'Một phần', className: 'bg-orange-100 text-orange-700' },
    paid: { label: 'Đã TT', className: 'bg-green-100 text-green-700' }
  }
  const { label, className } = config[status] || config.pending
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}


// Customer Modal
function CustomerModal({
  item,
  onClose,
  onSave
}: {
  item: CustomerRow | null
  onClose: () => void
  onSave: (data: CustomerInsert | CustomerUpdate) => void
}) {
  const [formData, setFormData] = useState({
    plot_id: item?.plot_id || '',
    full_name: item?.full_name || '',
    phone: item?.phone || '',
    phone_2: item?.phone_2 || '',
    email: item?.email || '',
    address: item?.address || '',
    city: item?.city || '',
    id_number: item?.id_number || '',
    id_issued_date: item?.id_issued_date || '',
    id_issued_place: item?.id_issued_place || '',
    relationship: item?.relationship || '',
    contract_number: item?.contract_number || '',
    contract_date: item?.contract_date || '',
    contract_type: item?.contract_type || '',
    total_amount: item?.total_amount?.toString() || '',
    paid_amount: item?.paid_amount?.toString() || '',
    payment_status: item?.payment_status || 'pending' as PaymentStatus,
    notes: item?.notes || '',
    is_primary: item?.is_primary ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      total_amount: formData.total_amount ? parseFloat(formData.total_amount) : null,
      paid_amount: formData.paid_amount ? parseFloat(formData.paid_amount) : null,
      id_issued_date: formData.id_issued_date || null,
      contract_date: formData.contract_date || null
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
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {item ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Thông tin cơ bản
            </h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SĐT phụ</label>
                <Input
                  value={formData.phone_2}
                  onChange={(e) => setFormData({ ...formData, phone_2: e.target.value })}
                  placeholder="Số điện thoại phụ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quan hệ với người mất</label>
                <Input
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="VD: Con, Cháu, Vợ/Chồng..."
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Địa chỉ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Số nhà, đường, phường/xã..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="VD: TP. Hồ Chí Minh"
                />
              </div>
            </div>
          </div>

          {/* ID Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Thông tin CMND/CCCD
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số CMND/CCCD</label>
                <Input
                  value={formData.id_number}
                  onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                  placeholder="012345678901"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cấp</label>
                <Input
                  type="date"
                  value={formData.id_issued_date}
                  onChange={(e) => setFormData({ ...formData, id_issued_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nơi cấp</label>
                <Input
                  value={formData.id_issued_place}
                  onChange={(e) => setFormData({ ...formData, id_issued_place: e.target.value })}
                  placeholder="VD: CA TP.HCM"
                />
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Thông tin hợp đồng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số hợp đồng</label>
                <Input
                  value={formData.contract_number}
                  onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                  placeholder="HD-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ký</label>
                <Input
                  type="date"
                  value={formData.contract_date}
                  onChange={(e) => setFormData({ ...formData, contract_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại hợp đồng</label>
                <Input
                  value={formData.contract_type}
                  onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                  placeholder="VD: Mua mới, Gia hạn..."
                />
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền (VNĐ)</label>
                <Input
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đã thanh toán (VNĐ)</label>
                <Input
                  type="number"
                  value={formData.paid_amount}
                  onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as PaymentStatus })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Chờ thanh toán</option>
                  <option value="partial">Thanh toán một phần</option>
                  <option value="paid">Đã thanh toán đủ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes & Primary */}
          <div className="space-y-4">
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_primary"
                checked={formData.is_primary}
                onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_primary" className="text-sm text-gray-700">
                Người liên hệ chính
              </label>
            </div>
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
