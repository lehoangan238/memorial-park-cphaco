/**
 * Dashboard Page - Overview with stats, charts and recent activity
 */
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Users, Clock, CheckCircle, AlertCircle, TrendingUp, Wifi, WifiOff } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StatCard } from '../components/StatCard'
import { useDashboardStats } from '../hooks/useAdminData'
import { usePlots } from '@/hooks/useMapData'

const COLORS = {
  'Trống': '#10B981',
  'Đã bán': '#EF4444',
  'Đặt cọc': '#F59E0B',
  'Đã an táng': '#6B7280',
  'Khác': '#9CA3AF'
}

export function DashboardPage() {
  const { stats, loading, error } = useDashboardStats()
  const { data: plots } = usePlots()

  // Calculate zone statistics
  const zoneStats = useMemo(() => {
    if (!plots) return []
    
    const zones: Record<string, { total: number; sold: number; available: number }> = {}
    
    plots.forEach(plot => {
      const zone = plot.zone || 'Khác'
      if (!zones[zone]) {
        zones[zone] = { total: 0, sold: 0, available: 0 }
      }
      zones[zone].total++
      if (plot.status === 'Đã bán' || plot.status === 'Đã an táng') {
        zones[zone].sold++
      } else if (plot.status === 'Trống') {
        zones[zone].available++
      }
    })
    
    return Object.entries(zones)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)
  }, [plots])

  // Calculate status distribution for pie chart
  const statusData = useMemo(() => {
    if (!stats) return []
    return [
      { name: 'Đã bán', value: stats.soldPlots, color: COLORS['Đã bán'] },
      { name: 'Còn trống', value: stats.availablePlots, color: COLORS['Trống'] },
      { name: 'Đặt cọc', value: stats.reservedPlots, color: COLORS['Đặt cọc'] },
    ].filter(item => item.value > 0)
  }, [stats])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <AlertCircle className="w-5 h-5 inline mr-2" />
        {error}
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header with Online Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Tổng quan hệ thống quản lý nghĩa trang</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
          navigator.onLine ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {navigator.onLine ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {navigator.onLine ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng số Plot"
          value={stats?.totalPlots || 0}
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Đã bán"
          value={stats?.soldPlots || 0}
          icon={CheckCircle}
          color="green"
          subtitle={stats?.totalPlots ? `${Math.round((stats.soldPlots / stats.totalPlots) * 100)}%` : undefined}
        />
        <StatCard
          title="Còn trống"
          value={stats?.availablePlots || 0}
          icon={MapPin}
          color="orange"
          subtitle={stats?.totalPlots ? `${Math.round((stats.availablePlots / stats.totalPlots) * 100)}%` : undefined}
        />
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Phân bố trạng thái Plot
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </motion.div>

        {/* Bar Chart - Zone Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê theo khu vực</h3>
          {zoneStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={zoneStats} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sold" name="Đã bán" fill="#EF4444" stackId="a" />
                <Bar dataKey="available" name="Còn trống" fill="#10B981" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiến độ bán hàng</h3>
          <div className="space-y-4">
            <StatusBar
              label="Đã bán"
              value={stats?.soldPlots || 0}
              total={stats?.totalPlots || 1}
              color="bg-red-500"
            />
            <StatusBar
              label="Còn trống"
              value={stats?.availablePlots || 0}
              total={stats?.totalPlots || 1}
              color="bg-green-500"
            />
            <StatusBar
              label="Đặt cọc"
              value={stats?.reservedPlots || 0}
              total={stats?.totalPlots || 1}
              color="bg-amber-500"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
          {stats?.recentPatrolLogs && stats.recentPatrolLogs.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPatrolLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {log.staff_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {log.plot_name} - {log.status}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có hoạt động gần đây</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function StatusBar({
  label,
  value,
  total,
  color
}: {
  label: string
  value: number
  total: number
  color: string
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  )
}
