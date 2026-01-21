/**
 * Settings Page - Configure global app settings
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, MapPin, Building, Key, RefreshCw } from 'lucide-react'
import { useToast } from '../components/Toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Settings {
  mapCenterLat: string
  mapCenterLng: string
  mapZoom: string
  companyName: string
  supabaseUrl: string
  supabaseAnonKey: string
}

const DEFAULT_SETTINGS: Settings = {
  mapCenterLat: '11.0283',
  mapCenterLng: '106.6167',
  mapZoom: '16',
  companyName: 'Hoa Viên Nghĩa Trang Bình Dương',
  supabaseUrl: '',
  supabaseAnonKey: ''
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

      {/* API Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Key className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
            <p className="text-sm text-gray-500">Supabase connection settings (stored in .env)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supabase URL
            </label>
            <Input
              value={settings.supabaseUrl}
              onChange={(e) => setSettings({ ...settings, supabaseUrl: e.target.value })}
              placeholder="https://your-project.supabase.co"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set VITE_SUPABASE_URL in your .env file
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supabase Anon Key
            </label>
            <Input
              type="password"
              value={settings.supabaseAnonKey}
              onChange={(e) => setSettings({ ...settings, supabaseAnonKey: e.target.value })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Set VITE_SUPABASE_ANON_KEY in your .env file
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> API keys should be stored in environment variables (.env file) 
            for security. The values entered here are for reference only.
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
