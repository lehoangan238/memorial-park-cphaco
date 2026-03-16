import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { saveToCache, getFromCache } from '@/lib/offlineCache'
import type { PlotRow, OverlayRow, SpiritualSiteRow, PlotFeatureCollection, RoadNodeRow, RoadEdgeRow } from '@/types/database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

type CacheDataKey = 'plots' | 'overlays' | 'spiritual_sites' | 'road_nodes' | 'road_edges'

const CACHE_TIMEOUT_MS = 1200
const NETWORK_TIMEOUT_MS = 12000
const PLOTS_NETWORK_TIMEOUT_MS = 35000

function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)

    Promise.resolve(promise)
      .then((value) => {
        clearTimeout(timeoutId)
        resolve(value)
      })
      .catch((error: unknown) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

async function getCacheWithTimeout<T>(key: CacheDataKey): Promise<T | null> {
  try {
    return await withTimeout(getFromCache<T>(key), CACHE_TIMEOUT_MS, `cache:${key}`)
  } catch (error) {
    logger.warn(`[useMapData] Cache read skipped for ${key}:`, error)
    return null
  }
}

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

  // Read cache in parallel and do not let IndexedDB block network fetches forever.
  const cachedPromise = getCacheWithTimeout<PlotRow[]>('plots')
  
  try {
    const pageSize = 500
    let from = 0
    const allRows: PlotRow[] = []
    let pageError: Error | null = null

    while (true) {
      const { data, error } = await withTimeout<any>(
        supabasePublic
          .from('plots')
          .select('*')
          .order('id', { ascending: true })
          .range(from, from + pageSize - 1),
        PLOTS_NETWORK_TIMEOUT_MS,
        `network:plots:${from}`
      )

      if (error) {
        pageError = error as unknown as Error
        break
      }

      const rows = ((data || []) as Array<Partial<PlotRow>>).map((row) => ({
        ...row,
        deceased_name: row.deceased_name ?? null,
        birth_date: row.birth_date ?? null,
        death_date: row.death_date ?? null,
      })) as PlotRow[]
      allRows.push(...rows)

      if (rows.length < pageSize) {
        break
      }

      from += pageSize
    }

    const cached = await cachedPromise

    if (pageError) {
      const isAbort = pageError.message?.includes('AbortError') || pageError.message?.includes('signal is aborted')
      if (isAbort) {
        logger.warn('[fetchPlots] Request aborted by Supabase internals, using cache')
        if (cached && cached.length > 0) return cached
      } else {
        logger.error('[fetchPlots] Supabase error:', pageError)
      }
      // Return cached data if available
      if (cached && cached.length > 0) {
        logger.info(`[fetchPlots] Using ${cached.length} cached plots due to error`)
        return cached
      }
      throw pageError
    }
    
    logger.info(`[fetchPlots] Fetched ${allRows.length || 0} plots from network`)
    
    // Save to cache for offline use
    if (allRows.length > 0) {
      saveToCache('plots', allRows).catch((error) => logger.error(error))
    }
    
    return allRows
  } catch (error) {
    const cached = await cachedPromise

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
  const validPlots = plots.filter(p => isFinite(Number(p.lng)) && isFinite(Number(p.lat)))
  return {
    type: 'FeatureCollection',
    features: validPlots.map(plot => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(plot.lng), Number(plot.lat)] // GeoJSON uses [lng, lat]
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
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

/**
 * React Query hook for fetching plots as GeoJSON
 */
export function usePlotsGeoJSON() {
  const query = usePlots()
  
  const geoJSON = useMemo(() => {
    return query.data ? plotsToGeoJSON(query.data) : null
  }, [query.data])

  return {
    ...query,
    geoJSON
  }
}

// ==================== OVERLAYS ====================

/**
 * Fetch all overlays from Supabase with offline cache fallback
 */
async function fetchOverlays(): Promise<OverlayRow[]> {
  const cachedPromise = getCacheWithTimeout<OverlayRow[]>('overlays')
  
  try {
    const { data, error } = await withTimeout<any>(
      supabasePublic
        .from('overlays')
        .select('*')
        .order('name', { ascending: true }),
      NETWORK_TIMEOUT_MS,
      'network:overlays'
    )

    const cached = await cachedPromise

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
    const cached = await cachedPromise

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
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes - overlays change less frequently
    refetchOnWindowFocus: false
  })
}

// ==================== SPIRITUAL SITES ====================

/**
 * Fetch all spiritual sites from Supabase with offline cache fallback
 */
async function fetchSpiritualSites(): Promise<SpiritualSiteRow[]> {
  const cachedPromise = getCacheWithTimeout<SpiritualSiteRow[]>('spiritual_sites')
  
  try {
    const { data, error } = await withTimeout<any>(
      supabasePublic
        .from('spiritual_sites')
        .select('*')
        .order('name', { ascending: true }),
      NETWORK_TIMEOUT_MS,
      'network:spiritual_sites'
    )

    const cached = await cachedPromise

    if (error) {
      if (cached && cached.length > 0) return cached
      throw error
    }
    
    if (data && data.length > 0) {
      saveToCache('spiritual_sites', data).catch((error) => logger.error(error))
    }
    
    return data || []
  } catch (error) {
    const cached = await cachedPromise

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
    retry: 1,
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
    const { data, error } = await withTimeout<any>(
      supabasePublic
        .from('road_nodes')
        .select('*')
        .order('name', { ascending: true }),
      NETWORK_TIMEOUT_MS,
      'network:road_nodes'
    )

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
    const { data, error } = await withTimeout<any>(
      supabasePublic
        .from('road_edges')
        .select('*'),
      NETWORK_TIMEOUT_MS,
      'network:road_edges'
    )

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
    retry: 1,
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
    retry: 1,
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
    const plotsChannel = supabasePublic
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
    const overlaysChannel = supabasePublic
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
    const sitesChannel = supabasePublic
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
      supabasePublic.removeChannel(plotsChannel).catch(() => {})
      supabasePublic.removeChannel(overlaysChannel).catch(() => {})
      supabasePublic.removeChannel(sitesChannel).catch(() => {})
    }
  }, [queryClient])
}

const EMPTY_ARRAY: any[] = []

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

  // Plots are the critical data source; overlays/sites are optional enrichments.
  // Do not block the entire map when optional queries are slow or failing.
  const isLoading = plots.isLoading && !plots.data
  const isError = plots.isError && !plots.data
  const error = plots.error || overlays.error || spiritualSites.error

  return {
    plots: plots.data || EMPTY_ARRAY as PlotRow[],
    plotsGeoJSON: plots.geoJSON,
    overlays: overlays.data || EMPTY_ARRAY as OverlayRow[],
    spiritualSites: spiritualSites.data || EMPTY_ARRAY as SpiritualSiteRow[],
    roadNodes: roadNodes.data || EMPTY_ARRAY as RoadNodeRow[],
    roadEdges: roadEdges.data || EMPTY_ARRAY as RoadEdgeRow[],
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
