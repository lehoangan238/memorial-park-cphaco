import { useState, useCallback, useRef } from 'react'
import { 
  Upload, Download, FileSpreadsheet, Loader2, CheckCircle, 
  AlertCircle, Database, MapPin, Church, Layers, HardDrive, History
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { AuditLogRow, PlotInsert, SpiritualSiteInsert, OverlayInsert } from '@/types/database'
import { useToast } from '@/admin/components/Toast'
import { logger } from '@/lib/logger'

type DataType = 'plots' | 'spiritual_sites' | 'overlays'

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

function upsertByType(type: DataType, row: Record<string, unknown>) {
  switch (type) {
    case 'plots':
      return supabase.from('plots').upsert(row as unknown as PlotInsert as never, { onConflict: 'id' })
    case 'spiritual_sites':
      return supabase.from('spiritual_sites').upsert(row as unknown as SpiritualSiteInsert as never, { onConflict: 'id' })
    case 'overlays':
      return supabase.from('overlays').upsert(row as unknown as OverlayInsert as never, { onConflict: 'id' })
    default:
      return Promise.resolve({ error: new Error('Unsupported data type') })
  }
}

export function ImportExportPage() {
  const { showToast } = useToast()
  const [isExporting, setIsExporting] = useState<DataType | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [selectedType, setSelectedType] = useState<DataType>('plots')
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([])
  const [showAuditLogs, setShowAuditLogs] = useState(false)
  const [loadingLogs, setLoadingLogs] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Full database backup
  const exportFullBackup = useCallback(async () => {
    setIsBackingUp(true)
    try {
      const tables = ['plots', 'spiritual_sites', 'overlays', 'staff', 'road_nodes', 'road_edges']
      const backup: Record<string, unknown[]> = {}
      
      for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*')
        if (error) {
          logger.warn(`Warning: Could not backup ${table}:`, error.message)
          backup[table] = []
        } else {
          backup[table] = data || []
        }
      }

      const backupData = {
        version: '1.0',
        created_at: new Date().toISOString(),
        tables: backup
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hoavien_backup_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      showToast('Lỗi backup: ' + message, 'error')
    } finally {
      setIsBackingUp(false)
    }
  }, [showToast])

  // Fetch audit logs
  const fetchAuditLogs = useCallback(async () => {
    setLoadingLogs(true)
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) throw error
      setAuditLogs((data as AuditLogRow[]) || [])
      setShowAuditLogs(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      showToast('Lỗi tải audit logs: ' + message, 'error')
    } finally {
      setLoadingLogs(false)
    }
  }, [showToast])

  // Export functions
  const exportToCSV = useCallback(async (type: DataType) => {
    setIsExporting(type)
    try {
      const { data, error } = await supabase.from(type).select('*')
      if (error) throw error
      if (!data || data.length === 0) {
        showToast('Không có dữ liệu để xuất', 'info')
        return
      }

      const headers = Object.keys(data[0])
      const csv = [
        headers.join(','),
        ...data.map((row: Record<string, unknown>) => headers.map(h => {
          const val = row[h]
          if (val === null || val === undefined) return ''
          if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
            return `"${val.replace(/"/g, '""')}"`
          }
          return String(val)
        }).join(','))
      ].join('\n')

      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      showToast('Lỗi xuất dữ liệu: ' + message, 'error')
    } finally {
      setIsExporting(null)
    }
  }, [showToast])

  // Import functions
  const parseCSV = (text: string): Record<string, unknown>[] => {
    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length < 2) return []
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const rows: Record<string, any>[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      
      const row: Record<string, unknown> = {}
      headers.forEach((h, idx) => {
        let val = values[idx] || ''
        val = val.replace(/^"|"$/g, '').replace(/""/g, '"')
        
        // Convert types
        if (val === '') {
          row[h] = null
        } else if (!isNaN(Number(val)) && h !== 'id' && h !== 'name') {
          row[h] = Number(val)
        } else if (val === 'true') {
          row[h] = true
        } else if (val === 'false') {
          row[h] = false
        } else {
          row[h] = val
        }
      })
      rows.push(row)
    }
    return rows
  }

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const text = await file.text()
      const rows = parseCSV(text)
      
      if (rows.length === 0) {
        setImportResult({ success: 0, failed: 0, errors: ['File rỗng hoặc không đúng định dạng'] })
        return
      }

      let success = 0
      let failed = 0
      const errors: string[] = []

      // Remove auto-generated fields
      const cleanRows = rows.map(row => {
        const clean = { ...row }
        delete clean.created_at
        delete clean.updated_at
        return clean
      })

      // Upsert data
      for (const row of cleanRows) {
        try {
          const { error } = await upsertByType(selectedType, row)
          if (error) {
            failed++
            errors.push(`Row ${(row.id as string) || (row.name as string)}: ${error.message}`)
          } else {
            success++
          }
        } catch (err: unknown) {
          failed++
          const message = err instanceof Error ? err.message : 'Unknown error'
          errors.push(`Row ${(row.id as string) || (row.name as string)}: ${message}`)
        }
      }

      setImportResult({ success, failed, errors: errors.slice(0, 10) })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setImportResult({ success: 0, failed: 0, errors: [message] })
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [selectedType])

  const dataTypes: { type: DataType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'plots', label: 'Plots (Mộ phần)', icon: <MapPin className="w-5 h-5" />, color: 'emerald' },
    { type: 'spiritual_sites', label: 'Điểm tâm linh', icon: <Church className="w-5 h-5" />, color: 'amber' },
    { type: 'overlays', label: 'Overlays', icon: <Layers className="w-5 h-5" />, color: 'blue' }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Database className="w-7 h-7 text-blue-600" />
          Import / Export Data
        </h1>
        <p className="text-stone-500 mt-1">Nhập và xuất dữ liệu từ file CSV</p>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-green-600" />
          Xuất dữ liệu (Export)
        </h2>
        <p className="text-sm text-stone-500 mb-4">Tải xuống dữ liệu dưới dạng file CSV</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataTypes.map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => exportToCSV(type)}
              disabled={isExporting !== null}
              className={`p-4 rounded-xl border-2 border-dashed border-${color}-200 hover:border-${color}-400 hover:bg-${color}-50 transition-colors flex flex-col items-center gap-2 disabled:opacity-50`}
            >
              {isExporting === type ? (
                <Loader2 className={`w-8 h-8 text-${color}-600 animate-spin`} />
              ) : (
                <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600`}>
                  {icon}
                </div>
              )}
              <span className="font-medium text-stone-700">{label}</span>
              <span className="text-xs text-stone-400">Xuất CSV</span>
            </button>
          ))}
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Nhập dữ liệu (Import)
        </h2>
        <p className="text-sm text-stone-500 mb-4">Upload file CSV để nhập dữ liệu. Dữ liệu trùng ID sẽ được cập nhật.</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-stone-700 mb-2">Chọn loại dữ liệu:</label>
          <div className="flex gap-2">
            {dataTypes.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            {isImporting ? (
              <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-12 h-12 mx-auto text-stone-400" />
            )}
            <p className="mt-4 text-stone-600 font-medium">
              {isImporting ? 'Đang xử lý...' : 'Click để chọn file CSV'}
            </p>
            <p className="text-sm text-stone-400 mt-1">Hoặc kéo thả file vào đây</p>
          </label>
        </div>

        {/* Import Result */}
        {importResult && (
          <div className={`mt-4 p-4 rounded-xl ${importResult.failed > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {importResult.failed > 0 ? (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              <span className="font-medium">
                Thành công: {importResult.success} | Thất bại: {importResult.failed}
              </span>
            </div>
            {importResult.errors.length > 0 && (
              <div className="text-sm text-stone-600 mt-2">
                <p className="font-medium mb-1">Lỗi:</p>
                <ul className="list-disc list-inside space-y-1">
                  {importResult.errors.map((err, i) => (
                    <li key={i} className="text-red-600">{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Template Info */}
        <div className="mt-6 p-4 bg-stone-50 rounded-xl">
          <h3 className="font-medium text-stone-700 mb-2">Hướng dẫn:</h3>
          <ul className="text-sm text-stone-500 space-y-1">
            <li>• File CSV phải có header ở dòng đầu tiên</li>
            <li>• Xuất dữ liệu hiện có để xem mẫu định dạng</li>
            <li>• Cột <code className="bg-stone-200 px-1 rounded">id</code> dùng để xác định bản ghi (upsert)</li>
            <li>• Các cột <code className="bg-stone-200 px-1 rounded">created_at</code>, <code className="bg-stone-200 px-1 rounded">updated_at</code> sẽ bị bỏ qua</li>
          </ul>
        </div>
      </div>

      {/* Full Backup Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-purple-600" />
          Sao lưu toàn bộ (Full Backup)
        </h2>
        <p className="text-sm text-stone-500 mb-4">
          Tải xuống toàn bộ dữ liệu dưới dạng file JSON. Bao gồm: plots, spiritual_sites, overlays, staff, road_nodes, road_edges.
        </p>
        
        <button
          onClick={exportFullBackup}
          disabled={isBackingUp}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isBackingUp ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isBackingUp ? 'Đang sao lưu...' : 'Tải Full Backup'}
        </button>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          Lịch sử thay đổi (Audit Logs)
        </h2>
        <p className="text-sm text-stone-500 mb-4">
          Xem lịch sử các thay đổi dữ liệu trong hệ thống.
        </p>
        
        <button
          onClick={fetchAuditLogs}
          disabled={loadingLogs}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 mb-4"
        >
          {loadingLogs ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <History className="w-5 h-5" />
          )}
          {loadingLogs ? 'Đang tải...' : 'Xem Audit Logs'}
        </button>

        {showAuditLogs && (
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-stone-600">Thời gian</th>
                    <th className="px-4 py-2 text-left font-medium text-stone-600">Bảng</th>
                    <th className="px-4 py-2 text-left font-medium text-stone-600">Hành động</th>
                    <th className="px-4 py-2 text-left font-medium text-stone-600">Record ID</th>
                    <th className="px-4 py-2 text-left font-medium text-stone-600">User</th>
                    <th className="px-4 py-2 text-left font-medium text-stone-600">Thay đổi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                        Chưa có dữ liệu audit logs
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50">
                        <td className="px-4 py-2 text-stone-600">
                          {new Date(log.created_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-stone-100 rounded text-xs font-medium">
                            {log.table_name}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            log.action === 'INSERT' ? 'bg-green-100 text-green-700' :
                            log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-stone-600 font-mono text-xs">
                          {log.record_id?.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-2 text-stone-600 text-xs">
                          {log.user_email || 'System'}
                        </td>
                        <td className="px-4 py-2 text-stone-500 text-xs">
                          {log.changed_fields?.join(', ') || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
