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
        Relationships: []
      }
      overlays: {
        Row: OverlayRow
        Insert: OverlayInsert
        Update: OverlayUpdate
        Relationships: []
      }
      spiritual_sites: {
        Row: SpiritualSiteRow
        Insert: SpiritualSiteInsert
        Update: SpiritualSiteUpdate
        Relationships: []
      }
      staff: {
        Row: StaffRow
        Insert: StaffInsert
        Update: StaffUpdate
        Relationships: []
      }
      patrol_logs: {
        Row: PatrolLogRow
        Insert: PatrolLogInsert
        Update: PatrolLogUpdate
        Relationships: []
      }
      road_nodes: {
        Row: RoadNodeRow
        Insert: RoadNodeInsert
        Update: RoadNodeUpdate
        Relationships: []
      }
      road_edges: {
        Row: RoadEdgeRow
        Insert: RoadEdgeInsert
        Update: RoadEdgeUpdate
        Relationships: []
      }
      audit_logs: {
        Row: AuditLogRow
        Insert: AuditLogInsert
        Update: AuditLogUpdate
        Relationships: []
      }
      map_drawings: {
        Row: MapDrawingRow
        Insert: MapDrawingInsert
        Update: MapDrawingUpdate
        Relationships: []
      }
      deceased: {
        Row: DeceasedRow
        Insert: DeceasedInsert
        Update: DeceasedUpdate
        Relationships: []
      }
      customers: {
        Row: CustomerRow
        Insert: CustomerInsert
        Update: CustomerUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
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
  customer_name: string | null
  deceased_name: string | null  // Tên người mất
  birth_date: string | null     // Ngày sinh (YYYY-MM-DD)
  death_date: string | null     // Ngày mất (YYYY-MM-DD)
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
  customer_name?: string | null
  deceased_name?: string | null
  birth_date?: string | null
  death_date?: string | null
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
  customer_name?: string | null
  deceased_name?: string | null
  birth_date?: string | null
  death_date?: string | null
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

export interface RoadNodeUpdate {
  name?: string | null
  lat?: number
  lng?: number
  node_type?: 'gate' | 'intersection' | 'landmark' | 'endpoint'
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

export interface RoadEdgeUpdate {
  from_node_id?: string
  to_node_id?: string
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

// ==================== AUDIT LOGS ====================
export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE'

export interface AuditLogRow {
  id: string
  table_name: string
  record_id: string
  action: AuditAction
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  changed_fields: string[] | null
  user_id: string | null
  user_email: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AuditLogInsert {
  table_name: string
  record_id: string
  action: AuditAction
  old_data?: Record<string, unknown> | null
  new_data?: Record<string, unknown> | null
  changed_fields?: string[] | null
  user_id?: string | null
  user_email?: string | null
  ip_address?: string | null
  user_agent?: string | null
}

export interface AuditLogUpdate {
  table_name?: string
  record_id?: string
  action?: AuditAction
  old_data?: Record<string, unknown> | null
  new_data?: Record<string, unknown> | null
  changed_fields?: string[] | null
  user_id?: string | null
  user_email?: string | null
  ip_address?: string | null
  user_agent?: string | null
}

// ==================== MAP DRAWINGS ====================
export type DrawingType = 'polygon' | 'polyline' | 'circle' | 'rectangle'

export interface MapDrawingRow {
  id: string
  name: string
  description: string | null
  drawing_type: DrawingType
  coordinates: [number, number][] // Array of [lng, lat]
  properties: Record<string, unknown> // Additional props like radius
  stroke_color: string
  stroke_width: number
  fill_color: string
  fill_opacity: number
  is_visible: boolean
  z_index: number
  created_at?: string
  updated_at?: string
  created_by?: string
}

export interface MapDrawingInsert {
  id?: string
  name: string
  description?: string | null
  drawing_type: DrawingType
  coordinates: [number, number][]
  properties?: Record<string, unknown>
  stroke_color?: string
  stroke_width?: number
  fill_color?: string
  fill_opacity?: number
  is_visible?: boolean
  z_index?: number
}

export interface MapDrawingUpdate {
  name?: string
  description?: string | null
  drawing_type?: DrawingType
  coordinates?: [number, number][]
  properties?: Record<string, unknown>
  stroke_color?: string
  stroke_width?: number
  fill_color?: string
  fill_opacity?: number
  is_visible?: boolean
  z_index?: number
}

// ==================== DECEASED (Người mất) ====================
export interface DeceasedRow {
  id: string
  plot_id: string
  full_name: string
  gender: string | null
  birth_date: string | null
  death_date: string | null
  burial_date: string | null
  birth_place: string | null
  death_place: string | null
  religion: string | null
  photo_url: string | null
  epitaph: string | null
  notes: string | null
  created_at?: string
  updated_at?: string
}

export interface DeceasedInsert {
  plot_id: string
  full_name: string
  gender?: string | null
  birth_date?: string | null
  death_date?: string | null
  burial_date?: string | null
  birth_place?: string | null
  death_place?: string | null
  religion?: string | null
  photo_url?: string | null
  epitaph?: string | null
  notes?: string | null
}

export interface DeceasedUpdate {
  full_name?: string
  gender?: string | null
  birth_date?: string | null
  death_date?: string | null
  burial_date?: string | null
  birth_place?: string | null
  death_place?: string | null
  religion?: string | null
  photo_url?: string | null
  epitaph?: string | null
  notes?: string | null
}

// ==================== CUSTOMERS (Người đứng hợp đồng) ====================
export type PaymentStatus = 'pending' | 'partial' | 'paid'

export interface CustomerRow {
  id: string
  plot_id: string
  full_name: string
  phone: string | null
  phone_2: string | null
  email: string | null
  address: string | null
  city: string | null
  id_number: string | null
  id_issued_date: string | null
  id_issued_place: string | null
  relationship: string | null
  contract_number: string | null
  contract_date: string | null
  contract_type: string | null
  total_amount: number | null
  paid_amount: number | null
  payment_status: PaymentStatus
  notes: string | null
  is_primary: boolean
  created_at?: string
  updated_at?: string
}

export interface CustomerInsert {
  plot_id: string
  full_name: string
  phone?: string | null
  phone_2?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  id_number?: string | null
  id_issued_date?: string | null
  id_issued_place?: string | null
  relationship?: string | null
  contract_number?: string | null
  contract_date?: string | null
  contract_type?: string | null
  total_amount?: number | null
  paid_amount?: number | null
  payment_status?: PaymentStatus
  notes?: string | null
  is_primary?: boolean
}

export interface CustomerUpdate {
  full_name?: string
  phone?: string | null
  phone_2?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  id_number?: string | null
  id_issued_date?: string | null
  id_issued_place?: string | null
  relationship?: string | null
  contract_number?: string | null
  contract_date?: string | null
  contract_type?: string | null
  total_amount?: number | null
  paid_amount?: number | null
  payment_status?: PaymentStatus
  notes?: string | null
  is_primary?: boolean
}
