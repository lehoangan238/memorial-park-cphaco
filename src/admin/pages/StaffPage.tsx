/**
 * Staff Management Page - CRUD operations for staff
 */
import { useState } from 'react'
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
  Shield,
  AlertCircle,
  Check
} from 'lucide-react'
import { useStaff } from '../hooks/useAdminData'
import { useToast } from '../components/Toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { StaffRow, StaffInsert, StaffUpdate, StaffRole } from '@/types/database'

export function StaffPage() {
  const { staff, loading, error, addStaff, updateStaff, deleteStaff } = useStaff()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffRow | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Filter staff by search
  const filteredStaff = staff.filter(s =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone?.includes(searchQuery)
  )

  const handleAdd = () => {
    setEditingStaff(null)
    setIsModalOpen(true)
  }

  const handleEdit = (s: StaffRow) => {
    setEditingStaff(s)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteStaff(id)
    if (result.success) {
      showToast('Staff deleted successfully', 'success')
    } else {
      showToast(result.error || 'Failed to delete staff', 'error')
    }
    setDeleteConfirm(null)
  }

  const handleSave = async (data: StaffInsert | StaffUpdate) => {
    if (editingStaff) {
      const result = await updateStaff(editingStaff.id, data as StaffUpdate)
      if (result.success) {
        showToast('Staff updated successfully', 'success')
        setIsModalOpen(false)
      } else {
        showToast(result.error || 'Failed to update staff', 'error')
      }
    } else {
      const result = await addStaff(data as StaffInsert)
      if (result.success) {
        showToast('Staff added successfully', 'success')
        setIsModalOpen(false)
      } else {
        showToast(result.error || 'Failed to add staff', 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage employees and their roles</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No staff found</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{s.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={s.role} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        {s.phone && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="w-3 h-3" />
                            {s.phone}
                          </div>
                        )}
                        {s.email && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="w-3 h-3" />
                            {s.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          s.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {s.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        {deleteConfirm === s.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Check className="w-4 h-4 text-red-600" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(s.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <StaffModal
            staff={editingStaff}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Role badge component
function RoleBadge({ role }: { role: StaffRole }) {
  const colors: Record<StaffRole, string> = {
    Admin: 'bg-purple-100 text-purple-700',
    Security: 'bg-blue-100 text-blue-700',
    Sale: 'bg-green-100 text-green-700'
  }

  const icons: Record<StaffRole, React.ReactNode> = {
    Admin: <Shield className="w-3 h-3" />,
    Security: <Shield className="w-3 h-3" />,
    Sale: <User className="w-3 h-3" />
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`}>
      {icons[role]}
      {role}
    </span>
  )
}

// Staff modal component
function StaffModal({
  staff,
  onClose,
  onSave
}: {
  staff: StaffRow | null
  onClose: () => void
  onSave: (data: StaffInsert | StaffUpdate) => void
}) {
  const [formData, setFormData] = useState({
    full_name: staff?.full_name || '',
    role: staff?.role || 'Sale' as StaffRole,
    phone: staff?.phone || '',
    email: staff?.email || '',
    active: staff?.active ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
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
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {staff ? 'Edit Staff' : 'Add New Staff'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Security">Security</option>
              <option value="Sale">Sale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {staff ? 'Update' : 'Add'} Staff
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
