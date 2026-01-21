/**
 * Admin Module Entry Point
 */
export { AdminApp } from './AdminApp'
export { ToastProvider, useToast } from './components/Toast'
export { Sidebar } from './components/Sidebar'
export { StatCard } from './components/StatCard'

// Pages
export { DashboardPage } from './pages/DashboardPage'
export { MapEditorPage } from './pages/MapEditorPage'
export { StaffPage } from './pages/StaffPage'
export { DataPage } from './pages/DataPage'
export { SettingsPage } from './pages/SettingsPage'

// Hooks
export {
  usePlots,
  useStaff,
  usePatrolLogs,
  useDashboardStats
} from './hooks/useAdminData'
