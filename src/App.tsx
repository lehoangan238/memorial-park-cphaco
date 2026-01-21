import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/Header'
import { ParkMap } from '@/components/ParkMap'
import { GraveDetailsPanel } from '@/components/GraveDetailsPanel'
import { StatsOverview } from '@/components/StatsOverview'
import { FilterBar } from '@/components/FilterBar'
import { RoutingPanel } from '@/components/RoutingPanel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Grave, PlotStatus } from '@/types'
import type { OSRMRoute } from '@/lib/routing'

function App() {
  const [selectedGrave, setSelectedGrave] = useState<Grave | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<PlotStatus | 'all'>('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('map')
  const [flyToGrave, setFlyToGrave] = useState<Grave | null>(null)
  const [routingDestination, setRoutingDestination] = useState<Grave | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [osrmRoute, setOsrmRoute] = useState<OSRMRoute | null>(null)

  const handleGraveSelect = useCallback((grave: Grave | null) => {
    setSelectedGrave(grave)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleSearchResultSelect = useCallback((grave: Grave) => {
    // Switch to map tab if not already
    setActiveTab('map')
    // Close mobile menu
    setIsMenuOpen(false)
    // Set the grave to fly to (triggers map animation)
    setFlyToGrave(grave)
    // Select the grave (opens details panel)
    setSelectedGrave(grave)
    // Clear flyToGrave after a short delay to allow re-selection of same grave
    setTimeout(() => setFlyToGrave(null), 100)
  }, [])

  const handleFilterChange = useCallback((filter: PlotStatus | 'all') => {
    setFilterStatus(filter)
  }, [])

  const handleStartRouting = useCallback((grave: Grave) => {
    setRoutingDestination(grave)
    setActiveTab('map')
    // Close details panel when routing starts
    setSelectedGrave(null)
  }, [])

  const handleStopRouting = useCallback(() => {
    setRoutingDestination(null)
    setOsrmRoute(null)
  }, [])

  const handleRouteReady = useCallback((route: OSRMRoute | null) => {
    setOsrmRoute(route)
  }, [])

  return (
    <div className="relative min-h-screen bg-background">
      {/* Full-Screen Map Background */}
      {activeTab === 'map' && (
        <div className="fixed inset-0 z-0">
          <ParkMap
            onGraveSelect={handleGraveSelect}
            selectedGrave={selectedGrave}
            searchQuery={searchQuery}
            filterStatus={filterStatus}
            flyToGrave={flyToGrave}
            routingDestination={routingDestination}
            userLocation={userLocation}
            onUserLocationChange={setUserLocation}
            osrmRoute={osrmRoute}
          />
        </div>
      )}

      {/* Header */}
      <Header
        onSearch={handleSearch}
        onSearchResultSelect={handleSearchResultSelect}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      {/* Main Content - Overlay on Map */}
      <main className="relative z-10 pt-24 pb-8 px-4 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 pointer-events-auto"
          >
            <div className="glass rounded-2xl px-6 py-4 inline-block">
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-stone-900 mb-2">
                Hoa Viên Nghĩa Trang Bình Dương
              </h1>
              <p className="text-stone-600 max-w-xl mx-auto text-sm md:text-base">
                Nơi an nghỉ vĩnh hằng - Tôn vinh ký ức muôn đời
              </p>
            </div>
          </motion.section>

          {/* Tabs Section */}
          <Tabs 
            defaultValue="map" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-4 pointer-events-auto">
              <TabsList className="grid w-full max-w-xs grid-cols-2 glass">
                <TabsTrigger value="map">Bản đồ</TabsTrigger>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="map" className="space-y-4">
              {/* Filter Bar */}
              <div className="flex justify-center pointer-events-auto">
                <div className="glass rounded-xl">
                  <FilterBar
                    activeFilter={filterStatus}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="pointer-events-auto">
              <StatsOverview />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Grave Details Panel */}
      <GraveDetailsPanel 
        grave={selectedGrave} 
        onClose={() => setSelectedGrave(null)} 
        onStartRouting={handleStartRouting}
      />

      {/* Routing Panel */}
      <AnimatePresence>
        {routingDestination && (
          <RoutingPanel
            destination={routingDestination}
            onClose={handleStopRouting}
            userLocation={userLocation}
            onRouteReady={handleRouteReady}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
