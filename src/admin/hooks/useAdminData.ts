/**
 * Admin Data Hooks - Supabase integration
 */
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { PlotRow, StaffRow, StaffInsert, StaffUpdate, PatrolLogRow } from '@/types/database'

// Dashboard Stats type
interface DashboardStats {
  totalPlots: number
  soldPlots: number
  availablePlots: number
  reservedPlots: number
  totalRevenue: number
  recentPatrolLogs: PatrolLogRow[]
}

// ==================== PLOTS ====================
export function usePlots() {
  const [plots, setPlots] = useState<PlotRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlots = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('plots')
        .select('*')
        .order('name', { ascending: true })
      
      if (err) throw err
      setPlots((data as PlotRow[]) || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch plots')
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePlot = useCallback(async (name: string, updates: Partial<PlotRow>) => {
    try {
      const { error: err } = await supabase
        .from('plots')
        // @ts-expect-error - Supabase types don't match our schema
        .update(updates)
        .eq('name', name)
      
      if (err) throw err
      await fetchPlots()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Update failed' }
    }
  }, [fetchPlots])

  const updatePlotLocation = useCallback(async (name: string, lat: number, lng: number) => {
    return updatePlot(name, { lat, lng })
  }, [updatePlot])

  useEffect(() => {
    fetchPlots()
  }, [fetchPlots])

  return { plots, loading, error, fetchPlots, updatePlot, updatePlotLocation }
}

// ==================== STAFF ====================
export function useStaff() {
  const [staff, setStaff] = useState<StaffRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('staff')
        .select('*')
        .order('full_name', { ascending: true })
      
      if (err) throw err
      setStaff((data as StaffRow[]) || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch staff')
    } finally {
      setLoading(false)
    }
  }, [])

  const addStaff = useCallback(async (newStaff: StaffInsert) => {
    try {
      const { error: err } = await supabase
        .from('staff')
        // @ts-expect-error - Supabase types don't match our schema
        .insert({ ...newStaff, active: newStaff.active ?? true })
      
      if (err) throw err
      await fetchStaff()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Add failed' }
    }
  }, [fetchStaff])

  const updateStaff = useCallback(async (id: string, updates: StaffUpdate) => {
    try {
      const { error: err } = await supabase
        .from('staff')
        // @ts-expect-error - Supabase types don't match our schema
        .update(updates)
        .eq('id', id)
      
      if (err) throw err
      await fetchStaff()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Update failed' }
    }
  }, [fetchStaff])

  const deleteStaff = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('staff')
        .delete()
        .eq('id', id)
      
      if (err) throw err
      await fetchStaff()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Delete failed' }
    }
  }, [fetchStaff])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  return { staff, loading, error, fetchStaff, addStaff, updateStaff, deleteStaff }
}

// ==================== PATROL LOGS ====================
export function usePatrolLogs(limit?: number) {
  const [logs, setLogs] = useState<PatrolLogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('patrol_logs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (limit) {
        query = query.limit(limit)
      }
      
      const { data, error: err } = await query
      
      if (err) throw err
      setLogs((data as PatrolLogRow[]) || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch patrol logs')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return { logs, loading, error, fetchLogs }
}

// ==================== DASHBOARD STATS ====================
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch plots for stats
      const { data: plots, error: plotsErr } = await supabase
        .from('plots')
        .select('*')
      
      if (plotsErr) throw plotsErr

      // Fetch recent patrol logs
      const { data: logs } = await supabase
        .from('patrol_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      // Calculate stats
      const plotsData = (plots as PlotRow[]) || []
      const totalPlots = plotsData.length
      const soldPlots = plotsData.filter(p => p.status === 'Đã bán' || p.status === 'Đã an táng').length
      const availablePlots = plotsData.filter(p => p.status === 'Trống').length
      const reservedPlots = plotsData.filter(p => p.status === 'Đặt cọc').length
      const totalRevenue = plotsData.reduce((sum, p) => sum + (p.price || 0), 0)

      setStats({
        totalPlots,
        soldPlots,
        availablePlots,
        reservedPlots,
        totalRevenue,
        recentPatrolLogs: (logs as PatrolLogRow[]) || []
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, fetchStats }
}
