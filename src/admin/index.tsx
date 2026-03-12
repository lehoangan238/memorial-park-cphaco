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
export { SettingsPage } from './pages/SettingsPage'
export { PlotManagerPage } from './pages/PlotManagerPage'
export { OverlayManagerPage } from './pages/OverlayManagerPage'
export { SpiritualSitesPage } from './pages/SpiritualSitesPage'
export { ImportExportPage } from './pages/ImportExportPage'
export { RoadEditorPage } from './pages/RoadEditorPage'
export { QRGeneratorPage } from './pages/QRGeneratorPage'

// Hooks
export {
  usePlots,
  useStaff,
  usePatrolLogs,
  useDashboardStats
} from './hooks/useAdminData'
