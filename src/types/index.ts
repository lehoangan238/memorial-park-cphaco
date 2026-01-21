export type PlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance'

export interface GraveMemorial {
  birthDate: string
  deathDate: string
  epitaph?: string
  flowers?: number
  visitors?: number
  lastVisited?: string
}

export interface Grave {
  id: string
  name: string | null
  coordinates: [number, number] // [lat, lng]
  area: string
  status: PlotStatus
  imageUrl: string | null
  memorial?: GraveMemorial
  price?: number
  reservedBy?: string
  reservedUntil?: string
}

export interface Memorial {
  id: string
  plotId: string
  name: string
  birthDate: string
  deathDate: string
  epitaph?: string
  photoUrl?: string
  flowers?: number
  visitors?: number
  lastVisited?: string
}

export interface Plot {
  id: string
  section: string
  row: number
  number: number
  status: PlotStatus
  x: number
  y: number
  width: number
  height: number
  memorial?: Memorial
  price?: number
  reservedBy?: string
  reservedUntil?: string
}

export interface Section {
  id: string
  name: string
  description: string
  totalPlots: number
  availablePlots: number
  color: string
  paths: string
}

export interface ParkStats {
  totalPlots: number
  occupiedPlots: number
  availablePlots: number
  reservedPlots: number
  maintenancePlots: number
  totalVisitors: number
  recentVisitors: number
  totalFlowers: number
}

export interface Visitor {
  id: string
  name: string
  memorialId: string
  visitDate: string
  flowers?: number
  notes?: string
}
