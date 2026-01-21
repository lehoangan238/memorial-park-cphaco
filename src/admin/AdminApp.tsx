/**
 * Admin Dashboard Main App
 * Cemetery Management System - Hoa Vien Digital Map
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar, type AdminPage } from './components/Sidebar'
import { ToastProvider } from './components/Toast'
import { DashboardPage } from './pages/DashboardPage'
import { MapEditorPage } from './pages/MapEditorPage'
import { RoadEditorPage } from './pages/RoadEditorPage'
import { QRGeneratorPage } from './pages/QRGeneratorPage'
import { StaffPage } from './pages/StaffPage'
import { DataPage } from './pages/DataPage'
import { SettingsPage } from './pages/SettingsPage'

export function AdminApp() {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />
      case 'map-editor':
        return <MapEditorPage />
      case 'road-editor':
        return <RoadEditorPage />
      case 'qr-generator':
        return <QRGeneratorPage />
      case 'staff':
        return <StaffPage />
      case 'data':
        return <DataPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar activePage={activePage} onPageChange={setActivePage} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {activePage.replace('-', ' ')}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </header>

          {/* Page Content */}
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {renderPage()}
          </motion.div>
        </main>
      </div>
    </ToastProvider>
  )
}

export default AdminApp
