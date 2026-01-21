import { motion } from 'framer-motion'
import { 
  MapPin, 
  Users, 
  Flower2, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LandmarkQRCodes } from '@/components/LandmarkQRCodes'
import { parkStats, sections } from '@/data/parkData'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function StatsOverview() {
  const stats = [
    {
      label: 'Total Plots',
      value: parkStats.totalPlots,
      icon: MapPin,
      color: 'text-stone-700',
      bgColor: 'bg-stone-100',
    },
    {
      label: 'Available',
      value: parkStats.availablePlots,
      icon: TrendingUp,
      color: 'text-sage-dark',
      bgColor: 'bg-sage-light/50',
      badge: 'sage',
    },
    {
      label: 'Recent Visitors',
      value: parkStats.recentVisitors,
      icon: Users,
      color: 'text-sky-dark',
      bgColor: 'bg-sky/30',
    },
    {
      label: 'Flowers Left',
      value: parkStats.totalFlowers,
      icon: Flower2,
      color: 'text-gold-dark',
      bgColor: 'bg-gold-light/50',
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-stone-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold text-stone-900">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} rounded-lg p-2`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sections Overview */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              Park Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sections.map((section) => {
                const occupancyRate = ((section.totalPlots - section.availablePlots) / section.totalPlots) * 100
                
                return (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: section.color }}
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {section.name}
                        </p>
                        <p className="text-xs text-stone-600">
                          {section.availablePlots} available of {section.totalPlots}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${occupancyRate}%`,
                            backgroundColor: section.color,
                          }}
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(occupancyRate)}%
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-stone-800 to-stone-900 text-white cursor-pointer hover:from-stone-700 hover:to-stone-800 transition-colors">
                <Calendar className="w-6 h-6 text-gold mb-2" />
                <p className="font-medium">Schedule Visit</p>
                <p className="text-xs text-stone-400">Book a guided tour</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-sage to-sage-dark text-white cursor-pointer hover:from-sage-dark hover:to-sage transition-colors">
                <MapPin className="w-6 h-6 mb-2" />
                <p className="font-medium">Find a Plot</p>
                <p className="text-xs text-white/80">Browse available plots</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-gold to-gold-dark text-stone-900 cursor-pointer hover:from-gold-dark hover:to-gold transition-colors">
                <Flower2 className="w-6 h-6 mb-2" />
                <p className="font-medium">Leave Tribute</p>
                <p className="text-xs text-stone-700">Virtual flowers & notes</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-sky to-sky-dark text-white cursor-pointer hover:from-sky-dark hover:to-sky transition-colors">
                <Clock className="w-6 h-6 mb-2" />
                <p className="font-medium">Park Hours</p>
                <p className="text-xs text-white/80">Daily 8AM - 6PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* QR Code Directions for Landmarks */}
      <motion.div variants={item}>
        <LandmarkQRCodes />
      </motion.div>
    </motion.div>
  )
}
