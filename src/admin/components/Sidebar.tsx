/**
 * Admin Sidebar Navigation
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Map,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GitBranch,
  QrCode,
  Layers,
  MapPin,
  Church,
  FileSpreadsheet,
  Menu,
  X,
  PenTool,
  Heart,
  UserCheck
} from 'lucide-react'
import logoImage from '@/assets/logo.png'

export type AdminPage = 'dashboard' | 'map-editor' | 'road-editor' | 'qr-generator' | 'overlay-manager' | 'plot-manager' | 'spiritual-sites' | 'import-export' | 'staff' | 'settings' | 'drawing-editor' | 'deceased' | 'customers'

interface SidebarProps {
  activePage: AdminPage
  onPageChange: (page: AdminPage) => void
  onLogout?: () => void
  hasPermission?: (page: string) => boolean
}

const navItems: { id: AdminPage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'map-editor', label: 'Map Editor', icon: <Map className="w-5 h-5" /> },
  { id: 'overlay-manager', label: 'Overlay', icon: <Layers className="w-5 h-5" /> },
  { id: 'drawing-editor', label: 'Vẽ bản đồ', icon: <PenTool className="w-5 h-5" /> },
  { id: 'plot-manager', label: 'Quản lý Plot', icon: <MapPin className="w-5 h-5" /> },
  { id: 'deceased', label: 'Người mất', icon: <Heart className="w-5 h-5" /> },
  { id: 'customers', label: 'Khách hàng', icon: <UserCheck className="w-5 h-5" /> },
  { id: 'spiritual-sites', label: 'Điểm tâm linh', icon: <Church className="w-5 h-5" /> },
  { id: 'road-editor', label: 'Đường đi', icon: <GitBranch className="w-5 h-5" /> },
  { id: 'qr-generator', label: 'QR Dẫn đường', icon: <QrCode className="w-5 h-5" /> },
  { id: 'import-export', label: 'Import/Export', icon: <FileSpreadsheet className="w-5 h-5" /> },
  { id: 'staff', label: 'Staff', icon: <Users className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
]

export function Sidebar({ activePage, onPageChange, onLogout, hasPermission }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter nav items based on permissions
  const visibleNavItems = hasPermission 
    ? navItems.filter(item => hasPermission(item.id))
    : navItems

  const handlePageChange = (page: AdminPage) => {
    onPageChange(page)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  // Mobile hamburger button (rendered in parent via portal or passed as prop)
  const MobileMenuButton = () => (
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  )

  // Sidebar content
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {(!collapsed || isMobile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <img
              src={logoImage}
              alt="Logo"
              className="w-8 h-8 rounded-lg object-cover border border-gray-200"
            />
            <span className="font-semibold text-gray-900">Bản Đồ Số Admin</span>
          </motion.div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {visibleNavItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => handlePageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activePage === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          {(!collapsed || isMobile) && <span className="font-medium text-sm">Đăng xuất</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button - exported for parent to use */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <MobileMenuButton />
        </div>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 72 : 240 }}
          transition={{ duration: 0.2 }}
          className="h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm"
        >
          <SidebarContent />
        </motion.aside>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-200 flex flex-col shadow-xl z-50"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
