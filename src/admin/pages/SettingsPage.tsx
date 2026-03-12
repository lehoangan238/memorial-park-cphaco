/**
 * Settings Page - Configure global app settings
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, MapPin, Building, RefreshCw, Info } from 'lucide-react'
import { useToast } from '../components/Toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Settings {
  mapCenterLat: string
  mapCenterLng: string
  mapZoom: string
  companyName: string
}

const DEFAULT_SETTINGS: Settings = {
  mapCenterLat: '11.168266',
  mapCenterLng: '106.651891',
  mapZoom: '17',
  companyName: 'Hoa Viên Nghĩa Trang Bình Dương'
}

export function SettingsPage() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('admin_settings')
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Save to localStorage
    localStorage.setItem('admin_settings', JSON.stringify(settings))
    
    showToast('Settings saved successfully', 'success')
    setIsSaving(false)
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('admin_settings')
    showToast('Settings reset to defaults', 'info')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure application settings</p>
      </div>

      {/* Map Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Map Settings</h2>
            <p className="text-sm text-gray-500">Configure default map center and zoom</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Center Latitude
            </label>
            <Input
              type="number"
              step="0.0001"
              value={settings.mapCenterLat}
              onChange={(e) => setSettings({ ...settings, mapCenterLat: e.target.value })}
              placeholder="11.0283"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Center Longitude
            </label>
            <Input
              type="number"
              step="0.0001"
              value={settings.mapCenterLng}
              onChange={(e) => setSettings({ ...settings, mapCenterLng: e.target.value })}
              placeholder="106.6167"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Zoom
            </label>
            <Input
              type="number"
              min="1"
              max="20"
              value={settings.mapZoom}
              onChange={(e) => setSettings({ ...settings, mapZoom: e.target.value })}
              placeholder="16"
            />
          </div>
        </div>
      </motion.div>

      {/* Company Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Building className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Company Settings</h2>
            <p className="text-sm text-gray-500">Configure company information</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <Input
            value={settings.companyName}
            onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            placeholder="Enter company name"
          />
        </div>
      </motion.div>

      {/* API Info (Read-only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Thông tin kết nối</h2>
            <p className="text-sm text-gray-500">Cấu hình API được quản lý qua file .env</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Supabase Status:</span>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Đã kết nối
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Database:</span>
            <span className="text-sm text-gray-900">PostgreSQL</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Lưu ý:</strong> API keys được cấu hình trong file <code className="bg-blue-100 px-1 rounded">.env</code> để đảm bảo bảo mật. 
            Liên hệ quản trị viên nếu cần thay đổi.
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
