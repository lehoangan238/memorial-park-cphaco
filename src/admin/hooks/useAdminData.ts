import { logger } from '@/lib/logger'
/**
 * Admin Data Hooks - Supabase integration
 */
import { useState, useEffect, useCallback } from 'react'
import { supabase, supabasePublic } from '@/lib/supabase'
import type { PlotRow, PlotUpdate, StaffRow, StaffInsert, StaffUpdate, PatrolLogRow } from '@/types/database'

// Dashboard Stats type
interface DashboardStats {
  totalPlots: number
  soldPlots: number
  availablePlots: number
  reservedPlots: number
  totalRevenue: number
  recentPatrolLogs: PatrolLogRow[]
}

function isAbortLikeError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return (
    error.name === 'AbortError' ||
    error.message.includes('AbortError') ||
    error.message.includes('signal is aborted')
  )
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
      const pageSize = 500
      let from = 0
      const allRows: PlotRow[] = []

      while (true) {
        const { data, error: err } = await supabase
          .from('plots')
          .select('*')
          .order('name', { ascending: true })
          .range(from, from + pageSize - 1)

        if (err) throw err

        const rows = (data as PlotRow[]) || []
        allRows.push(...rows)

        if (rows.length < pageSize) break
        from += pageSize
      }

      setPlots(allRows)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch plots')
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePlot = useCallback(async (name: string, updates: PlotUpdate) => {
    try {
      const { error: err } = await supabase
        .from('plots')
        .update(updates as never)
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
        .insert({ ...newStaff, active: newStaff.active ?? true } as never)
      
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
        .update(updates as never)
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
      const { data: plots, error: plotsErr } = await supabasePublic
        .from('plots')
        .select('*')
      
      if (plotsErr) {
        const isAbort = plotsErr.message?.includes('AbortError') || plotsErr.message?.includes('signal is aborted')
        if (isAbort) throw new Error('AbortError')
        throw plotsErr
      }

      // Fetch recent patrol logs
      const { data: logs } = await supabasePublic
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
      if (isAbortLikeError(e)) {
        logger.warn('[DashboardStats] Request aborted, retrying once with public client...')
        try {
          const { data: plots2, error: plotsErr2 } = await supabasePublic.from('plots').select('*')
          if (plotsErr2) throw plotsErr2
          const { data: logs2 } = await supabasePublic.from('patrol_logs').select('*').order('created_at', { ascending: false }).limit(5)
          const plotsData = (plots2 as PlotRow[]) || []
          setStats({
            totalPlots: plotsData.length,
            soldPlots: plotsData.filter(p => p.status === 'Đã bán' || p.status === 'Đã an táng').length,
            availablePlots: plotsData.filter(p => p.status === 'Trống').length,
            reservedPlots: plotsData.filter(p => p.status === 'Đặt cọc').length,
            totalRevenue: plotsData.reduce((sum, p) => sum + (p.price || 0), 0),
            recentPatrolLogs: (logs2 as PatrolLogRow[]) || []
          })
          return
        } catch {
          // Retry also failed; keep old stats and suppress transient abort UI.
          return
        }
      }
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


// Import thêm types
import type { DeceasedRow, DeceasedInsert, DeceasedUpdate, CustomerRow, CustomerInsert, CustomerUpdate } from '@/types/database'

// ==================== DECEASED (Người mất) ====================
export function useDeceased() {
  const [deceased, setDeceased] = useState<DeceasedRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeceased = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('deceased')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (err) throw err
      setDeceased((data as DeceasedRow[]) || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch deceased')
    } finally {
      setLoading(false)
    }
  }, [])

  const addDeceased = useCallback(async (newItem: DeceasedInsert) => {
    try {
      const { error: err } = await supabase
        .from('deceased')
        .insert(newItem as never)
      
      if (err) throw err
      await fetchDeceased()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Add failed' }
    }
  }, [fetchDeceased])

  const updateDeceased = useCallback(async (id: string, updates: DeceasedUpdate) => {
    try {
      const { error: err } = await supabase
        .from('deceased')
        .update(updates as never)
        .eq('id', id)
      
      if (err) throw err
      await fetchDeceased()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Update failed' }
    }
  }, [fetchDeceased])

  const deleteDeceased = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('deceased')
        .delete()
        .eq('id', id)
      
      if (err) throw err
      await fetchDeceased()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Delete failed' }
    }
  }, [fetchDeceased])

  useEffect(() => {
    fetchDeceased()
  }, [fetchDeceased])

  return { deceased, loading, error, fetchDeceased, addDeceased, updateDeceased, deleteDeceased }
}

// ==================== CUSTOMERS (Khách hàng) ====================
export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (err) throw err
      setCustomers((data as CustomerRow[]) || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }, [])

  const addCustomer = useCallback(async (newItem: CustomerInsert) => {
    try {
      const { error: err } = await supabase
        .from('customers')
        .insert(newItem as never)
      
      if (err) throw err
      await fetchCustomers()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Add failed' }
    }
  }, [fetchCustomers])

  const updateCustomer = useCallback(async (id: string, updates: CustomerUpdate) => {
    try {
      const { error: err } = await supabase
        .from('customers')
        .update(updates as never)
        .eq('id', id)
      
      if (err) throw err
      await fetchCustomers()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Update failed' }
    }
  }, [fetchCustomers])

  const deleteCustomer = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      
      if (err) throw err
      await fetchCustomers()
      return { success: true }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Delete failed' }
    }
  }, [fetchCustomers])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  return { customers, loading, error, fetchCustomers, addCustomer, updateCustomer, deleteCustomer }
}

