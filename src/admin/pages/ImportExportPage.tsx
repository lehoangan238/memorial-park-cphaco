import { useState, useCallback, useRef } from 'react'
import { 
  Upload, Download, FileSpreadsheet, Loader2, CheckCircle, 
  AlertCircle, Database, MapPin, Church, Layers
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type DataType = 'plots' | 'spiritual_sites' | 'overlays'

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export function ImportExportPage() {
  const [isExporting, setIsExporting] = useState<DataType | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [selectedType, setSelectedType] = useState<DataType>('plots')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Export functions
  const exportToCSV = useCallback(async (type: DataType) => {
    setIsExporting(type)
    try {
      const { data, error } = await supabase.from(type).select('*')
      if (error) throw error
      if (!data || data.length === 0) {
        alert('Không có dữ liệu để xuất')
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
    } catch (err: any) {
      alert('Lỗi xuất dữ liệu: ' + err.message)
    } finally {
      setIsExporting(null)
    }
  }, [])

  // Import functions
  const parseCSV = (text: string): Record<string, any>[] => {
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
      
      const row: Record<string, any> = {}
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
          const { error } = await supabase.from(selectedType).upsert(row as any, { onConflict: 'id' })
          if (error) {
            failed++
            errors.push(`Row ${row.id || row.name}: ${error.message}`)
          } else {
            success++
          }
        } catch (err: any) {
          failed++
          errors.push(`Row ${row.id || row.name}: ${err.message}`)
        }
      }

      setImportResult({ success, failed, errors: errors.slice(0, 10) })
    } catch (err: any) {
      setImportResult({ success: 0, failed: 0, errors: [err.message] })
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
    </div>
  )
}
