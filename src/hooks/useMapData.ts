import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { saveToCache, getFromCache } from '@/lib/offlineCache'
import type { PlotRow, OverlayRow, SpiritualSiteRow, PlotFeatureCollection, RoadNodeRow, RoadEdgeRow } from '@/types/database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

/**
 * Status color mapping for Vietnamese statuses
 */
const STATUS_COLORS: Record<string, string> = {
  'Trống': '#10B981',      // Emerald Green - Available
  'Đã bán': '#EF4444',     // Red - Sold
  'Đặt cọc': '#F59E0B',    // Amber - Reserved
  'Đã an táng': '#6B7280', // Gray - Buried
  'Khác': '#9CA3AF'        // Light Gray - Other
}

/**
 * Get status color with fallback
 */
function getPlotStatusColor(status: string): string {
  return STATUS_COLORS[status] || STATUS_COLORS['Khác']
}

// ==================== PLOTS ====================

/**
 * Fetch all plots from Supabase with offline cache fallback
 */
async function fetchPlots(): Promise<PlotRow[]> {
  logger.info('[fetchPlots] Starting fetch...')
  
  // Try cache first for faster initial load
  const cached = await getFromCache<PlotRow[]>('plots').catch(() => null)
  
  try {
    // Fetch from network
    const { data, error } = await supabase
      .from('plots')
      .select('*')
      .order('zone', { ascending: true })
      .abortSignal(undefined as unknown as AbortSignal) // Disable abort signal

    if (error) {
      logger.error('[fetchPlots] Supabase error:', error)
      // Return cached data if available
      if (cached && cached.length > 0) {
        logger.info(`[fetchPlots] Using ${cached.length} cached plots due to error`)
        return cached
      }
      throw error
    }
    
    logger.info(`[fetchPlots] Fetched ${data?.length || 0} plots from network`)
    
    // Save to cache for offline use
    if (data && data.length > 0) {
      saveToCache('plots', data).catch((error) => logger.error(error))
    }
    
    return data || []
  } catch (error) {
    // Check if it's an AbortError - use cached data
    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn('[fetchPlots] Request aborted, using cache')
      if (cached && cached.length > 0) {
        return cached
      }
    }
    
    logger.error('[fetchPlots] Network error:', error)
    
    // Try to get from cache as fallback
    if (cached && cached.length > 0) {
      logger.info(`[fetchPlots] Using ${cached.length} cached plots`)
      return cached
    }
    
    // Re-throw original error if no cache
    throw error
  }
}

/**
 * Convert plots to GeoJSON FeatureCollection for map rendering
 */
export function plotsToGeoJSON(plots: PlotRow[]): PlotFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: plots.map(plot => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [plot.lng, plot.lat] // GeoJSON uses [lng, lat]
      },
      properties: {
        ...plot,
        _statusColor: getPlotStatusColor(plot.status)
      }
    }))
  }
}

/**
 * React Query hook for fetching plots
 */
export function usePlots() {
  return useQuery({
    queryKey: ['plots'],
    queryFn: fetchPlots,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

/**
 * React Query hook for fetching plots as GeoJSON
 */
export function usePlotsGeoJSON() {
  const query = usePlots()
  
  return {
    ...query,
    geoJSON: query.data ? plotsToGeoJSON(query.data) : null
  }
}

// ==================== OVERLAYS ====================

/**
 * Fetch all overlays from Supabase with offline cache fallback
 */
async function fetchOverlays(): Promise<OverlayRow[]> {
  const cached = await getFromCache<OverlayRow[]>('overlays').catch(() => null)
  
  try {
    const { data, error } = await supabase
      .from('overlays')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      if (cached && cached.length > 0) return cached
      throw error
    }
    
    if (data && data.length > 0) {
      saveToCache('overlays', data).catch((error) => logger.error(error))
      logger.info(`[useMapData] Fetched ${data.length} overlays from network`)
    }
    
    return data || []
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError' && cached) {
      return cached
    }
    logger.error('[useMapData] Error fetching overlays:', error)
    if (cached && cached.length > 0) return cached
    throw error
  }
}

/**
 * React Query hook for fetching overlays
 */
export function useOverlays() {
  return useQuery({
    queryKey: ['overlays'],
    queryFn: fetchOverlays,
    staleTime: 10 * 60 * 1000, // 10 minutes - overlays change less frequently
    refetchOnWindowFocus: false
  })
}

// ==================== SPIRITUAL SITES ====================

/**
 * Fetch all spiritual sites from Supabase with offline cache fallback
 */
async function fetchSpiritualSites(): Promise<SpiritualSiteRow[]> {
  const cached = await getFromCache<SpiritualSiteRow[]>('spiritual_sites').catch(() => null)
  
  try {
    const { data, error } = await supabase
      .from('spiritual_sites')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      if (cached && cached.length > 0) return cached
      throw error
    }
    
    if (data && data.length > 0) {
      saveToCache('spiritual_sites', data).catch((error) => logger.error(error))
    }
    
    return data || []
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError' && cached) {
      return cached
    }
    logger.error('Error fetching spiritual sites:', error)
    if (cached && cached.length > 0) return cached
    throw error
  }
}

/**
 * React Query hook for fetching spiritual sites
 */
export function useSpiritualSites() {
  return useQuery({
    queryKey: ['spiritual_sites'],
    queryFn: fetchSpiritualSites,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  })
}

// ==================== COMBINED DATA ====================

// ==================== ROAD NETWORK ====================

/**
 * Fetch all road nodes from Supabase with offline cache fallback
 */
async function fetchRoadNodes(): Promise<RoadNodeRow[]> {
  try {
    const { data, error } = await supabase
      .from('road_nodes')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    
    if (data && data.length > 0) {
      saveToCache('road_nodes', data).catch((error) => logger.error(error))
    }
    
    return data || []
  } catch (error) {
    logger.error('Error fetching road nodes:', error)
    
    const cached = await getFromCache<RoadNodeRow[]>('road_nodes')
    if (cached) return cached
    
    return [] // Road network is optional
  }
}

/**
 * Fetch all road edges from Supabase with offline cache fallback
 */
async function fetchRoadEdges(): Promise<RoadEdgeRow[]> {
  try {
    const { data, error } = await supabase
      .from('road_edges')
      .select('*')

    if (error) throw error
    
    if (data && data.length > 0) {
      saveToCache('road_edges', data).catch((error) => logger.error(error))
    }
    
    return data || []
  } catch (error) {
    logger.error('Error fetching road edges:', error)
    
    const cached = await getFromCache<RoadEdgeRow[]>('road_edges')
    if (cached) return cached
    
    return [] // Road network is optional
  }
}

/**
 * React Query hook for fetching road nodes
 */
export function useRoadNodes() {
  return useQuery({
    queryKey: ['road_nodes'],
    queryFn: fetchRoadNodes,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  })
}

/**
 * React Query hook for fetching road edges
 */
export function useRoadEdges() {
  return useQuery({
    queryKey: ['road_edges'],
    queryFn: fetchRoadEdges,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  })
}

/**
 * Hook to subscribe to Supabase real-time updates
 */
function useRealtimeSubscription() {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Skip realtime in development to avoid connection issues
    if (import.meta.env.DEV) {
      logger.info('[Realtime] Skipping subscriptions in development mode')
      return
    }
    
    let isActive = true
    
    logger.info('[Realtime] Setting up Supabase subscriptions...')

    // Subscribe to plots changes
    const plotsChannel = supabase
      .channel('plots-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'plots' },
        (payload: RealtimePostgresChangesPayload<PlotRow>) => {
          if (!isActive) return
          logger.info('[Realtime] Plot change detected:', payload.eventType)
          
          // Optimistically update the cache
          queryClient.setQueryData<PlotRow[]>(['plots'], (old) => {
            if (!old) return old
            
            switch (payload.eventType) {
              case 'INSERT':
                return [...old, payload.new as PlotRow]
              case 'UPDATE':
                return old.map(plot => 
                  plot.id === (payload.new as PlotRow).id ? payload.new as PlotRow : plot
                )
              case 'DELETE':
                return old.filter(plot => plot.id !== (payload.old as PlotRow).id)
              default:
                return old
            }
          })
        }
      )
      .subscribe((status) => {
        if (isActive) {
          logger.info('[Realtime] Plots subscription status:', status)
        }
      })

    // Subscribe to overlays changes
    const overlaysChannel = supabase
      .channel('overlays-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'overlays' },
        () => {
          if (!isActive) return
          logger.info('[Realtime] Overlay change detected')
          queryClient.invalidateQueries({ queryKey: ['overlays'] })
        }
      )
      .subscribe((status) => {
        if (isActive) {
          logger.info('[Realtime] Overlays subscription status:', status)
        }
      })

    // Subscribe to spiritual_sites changes
    const sitesChannel = supabase
      .channel('spiritual-sites-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spiritual_sites' },
        () => {
          if (!isActive) return
          logger.info('[Realtime] Spiritual site change detected')
          queryClient.invalidateQueries({ queryKey: ['spiritual_sites'] })
        }
      )
      .subscribe((status) => {
        if (isActive) {
          logger.info('[Realtime] Spiritual sites subscription status:', status)
        }
      })

    // Cleanup subscriptions on unmount
    return () => {
      isActive = false
      logger.info('[Realtime] Cleaning up subscriptions...')
      supabase.removeChannel(plotsChannel).catch(() => {})
      supabase.removeChannel(overlaysChannel).catch(() => {})
      supabase.removeChannel(sitesChannel).catch(() => {})
    }
  }, [queryClient])
}

/**
 * Fetch all map data in parallel with real-time updates
 */
export function useMapData() {
  const plots = usePlotsGeoJSON()
  const overlays = useOverlays()
  const spiritualSites = useSpiritualSites()
  const roadNodes = useRoadNodes()
  const roadEdges = useRoadEdges()

  // Enable real-time subscriptions
  useRealtimeSubscription()

  const isLoading = plots.isLoading || overlays.isLoading || spiritualSites.isLoading
  const isError = plots.isError || overlays.isError || spiritualSites.isError
  const error = plots.error || overlays.error || spiritualSites.error

  return {
    plots: plots.data || [],
    plotsGeoJSON: plots.geoJSON,
    overlays: overlays.data || [],
    spiritualSites: spiritualSites.data || [],
    roadNodes: roadNodes.data || [],
    roadEdges: roadEdges.data || [],
    isLoading,
    isError,
    error,
    refetch: () => {
      plots.refetch()
      overlays.refetch()
      spiritualSites.refetch()
      roadNodes.refetch()
      roadEdges.refetch()
    }
  }
}
