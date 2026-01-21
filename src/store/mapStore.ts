import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { PlotRow, SpiritualSiteRow } from '@/types/database'

// ==================== TYPES ====================

interface ViewState {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}

interface MapFilters {
  status: string
  zone: string | null
}

interface RouteInfo {
  isActive: boolean
  destination: PlotRow | null
  waypoints: [number, number][]
  distance: number | null  // in meters
  duration: number | null  // in seconds
}

// ==================== MAP STORE ====================

interface MapState {
  // View
  viewState: ViewState
  setViewState: (viewState: ViewState | ((prev: ViewState) => ViewState)) => void
  resetView: () => void

  // Selection
  selectedPlot: PlotRow | null
  setSelectedPlot: (plot: PlotRow | null) => void
  hoveredPlotId: string | null
  setHoveredPlotId: (id: string | null) => void

  // Filters
  filters: MapFilters
  setStatusFilter: (status: string) => void
  setZoneFilter: (zone: string | null) => void
  resetFilters: () => void

  // UI State
  showOverlays: boolean
  toggleOverlays: () => void
  showMarkers: boolean
  toggleMarkers: () => void
  activeTab: 'map' | 'overview'
  setActiveTab: (tab: 'map' | 'overview') => void
  isMenuOpen: boolean
  toggleMenu: () => void
  
  // Routing
  route: RouteInfo
  startRoute: (destination: PlotRow) => void
  setRouteWaypoints: (waypoints: [number, number][]) => void
  clearRoute: () => void

  // Fly to
  flyToPlot: PlotRow | null
  setFlyToPlot: (plot: PlotRow | null) => void
}

const DEFAULT_VIEW_STATE: ViewState = {
  longitude: 106.6521,
  latitude: 11.1836,
  zoom: 17,
  pitch: 45,
  bearing: 0
}

const DEFAULT_FILTERS: MapFilters = {
  status: 'all',
  zone: null
}

const DEFAULT_ROUTE: RouteInfo = {
  isActive: false,
  destination: null,
  waypoints: [],
  distance: null,
  duration: null
}

export const useMapStore = create<MapState>()((set) => ({
  // View
  viewState: DEFAULT_VIEW_STATE,
  setViewState: (viewState) => set((state) => ({
    viewState: typeof viewState === 'function' ? viewState(state.viewState) : viewState
  })),
  resetView: () => set({ viewState: DEFAULT_VIEW_STATE }),

  // Selection
  selectedPlot: null,
  setSelectedPlot: (plot) => set({ selectedPlot: plot }),
  hoveredPlotId: null,
  setHoveredPlotId: (id) => set({ hoveredPlotId: id }),

  // Filters
  filters: DEFAULT_FILTERS,
  setStatusFilter: (status) => set((state) => ({ 
    filters: { ...state.filters, status } 
  })),
  setZoneFilter: (zone) => set((state) => ({ 
    filters: { ...state.filters, zone } 
  })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // UI State
  showOverlays: true,
  toggleOverlays: () => set((state) => ({ showOverlays: !state.showOverlays })),
  showMarkers: true,
  toggleMarkers: () => set((state) => ({ showMarkers: !state.showMarkers })),
  activeTab: 'map',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  // Routing
  route: DEFAULT_ROUTE,
  startRoute: (destination) => set({
    route: {
      isActive: true,
      destination,
      waypoints: [],
      distance: null,
      duration: null
    }
  }),
  setRouteWaypoints: (waypoints) => set((state) => ({
    route: { ...state.route, waypoints }
  })),
  clearRoute: () => set({ route: DEFAULT_ROUTE }),

  // Fly to
  flyToPlot: null,
  setFlyToPlot: (plot) => set({ flyToPlot: plot })
}))

// ==================== FAVORITES STORE (Persisted) ====================

interface FavoritesState {
  favorites: string[]  // Plot IDs
  addFavorite: (plotId: string) => void
  removeFavorite: (plotId: string) => void
  toggleFavorite: (plotId: string) => void
  isFavorite: (plotId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (plotId) => set((state) => ({
        favorites: state.favorites.includes(plotId) 
          ? state.favorites 
          : [...state.favorites, plotId]
      })),
      removeFavorite: (plotId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== plotId)
      })),
      toggleFavorite: (plotId) => {
        const { favorites } = get()
        if (favorites.includes(plotId)) {
          set({ favorites: favorites.filter(id => id !== plotId) })
        } else {
          set({ favorites: [...favorites, plotId] })
        }
      },
      isFavorite: (plotId) => get().favorites.includes(plotId),
      clearFavorites: () => set({ favorites: [] })
    }),
    {
      name: 'memorial-park-favorites',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ==================== RECENTLY VIEWED STORE (Persisted) ====================

interface RecentlyViewedState {
  recentPlots: string[]  // Plot IDs, most recent first
  maxItems: number
  addRecent: (plotId: string) => void
  clearRecent: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      recentPlots: [],
      maxItems: 10,
      addRecent: (plotId) => set((state) => {
        // Remove if exists, then add to front
        const filtered = state.recentPlots.filter(id => id !== plotId)
        return {
          recentPlots: [plotId, ...filtered].slice(0, state.maxItems)
        }
      }),
      clearRecent: () => set({ recentPlots: [] })
    }),
    {
      name: 'memorial-park-recent',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ==================== OFFLINE CACHE STORE ====================

interface OfflineCacheState {
  isOnline: boolean
  setOnline: (online: boolean) => void
  lastSyncTime: number | null
  setLastSyncTime: (time: number) => void
  cachedPlots: PlotRow[]
  setCachedPlots: (plots: PlotRow[]) => void
  cachedSites: SpiritualSiteRow[]
  setCachedSites: (sites: SpiritualSiteRow[]) => void
}

export const useOfflineCacheStore = create<OfflineCacheState>()(
  persist(
    (set) => ({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      setOnline: (online) => set({ isOnline: online }),
      lastSyncTime: null,
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      cachedPlots: [],
      setCachedPlots: (plots) => set({ cachedPlots: plots }),
      cachedSites: [],
      setCachedSites: (sites) => set({ cachedSites: sites })
    }),
    {
      name: 'memorial-park-cache',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ==================== DECEASED INFO MODAL ====================

interface DeceasedInfo {
  id: string
  plotId: string
  name: string
  birthDate?: string
  deathDate?: string
  photo?: string
  biography?: string
  familyContact?: string
}

interface DeceasedModalState {
  isOpen: boolean
  deceasedInfo: DeceasedInfo | null
  openModal: (info: DeceasedInfo) => void
  closeModal: () => void
}

export const useDeceasedModalStore = create<DeceasedModalState>()((set) => ({
  isOpen: false,
  deceasedInfo: null,
  openModal: (info) => set({ isOpen: true, deceasedInfo: info }),
  closeModal: () => set({ isOpen: false, deceasedInfo: null })
}))
