/**
 * Database types for Supabase tables
 * Updated with customer_name for Mini-ERP
 */

export interface Database {
  public: {
    Tables: {
      plots: {
        Row: PlotRow
        Insert: PlotInsert
        Update: PlotUpdate
      }
      overlays: {
        Row: OverlayRow
        Insert: OverlayInsert
        Update: OverlayUpdate
      }
      spiritual_sites: {
        Row: SpiritualSiteRow
        Insert: SpiritualSiteInsert
        Update: SpiritualSiteUpdate
      }
      staff: {
        Row: StaffRow
        Insert: StaffInsert
        Update: StaffUpdate
      }
      patrol_logs: {
        Row: PatrolLogRow
        Insert: PatrolLogInsert
        Update: PatrolLogUpdate
      }
    }
  }
}

// ==================== PLOTS ====================
export type PlotStatusDb = 'Trống' | 'Đã bán' | 'Đặt cọc' | 'Đã an táng' | 'Khác'

export interface PlotRow {
  id: string
  name: string | null
  zone: string | null
  lat: number
  lng: number
  status: PlotStatusDb
  price: number | null
  area: number | null
  customer_name: string | null  // ← THÊM MỚI
  notes: string | null
  created_at?: string
  updated_at?: string
}

export interface PlotInsert {
  id?: string
  name?: string | null
  zone?: string | null
  lat: number
  lng: number
  status: PlotStatusDb
  price?: number | null
  area?: number | null
  customer_name?: string | null  // ← THÊM MỚI
  notes?: string | null
}

export interface PlotUpdate {
  id?: string
  name?: string | null
  zone?: string | null
  lat?: number
  lng?: number
  status?: PlotStatusDb
  price?: number | null
  area?: number | null
  customer_name?: string | null  // ← THÊM MỚI
  notes?: string | null
}

// ==================== OVERLAYS ====================
export type OverlayType = 'zone_map' | 'satellite' | 'blueprint' | 'decoration' | 'other'

export interface OverlayRow {
  id: string
  name: string | null
  display_name: string | null  // For label grouping (e.g., "B342" for B342-A and B342-B)
  url: string
  url_mobile: string | null
  nw_lat: number
  nw_lng: number
  se_lat: number
  se_lng: number
  z_index: number
  opacity: number
  is_visible: boolean
  type: OverlayType
  description: string | null
  created_at?: string
  updated_at?: string
}

export interface OverlayInsert {
  id?: string
  name?: string | null
  display_name?: string | null
  url: string
  url_mobile?: string | null
  nw_lat: number
  nw_lng: number
  se_lat: number
  se_lng: number
  z_index?: number
  opacity?: number
  is_visible?: boolean
  type?: OverlayType
  description?: string | null
}

export interface OverlayUpdate {
  id?: string
  name?: string | null
  display_name?: string | null
  url?: string
  url_mobile?: string | null
  nw_lat?: number
  nw_lng?: number
  se_lat?: number
  se_lng?: number
  z_index?: number
  opacity?: number
  is_visible?: boolean
  type?: OverlayType
  description?: string | null
}

// ==================== SPIRITUAL SITES ====================
export interface SpiritualSiteRow {
  id: string
  name: string
  type: string | null
  image_url: string | null
  lat: number
  lng: number
  created_at?: string
}

export interface SpiritualSiteInsert {
  id?: string
  name: string
  type?: string | null
  image_url?: string | null
  lat: number
  lng: number
}

export interface SpiritualSiteUpdate {
  id?: string
  name?: string
  type?: string | null
  image_url?: string | null
  lat?: number
  lng?: number
}

// ==================== UTILITY TYPES ====================

/**
 * GeoJSON Feature for a plot
 */
export interface PlotFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  properties: PlotRow & {
    _statusColor: string
  }
}

/**
 * GeoJSON FeatureCollection for all plots
 */
export interface PlotFeatureCollection {
  type: 'FeatureCollection'
  features: PlotFeature[]
}


// ==================== STAFF ====================
export type StaffRole = 'Admin' | 'Security' | 'Sale'

export interface StaffRow {
  id: string
  full_name: string
  role: StaffRole
  phone: string | null
  email: string | null
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface StaffInsert {
  full_name: string
  role: StaffRole
  phone?: string | null
  email?: string | null
  active?: boolean
}

export interface StaffUpdate {
  full_name?: string
  role?: StaffRole
  phone?: string | null
  email?: string | null
  active?: boolean
}

// ==================== PATROL LOGS ====================
export interface PatrolLogRow {
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

export interface PatrolLogUpdate {
  staff_name?: string
  plot_name?: string
  status?: string
  image_url?: string | null
}

// ==================== ROAD NETWORK (Internal Routing) ====================

/**
 * Road Node - Điểm nút trên đường (ngã rẽ, giao lộ, điểm đặc biệt)
 */
export interface RoadNodeRow {
  id: string
  name: string | null
  lat: number
  lng: number
  node_type: 'gate' | 'intersection' | 'landmark' | 'endpoint'
  created_at?: string
}

export interface RoadNodeInsert {
  id?: string
  name?: string | null
  lat: number
  lng: number
  node_type: 'gate' | 'intersection' | 'landmark' | 'endpoint'
}

/**
 * Road Edge - Đoạn đường nối giữa 2 điểm nút
 */
export interface RoadEdgeRow {
  id: string
  from_node_id: string
  to_node_id: string
  distance: number // meters (auto-calculated or manual)
  bidirectional: boolean // true = đi 2 chiều
  road_type: 'main' | 'secondary' | 'path' // loại đường
  created_at?: string
}

export interface RoadEdgeInsert {
  id?: string
  from_node_id: string
  to_node_id: string
  distance?: number
  bidirectional?: boolean
  road_type?: 'main' | 'secondary' | 'path'
}

/**
 * Road Network Graph for routing algorithm
 */
export interface RoadGraph {
  nodes: Map<string, RoadNodeRow>
  edges: Map<string, RoadEdgeRow[]> // node_id -> connected edges
}

/**
 * Route result from pathfinding
 */
export interface RouteResult {
  path: RoadNodeRow[] // ordered list of nodes
  totalDistance: number // meters
  coordinates: [number, number][] // [lat, lng] for drawing on map
}
