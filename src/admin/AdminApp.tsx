/**
 * Admin Dashboard Main App
 * Cemetery Management System - Hoa Vien Digital Map
 */
import { useState, useCallback, useEffect } from 'react'
import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Sidebar, type AdminPage } from './components/Sidebar'
import { ToastProvider, useToast } from './components/Toast'
import { GlobalSearch } from './components/GlobalSearch'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { LoginPage } from '@/pages/LoginPage'

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })))
const MapEditorPage = lazy(() => import('./pages/MapEditorPage').then(module => ({ default: module.MapEditorPage })))
const RoadEditorPage = lazy(() => import('./pages/RoadEditorPage').then(module => ({ default: module.RoadEditorPage })))
const QRGeneratorPage = lazy(() => import('./pages/QRGeneratorPage').then(module => ({ default: module.QRGeneratorPage })))
const OverlayManagerPage = lazy(() => import('./pages/OverlayManagerPage').then(module => ({ default: module.OverlayManagerPage })))
const PlotManagerPage = lazy(() => import('./pages/PlotManagerPage').then(module => ({ default: module.PlotManagerPage })))
const SpiritualSitesPage = lazy(() => import('./pages/SpiritualSitesPage').then(module => ({ default: module.SpiritualSitesPage })))
const ImportExportPage = lazy(() => import('./pages/ImportExportPage').then(module => ({ default: module.ImportExportPage })))
const StaffPage = lazy(() => import('./pages/StaffPage').then(module => ({ default: module.StaffPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })))
const DrawingEditorPage = lazy(() => import('./pages/DrawingEditorPage').then(module => ({ default: module.DrawingEditorPage })))
const DeceasedPage = lazy(() => import('./pages/DeceasedPage').then(module => ({ default: module.DeceasedPage })))
const CustomersPage = lazy(() => import('./pages/CustomersPage').then(module => ({ default: module.CustomersPage })))

// Admin content component (requires authentication)
function AdminContent() {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard')
  const { signOut, user, userRole, hasPermission } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    document.title = 'Bản Đồ Số  - Hoa Viên Bình Dương | Admin'
  }, [])

  const handleLogout = useCallback(async () => {
    await signOut()
    window.location.href = '/'
  }, [signOut])

  // Check permission before changing page
  const handlePageChange = useCallback((page: AdminPage) => {
    if (hasPermission(page)) {
      setActivePage(page)
    } else {
      showToast('Bạn không có quyền truy cập trang này', 'error')
    }
  }, [hasPermission, showToast])

  // Handle search result navigation
  const handleSearchNavigate = useCallback((page: string) => {
    if (hasPermission(page)) {
      setActivePage(page as AdminPage)
    }
  }, [hasPermission])

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
      case 'overlay-manager':
        return <OverlayManagerPage />
      case 'plot-manager':
        return <PlotManagerPage />
      case 'spiritual-sites':
        return <SpiritualSitesPage />
      case 'import-export':
        return <ImportExportPage />
      case 'staff':
        return <StaffPage />
      case 'settings':
        return <SettingsPage />
      case 'drawing-editor':
        return <DrawingEditorPage />
      case 'deceased':
        return <DeceasedPage />
      case 'customers':
        return <CustomersPage />
      default:
        return <DashboardPage />
    }
  }

  const renderPageWithFallback = () => (
    <Suspense fallback={<div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">Đang tải nội dung...</div>}>
      {renderPage()}
    </Suspense>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        onPageChange={handlePageChange} 
        onLogout={handleLogout}
        hasPermission={hasPermission}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 md:gap-4 ml-12 md:ml-0">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 capitalize truncate max-w-[120px] md:max-w-none">
              {activePage.replace('-', ' ')}
            </h2>
            <div className="hidden sm:block">
              <GlobalSearch onNavigate={handleSearchNavigate} />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-xs md:text-sm text-gray-500 hidden sm:inline truncate max-w-[150px]">
              {user?.email}
            </span>
            {userRole && (
              <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-medium ${
                userRole === 'Admin' ? 'bg-purple-100 text-purple-700' :
                userRole === 'Security' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {userRole}
              </span>
            )}
            <span className="text-sm text-gray-400 hidden md:inline">|</span>
            <span className="text-xs md:text-sm text-gray-500 hidden md:inline">
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </header>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 py-2 bg-white border-b border-gray-100">
          <GlobalSearch onNavigate={handleSearchNavigate} />
        </div>

        {/* Page Content */}
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-3 md:p-6"
        >
          {renderPageWithFallback()}
        </motion.div>
      </main>
    </div>
  )
}

// Protected Admin wrapper - requires authentication
function ProtectedAdmin() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // No reload needed: signIn() already updates auth state in context,
    // which causes ProtectedAdmin to re-render and show AdminContent.
    return <LoginPage onSuccess={() => {}} />
  }

  return (
    <ToastProvider>
      <AdminContent />
    </ToastProvider>
  )
}

export function AdminApp() {
  return (
    <AuthProvider>
      <ProtectedAdmin />
    </AuthProvider>
  )
}

export default AdminApp
