/**
 * Data Management Page - Plots table view with bulk editing
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Edit2,
  Save,
  X,
  ChevronDown,
  AlertCircle,
  MapPin
} from 'lucide-react'
import { usePlots } from '../hooks/useAdminData'
import { useToast } from '../components/Toast'
import { Input } from '@/components/ui/input'
import type { PlotRow, PlotUpdate, PlotStatusDb } from '@/types/database'

const STATUS_OPTIONS: PlotStatusDb[] = ['Trống', 'Đã bán', 'Đặt cọc', 'Đã an táng', 'Khác']

export function DataPage() {
  const { plots, loading, error, updatePlot } = usePlots()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<PlotStatusDb | 'all'>('all')
  const [editingPlot, setEditingPlot] = useState<string | null>(null)
  const [editData, setEditData] = useState<PlotUpdate>({})
  const [showFilters, setShowFilters] = useState(false)

  // Filter plots
  const filteredPlots = useMemo(() => {
    return plots.filter(p => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.zone?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [plots, searchQuery, statusFilter])

  const handleEdit = (plot: PlotRow) => {
    setEditingPlot(plot.name)
    setEditData({
      status: plot.status,
      customer_name: plot.customer_name,
      price: plot.price,
      notes: plot.notes
    })
  }

  const handleSave = async () => {
    if (!editingPlot) return
    
    const result = await updatePlot(editingPlot, editData)
    if (result.success) {
      showToast('Plot updated successfully', 'success')
      setEditingPlot(null)
      setEditData({})
    } else {
      showToast(result.error || 'Failed to update plot', 'error')
    }
  }

  const handleCancel = () => {
    setEditingPlot(null)
    setEditData({})
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return '-'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
        <p className="text-gray-500 mt-1">View and edit plot information</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, customer, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                statusFilter !== 'all'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 bg-white rounded-lg border border-gray-200 shadow-lg z-10 min-w-[160px]"
                >
                  <button
                    onClick={() => { setStatusFilter('all'); setShowFilters(false) }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer ${
                      statusFilter === 'all' ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    All Status
                  </button>
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setShowFilters(false) }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer ${
                        statusFilter === status ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-gray-500">
          Showing <span className="font-medium text-gray-900">{filteredPlots.length}</span> of{' '}
          <span className="font-medium text-gray-900">{plots.length}</span> plots
        </span>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plot
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPlots.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No plots found</p>
                    </td>
                  </tr>
                ) : (
                  filteredPlots.map((plot) => (
                    <tr key={plot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{plot.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {plot.zone || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {editingPlot === plot.name ? (
                          <select
                            value={editData.status || plot.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value as PlotStatusDb })}
                            className="w-full h-8 px-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={plot.status} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingPlot === plot.name ? (
                          <Input
                            value={editData.customer_name || ''}
                            onChange={(e) => setEditData({ ...editData, customer_name: e.target.value })}
                            placeholder="Customer name"
                            className="h-8 text-sm"
                          />
                        ) : (
                          <span className="text-sm text-gray-600">
                            {plot.customer_name || '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingPlot === plot.name ? (
                          <Input
                            type="number"
                            value={editData.price || ''}
                            onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) || null })}
                            placeholder="Price"
                            className="h-8 text-sm w-32"
                          />
                        ) : (
                          <span className="text-sm text-gray-600">
                            {formatCurrency(plot.price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {plot.lat && plot.lng ? (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            Set
                          </span>
                        ) : (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                            Not set
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editingPlot === plot.name ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={handleSave}
                              className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Save className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(plot)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// Status badge component
function StatusBadge({ status }: { status: PlotStatusDb }) {
  const colors: Record<PlotStatusDb, string> = {
    'Đã bán': 'bg-red-100 text-red-700',
    'Đã an táng': 'bg-red-100 text-red-700',
    'Đặt cọc': 'bg-orange-100 text-orange-700',
    'Trống': 'bg-green-100 text-green-700',
    'Khác': 'bg-gray-100 text-gray-700'
  }

  return (
    <span className={`inline-block text-xs px-2 py-1 rounded font-medium ${colors[status] || colors['Khác']}`}>
      {status}
    </span>
  )
}
