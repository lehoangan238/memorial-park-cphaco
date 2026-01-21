/**
 * Admin Dashboard Types
 */

// Staff Management
export interface Staff {
  id: string
  full_name: string
  role: 'Admin' | 'Security' | 'Sale'
  phone: string | null
  email: string | null
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface StaffInsert {
  full_name: string
  role: 'Admin' | 'Security' | 'Sale'
  phone?: string | null
  email?: string | null
  active?: boolean
}

export interface StaffUpdate {
  full_name?: string
  role?: 'Admin' | 'Security' | 'Sale'
  phone?: string | null
  email?: string | null
  active?: boolean
}

// Patrol Logs
export interface PatrolLog {
  id: string
  created_at: string
  staff_name: string
  plot_name: string
  status: string
  image_url: string | null
}

export interface PatrolLogInsert {
  staff_name: string
  plot_name: string
  status: string
  image_url?: string | null
}

// Dashboard Stats
export interface DashboardStats {
  totalPlots: number
  soldPlots: number
  availablePlots: number
  reservedPlots: number
  totalRevenue: number
  recentPatrolLogs: PatrolLog[]
}

// Settings
export interface AppSettings {
  mapCenterLat: number
  mapCenterLng: number
  mapZoom: number
  companyName: string
}

// Plot for Admin (extended)
export interface AdminPlot {
  name: string
  status: 'Đã bán' | 'Đặt cọc' | 'Còn trống' | 'Trống' | 'Đã an táng' | 'Khác'
  lat: number | null
  lng: number | null
  customer_name: string | null
  contract_price: number | null
  zone: string | null
  area: number | null
  notes: string | null
}
