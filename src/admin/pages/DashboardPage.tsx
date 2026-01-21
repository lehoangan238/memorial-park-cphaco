/**
 * Dashboard Page - Overview with stats and recent activity
 */
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { useDashboardStats } from '../hooks/useAdminData'

export function DashboardPage() {
  const { stats, loading, error } = useDashboardStats()

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of cemetery management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Plots"
          value={stats?.totalPlots || 0}
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Plots Sold"
          value={stats?.soldPlots || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Available"
          value={stats?.availablePlots || 0}
          icon={MapPin}
          color="orange"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plot Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plot Status Distribution</h3>
          <div className="space-y-4">
            <StatusBar
              label="Sold"
              value={stats?.soldPlots || 0}
              total={stats?.totalPlots || 1}
              color="bg-green-500"
            />
            <StatusBar
              label="Available"
              value={stats?.availablePlots || 0}
              total={stats?.totalPlots || 1}
              color="bg-blue-500"
            />
            <StatusBar
              label="Reserved"
              value={stats?.reservedPlots || 0}
              total={stats?.totalPlots || 1}
              color="bg-orange-500"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patrol Logs</h3>
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
              <p>No recent patrol logs</p>
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
        <span className="font-medium text-gray-900">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  )
}
