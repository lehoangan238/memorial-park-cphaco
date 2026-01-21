import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { PlotRow, OverlayRow, SpiritualSiteRow, PlotFeatureCollection, RoadNodeRow, RoadEdgeRow } from '@/types/database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

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
 * Fetch all plots from Supabase
 */
async function fetchPlots(): Promise<PlotRow[]> {
  const { data, error } = await supabase
    .from('plots')
    .select('*')
    .order('zone', { ascending: true })

  if (error) {
    console.error('Error fetching plots:', error)
    throw new Error(error.message)
  }

  return data || []
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
 * Fetch all overlays from Supabase
 */
async function fetchOverlays(): Promise<OverlayRow[]> {
  console.log('[useMapData] Fetching overlays from Supabase...')
  
  const { data, error } = await supabase
    .from('overlays')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('[useMapData] Error fetching overlays:', error)
    throw new Error(error.message)
  }

  console.log(`[useMapData] Fetched ${data?.length || 0} overlays`)
  if (data && data.length > 0) {
    console.log('[useMapData] First overlay sample:', data[0])
  }

  return data || []
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
 * Fetch all spiritual sites from Supabase
 */
async function fetchSpiritualSites(): Promise<SpiritualSiteRow[]> {
  const { data, error } = await supabase
    .from('spiritual_sites')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching spiritual sites:', error)
    throw new Error(error.message)
  }

  return data || []
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
 * Fetch all road nodes from Supabase
 */
async function fetchRoadNodes(): Promise<RoadNodeRow[]> {
  const { data, error } = await supabase
    .from('road_nodes')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching road nodes:', error)
    // Return empty array instead of throwing - road network is optional
    return []
  }

  return data || []
}

/**
 * Fetch all road edges from Supabase
 */
async function fetchRoadEdges(): Promise<RoadEdgeRow[]> {
  const { data, error } = await supabase
    .from('road_edges')
    .select('*')

  if (error) {
    console.error('Error fetching road edges:', error)
    // Return empty array instead of throwing - road network is optional
    return []
  }

  return data || []
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
    console.log('[Realtime] Setting up Supabase subscriptions...')

    // Subscribe to plots changes
    const plotsChannel = supabase
      .channel('plots-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'plots' },
        (payload: RealtimePostgresChangesPayload<PlotRow>) => {
          console.log('[Realtime] Plot change detected:', payload.eventType)
          
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
        console.log('[Realtime] Plots subscription status:', status)
      })

    // Subscribe to overlays changes
    const overlaysChannel = supabase
      .channel('overlays-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'overlays' },
        (payload: RealtimePostgresChangesPayload<OverlayRow>) => {
          console.log('[Realtime] Overlay change detected:', payload.eventType)
          queryClient.invalidateQueries({ queryKey: ['overlays'] })
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Overlays subscription status:', status)
      })

    // Subscribe to spiritual_sites changes
    const sitesChannel = supabase
      .channel('spiritual-sites-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spiritual_sites' },
        (payload: RealtimePostgresChangesPayload<SpiritualSiteRow>) => {
          console.log('[Realtime] Spiritual site change detected:', payload.eventType)
          queryClient.invalidateQueries({ queryKey: ['spiritual_sites'] })
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Spiritual sites subscription status:', status)
      })

    // Cleanup subscriptions on unmount
    return () => {
      console.log('[Realtime] Cleaning up subscriptions...')
      supabase.removeChannel(plotsChannel)
      supabase.removeChannel(overlaysChannel)
      supabase.removeChannel(sitesChannel)
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
