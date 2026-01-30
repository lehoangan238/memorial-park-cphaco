import { useState, useCallback, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { 
  Plus, Trash2, Edit3, Save, X, MapPin, Search,
  Loader2, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useMapData } from '@/hooks/useMapData'
import type { PlotRow, PlotStatusDb, PlotInsert, PlotUpdate } from '@/types/database'

const PLOT_STATUSES: { value: PlotStatusDb; label: string; color: string }[] = [
  { value: 'Trống', label: 'Trống', color: 'bg-emerald-500' },
  { value: 'Đã bán', label: 'Đã bán', color: 'bg-red-500' },
  { value: 'Đặt cọc', label: 'Đặt cọc', color: 'bg-amber-500' },
  { value: 'Đã an táng', label: 'Đã an táng', color: 'bg-stone-500' },
  { value: 'Khác', label: 'Khác', color: 'bg-blue-500' }
]

export function PlotManagerPage() {
  const { plots, refetch, isLoading } = useMapData()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<PlotRow>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlot, setNewPlot] = useState({
    id: '', name: '', zone: '', lat: '', lng: '',
    status: 'Trống' as PlotStatusDb, price: '', area: '', customer_name: '', notes: ''
  })

  // Filter by status
  const filteredData = useMemo(() => {
    if (filterStatus === 'all') return plots
    return plots.filter(p => p.status === filterStatus)
  }, [plots, filterStatus])

  // Stats
  const stats = useMemo(() => {
    const total = plots.length
    const byStatus = PLOT_STATUSES.map(s => ({
      ...s,
      count: plots.filter(p => p.status === s.value).length
    }))
    return { total, byStatus }
  }, [plots])

  // Table columns
  const columns = useMemo<ColumnDef<PlotRow>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()} className="h-8 px-2 -ml-2">
          ID
          {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> :
           column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-3 w-3" /> :
           <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()} className="h-8 px-2 -ml-2">
          Tên
          {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> :
           column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-3 w-3" /> :
           <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}
        </Button>
      ),
      cell: ({ row }) => row.getValue('name') || '-',
    },
    {
      accessorKey: 'zone',
      header: 'Khu vực',
      cell: ({ row }) => <span className="text-stone-500">{row.getValue('zone') || '-'}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.getValue('status') as PlotStatusDb
        const statusInfo = PLOT_STATUSES.find(s => s.value === status)
        return (
          <Badge className={`${statusInfo?.color} text-white text-xs`}>
            {status}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value === 'all' || row.getValue(id) === value,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()} className="h-8 px-2 -ml-2">
          Giá
          {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> :
           column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-3 w-3" /> :
           <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}
        </Button>
      ),
      cell: ({ row }) => {
        const price = row.getValue('price') as number | null
        return price ? `${price.toLocaleString('vi-VN')}đ` : '-'
      },
    },
    {
      accessorKey: 'customer_name',
      header: 'Khách hàng',
      cell: ({ row }) => row.getValue('customer_name') || '-',
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Thao tác</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleStartEdit(row.original)} className="h-8 w-8 p-0">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(row.original)} className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ], [])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  const handleAdd = useCallback(async () => {
    if (!newPlot.id || !newPlot.lat || !newPlot.lng) {
      alert('Vui lòng nhập ID, Lat và Lng')
      return
    }
    setIsSaving(true)
    try {
      const insertData: PlotInsert = {
        id: newPlot.id.trim(),
        name: newPlot.name.trim() || null,
        zone: newPlot.zone.trim() || null,
        lat: parseFloat(newPlot.lat),
        lng: parseFloat(newPlot.lng),
        status: newPlot.status,
        price: newPlot.price ? parseFloat(newPlot.price) : null,
        area: newPlot.area ? parseFloat(newPlot.area) : null,
        customer_name: newPlot.customer_name.trim() || null,
        notes: newPlot.notes.trim() || null
      }
      const { error } = await supabase.from('plots').insert(insertData as any)
      if (error) throw error
      setNewPlot({ id: '', name: '', zone: '', lat: '', lng: '', status: 'Trống', price: '', area: '', customer_name: '', notes: '' })
      setShowAddForm(false)
      refetch()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }, [newPlot, refetch])

  const handleDelete = useCallback(async (plot: PlotRow) => {
    if (!confirm(`Xóa plot "${plot.id}"?`)) return
    try {
      await supabase.from('plots').delete().eq('id', plot.id)
      refetch()
    } catch {
      alert('Lỗi khi xóa')
    }
  }, [refetch])

  const handleStartEdit = useCallback((plot: PlotRow) => {
    setEditingId(plot.id)
    setEditForm({ ...plot })
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return
    setIsSaving(true)
    try {
      const updateData: PlotUpdate = {
        name: editForm.name,
        zone: editForm.zone,
        lat: editForm.lat,
        lng: editForm.lng,
        status: editForm.status,
        price: editForm.price,
        area: editForm.area,
        customer_name: editForm.customer_name,
        notes: editForm.notes
      }
      // @ts-ignore - Supabase types issue
      const { error } = await supabase.from('plots').update(updateData).eq('id', editingId)
      if (error) throw error
      setEditingId(null)
      refetch()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }, [editingId, editForm, refetch])

  const handleExport = useCallback(() => {
    const data = table.getFilteredRowModel().rows.map(r => r.original)
    const csv = [
      ['ID', 'Tên', 'Khu vực', 'Lat', 'Lng', 'Trạng thái', 'Giá', 'Diện tích', 'Khách hàng', 'Ghi chú'].join(','),
      ...data.map(p => [
        p.id, p.name || '', p.zone || '', p.lat, p.lng, p.status,
        p.price || '', p.area || '', p.customer_name || '', p.notes || ''
      ].map(v => `"${v}"`).join(','))
    ].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plots_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }, [table])

  if (isLoading) {
    return <div className="p-6 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-emerald-600" />
          Quản lý Plot
        </h1>
        <p className="text-stone-500 mt-1">Quản lý các vị trí mộ phần</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 border border-stone-200">
          <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
          <p className="text-xs text-stone-500">Tổng cộng</p>
        </div>
        {stats.byStatus.map(s => (
          <div key={s.value} className="bg-white rounded-xl p-3 border border-stone-200 cursor-pointer hover:border-stone-300" onClick={() => setFilterStatus(filterStatus === s.value ? 'all' : s.value)}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <p className="text-xl font-bold text-stone-900">{s.count}</p>
            </div>
            <p className="text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Tìm theo ID, tên, khu vực, khách hàng..."
              className="pl-10"
            />
          </div>
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-3 rounded-md border border-stone-200">
          <option value="all">Tất cả trạng thái</option>
          {PLOT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
        <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4 mr-2" />Thêm Plot</Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-200">
          <h3 className="font-semibold text-emerald-900 mb-3">Thêm Plot mới</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
            <Input value={newPlot.id} onChange={(e) => setNewPlot(p => ({...p, id: e.target.value}))} placeholder="ID *" />
            <Input value={newPlot.name} onChange={(e) => setNewPlot(p => ({...p, name: e.target.value}))} placeholder="Tên" />
            <Input value={newPlot.zone} onChange={(e) => setNewPlot(p => ({...p, zone: e.target.value}))} placeholder="Khu vực" />
            <Input type="number" step="any" value={newPlot.lat} onChange={(e) => setNewPlot(p => ({...p, lat: e.target.value}))} placeholder="Lat *" />
            <Input type="number" step="any" value={newPlot.lng} onChange={(e) => setNewPlot(p => ({...p, lng: e.target.value}))} placeholder="Lng *" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
            <select value={newPlot.status} onChange={(e) => setNewPlot(p => ({...p, status: e.target.value as PlotStatusDb}))} className="h-10 px-3 rounded-md border border-stone-200">
              {PLOT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <Input type="number" value={newPlot.price} onChange={(e) => setNewPlot(p => ({...p, price: e.target.value}))} placeholder="Giá (VNĐ)" />
            <Input type="number" value={newPlot.area} onChange={(e) => setNewPlot(p => ({...p, area: e.target.value}))} placeholder="Diện tích (m²)" />
            <Input value={newPlot.customer_name} onChange={(e) => setNewPlot(p => ({...p, customer_name: e.target.value}))} placeholder="Tên khách hàng" />
            <Input value={newPlot.notes} onChange={(e) => setNewPlot(p => ({...p, notes: e.target.value}))} placeholder="Ghi chú" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Thêm'}
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Hủy</Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Chỉnh sửa Plot: {editingId}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-sm text-stone-500">Tên</label><Input value={editForm.name || ''} onChange={(e) => setEditForm(p => ({...p, name: e.target.value}))} /></div>
              <div><label className="text-sm text-stone-500">Khu vực</label><Input value={editForm.zone || ''} onChange={(e) => setEditForm(p => ({...p, zone: e.target.value}))} /></div>
              <div><label className="text-sm text-stone-500">Lat</label><Input type="number" step="any" value={editForm.lat || ''} onChange={(e) => setEditForm(p => ({...p, lat: parseFloat(e.target.value)}))} /></div>
              <div><label className="text-sm text-stone-500">Lng</label><Input type="number" step="any" value={editForm.lng || ''} onChange={(e) => setEditForm(p => ({...p, lng: parseFloat(e.target.value)}))} /></div>
              <div><label className="text-sm text-stone-500">Trạng thái</label>
                <select value={editForm.status} onChange={(e) => setEditForm(p => ({...p, status: e.target.value as PlotStatusDb}))} className="w-full h-10 px-3 rounded-md border border-stone-200">
                  {PLOT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div><label className="text-sm text-stone-500">Giá</label><Input type="number" value={editForm.price || ''} onChange={(e) => setEditForm(p => ({...p, price: parseFloat(e.target.value) || null}))} /></div>
              <div><label className="text-sm text-stone-500">Diện tích (m²)</label><Input type="number" value={editForm.area || ''} onChange={(e) => setEditForm(p => ({...p, area: parseFloat(e.target.value) || null}))} /></div>
              <div><label className="text-sm text-stone-500">Khách hàng</label><Input value={editForm.customer_name || ''} onChange={(e) => setEditForm(p => ({...p, customer_name: e.target.value}))} /></div>
            </div>
            <div className="mb-4"><label className="text-sm text-stone-500">Ghi chú</label><Input value={editForm.notes || ''} onChange={(e) => setEditForm(p => ({...p, notes: e.target.value}))} /></div>
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
                <tr><td colSpan={columns.length} className="p-8 text-center text-stone-500">Không có dữ liệu</td></tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
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
            Hiển thị {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} / {table.getFilteredRowModel().rows.length} kết quả
          </div>
          <div className="flex items-center gap-2">
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="h-8 px-2 rounded border border-stone-200 text-sm"
            >
              {[10, 20, 50, 100].map(size => (
                <option key={size} value={size}>{size} / trang</option>
              ))}
            </select>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="h-8 w-8 p-0">
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="flex items-center px-2 text-sm">
                Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-8 w-8 p-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="h-8 w-8 p-0">
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
