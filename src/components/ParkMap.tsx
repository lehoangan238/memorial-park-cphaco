import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import Map, { 
  NavigationControl, 
  GeolocateControl, 
  ScaleControl, 
  Marker, 
  Popup,
  Source,
  Layer
} from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ZoomIn, 
  ZoomOut, 
  Layers,
  Navigation,
  Info,
  Menu,
  X,
  Loader2,
  AlertCircle,
  Church,
  Image,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMapData } from '@/hooks/useMapData'
import { supabasePublic } from '@/lib/supabase'
import type { PlotRow, OverlayRow, SpiritualSiteRow, PlotFeatureCollection } from '@/types/database'
import { cn, formatVNCurrency } from '@/lib/utils'
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre'

// Hoa Viên Nghĩa Trang Bình Dương coordinates (gate entrance)
const DEFAULT_CENTER = [106.651891, 11.168266] as const

const INITIAL_VIEW_STATE: {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
} = {
  longitude: DEFAULT_CENTER[0],
  latitude: DEFAULT_CENTER[1],
  zoom: 17,
  pitch: 0,
  bearing: 0
}

// Map style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const MAX_OVERLAY_RETRIES = 3
const OVERLAY_RETRY_COOLDOWN_MS = 4000
const OVERLAY_FETCH_TIMEOUT_MS = 10000
const OVERLAY_LABELS_HIDE_ZOOM = 18.6
const OVERLAY_LABEL_EXCLUDE_KEYWORDS = ['VONG XOAY'] as const

function normalizeLabelToken(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

function shouldHideOverlayLabel(overlay: OverlayRow): boolean {
  const labelCandidates = [overlay.display_name, overlay.name]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => normalizeLabelToken(value.trim()))

  return labelCandidates.some((label) =>
    OVERLAY_LABEL_EXCLUDE_KEYWORDS.some((keyword) => label.includes(keyword))
  )
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs)
    promise
      .then((value) => {
        clearTimeout(timeoutId)
        resolve(value)
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

function encodePathSegments(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment))
      } catch {
        return encodeURIComponent(segment)
      }
    })
    .join('/')
}

function extractOverlayStoragePath(url?: string | null): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)
    const marker = '/storage/v1/object/public/overlays/'
    const markerIndex = parsed.pathname.indexOf(marker)
    if (markerIndex === -1) return null

    const rawPath = parsed.pathname.slice(markerIndex + marker.length)
    if (!rawPath) return null

    try {
      return decodeURIComponent(rawPath)
    } catch {
      return rawPath
    }
  } catch {
    return null
  }
}

function toSupabasePublicOverlayUrl(path: string): string {
  const baseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
  const safePath = encodePathSegments(path)
  return `${baseUrl}/storage/v1/object/public/overlays/${safePath}`
}

function getOverlayCandidateUrls(overlay: OverlayRow, isMobile: boolean): string[] {
  const primary = isMobile ? overlay.url_mobile || overlay.url : overlay.url
  const secondary = isMobile ? overlay.url : overlay.url_mobile

  const candidates = [primary, secondary].filter((value): value is string => Boolean(value))

  for (const sourceUrl of [overlay.url, overlay.url_mobile]) {
    const path = extractOverlayStoragePath(sourceUrl)
    if (path) {
      candidates.push(toSupabasePublicOverlayUrl(path))
    }
  }

  return [...new Set(candidates)]
}

async function fetchOverlayObjectUrl(imageUrl: string): Promise<string> {
  const storagePath = extractOverlayStoragePath(imageUrl)
  if (storagePath) {
    try {
      const { data, error } = await withTimeout(
        supabasePublic.storage.from('overlays').download(storagePath),
        OVERLAY_FETCH_TIMEOUT_MS
      )

      if (!error && data) {
        return URL.createObjectURL(data)
      }
    } catch {
      // Fall back to direct fetch below.
    }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), OVERLAY_FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(imageUrl, {
      method: 'GET',
      mode: 'cors',
      cache: 'force-cache',
      signal: controller.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const blob = await response.blob()
    if (!blob || blob.size === 0) {
      throw new Error('Empty overlay image response')
    }

    return URL.createObjectURL(blob)
  } finally {
    clearTimeout(timeout)
  }
}

interface ParkMapProps {
  onPlotSelect: (plot: PlotRow | null) => void
  selectedPlot: PlotRow | null
  filterStatus: string
  flyToPlot?: PlotRow | null
}

// Circle layer paint for plots - hide when zoomed out (< 17)
const plotsCirclePaint = {
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    14.5, 0,    // Hidden at low zoom
    15.5, 2.5,
    16.5, 3.8,
    18, 5.2,
    19, 6.8,
    22, 10
  ],
  'circle-color': ['get', '_statusColor'],
  'circle-stroke-color': '#ffffff',
  'circle-stroke-width': [
    'interpolate',
    ['linear'],
    ['zoom'],
    14.5, 0,
    15.5, 0.55,
    16.5, 0.8,
    19, 1.1
  ],
  'circle-opacity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    14.5, 0,
    15.5, 0.5,
    16.5, 0.68,
    17, 0.78,
    19, 0.85
  ]
}

// Circle layer for hover effect - also hide when zoomed out
const plotsHoverPaint = {
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    14.5, 0,
    15.5, 5,
    16.5, 7.5,
    18, 9.5,
    19, 12.5,
    22, 18
  ],
  'circle-color': 'rgba(59, 130, 246, 0.3)',
  'circle-stroke-color': '#3B82F6',
  'circle-stroke-width': [
    'interpolate',
    ['linear'],
    ['zoom'],
    14.5, 0,
    15.5, 0.8,
    16.5, 1.3
  ]
}

export function ParkMap({ 
  onPlotSelect, 
  selectedPlot, 
  filterStatus,
  flyToPlot
}: ParkMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [mapInfo, setMapInfo] = useState(INITIAL_VIEW_STATE)
  const pendingViewStateRef = useRef(INITIAL_VIEW_STATE)
  const viewInfoRafRef = useRef<number | null>(null)
  const [showOverlays, setShowOverlays] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null)
  const [loadedOverlayIds, setLoadedOverlayIds] = useState<Set<string>>(new Set())
  const [mapReady, setMapReady] = useState(false)
  const [failedOverlayIds, setFailedOverlayIds] = useState<Set<string>>(new Set())
  const failedOverlayRetryRef = useRef<Record<string, { attempts: number; lastAttemptAt: number }>>({})
  const overlayObjectUrlsRef = useRef<Record<string, string>>({})
  const [selectedSpiritualSite, setSelectedSpiritualSite] = useState<SpiritualSiteRow | null>(null)
  const [loadingTimedOut, setLoadingTimedOut] = useState(false)
  const [geoLocateError, setGeoLocateError] = useState<string | null>(null)
  const [showLegendMobile, setShowLegendMobile] = useState(false)
  const [showMobileControlPanel, setShowMobileControlPanel] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setShowMobileControlPanel(false)
      setShowLegendMobile(false)
    }
  }, [isMobile])

  // Fetch data from Supabase
  const { 
    plots, 
    plotsGeoJSON, 
    overlays, 
    spiritualSites,
    isLoading, 
    isError, 
    error 
  } = useMapData()

  const hasPlotData = (plots?.length || 0) > 0 || (plotsGeoJSON?.features.length || 0) > 0

  useEffect(() => {
    if (!isLoading) {
      setLoadingTimedOut(false)
      return
    }

    const timer = setTimeout(() => {
      setLoadingTimedOut(true)
    }, 12000)

    return () => clearTimeout(timer)
  }, [isLoading])

  // Filter plots based on status only (search is handled by autocomplete)
  const filteredGeoJSON = useMemo<PlotFeatureCollection | null>(() => {
    if (!plotsGeoJSON) return null

    const filtered = plotsGeoJSON.features.filter(feature => {
      const props = feature.properties
      return filterStatus === 'all' || props.status === filterStatus
    })

    return {
      type: 'FeatureCollection',
      features: filtered
    }
  }, [plotsGeoJSON, filterStatus])

  const filteredPlotFallback = useMemo(() => {
    if (!plots || plots.length === 0) return [] as PlotRow[]
    return plots
      .filter(plot => (filterStatus === 'all' || plot.status === filterStatus))
      .filter(plot => isFinite(Number(plot.lng)) && isFinite(Number(plot.lat)))
      .slice(0, 400)
  }, [plots, filterStatus])

  const shouldShowPlotFallbackMarkers =
    !isLoading && !isError && filteredPlotFallback.length > 0 && (!filteredGeoJSON || filteredGeoJSON.features.length === 0)

  // Find hovered plot data
  const hoveredPlot = useMemo(() => {
    if (!hoveredPlotId || !plots) return null
    return plots.find(p => p.id === hoveredPlotId) || null
  }, [hoveredPlotId, plots])

  // Create GeoJSON for overlay labels (zone names like B1.2, B3.1)
  const overlayLabelsGeoJSON = useMemo(() => {
    if (!overlays || overlays.length === 0) return null

    // Group overlays by display_name using plain object
    const groups: Record<string, { lngs: number[], lats: number[], name: string }> = {}
    
    overlays
      .filter(overlay => overlay.is_visible !== false)
      .filter((overlay) => !shouldHideOverlayLabel(overlay))
      .forEach(overlay => {
        // Use display_name if available, otherwise use name
        const labelName = (overlay.display_name || overlay.name || '').trim()
        if (!labelName) return

        // Normalize key to prevent duplicates like "B2.2" vs "b2.2 "
        const groupKey = labelName.toUpperCase()

        const nwLng = Number(overlay.nw_lng)
        const seLng = Number(overlay.se_lng)
        const nwLat = Number(overlay.nw_lat)
        const seLat = Number(overlay.se_lat)

        if (!isFinite(nwLng) || !isFinite(seLng) || !isFinite(nwLat) || !isFinite(seLat)) {
          return
        }

        if (!groups[groupKey]) {
          groups[groupKey] = { lngs: [], lats: [], name: labelName }
        }
        
        // Add center point of this overlay to the group
        groups[groupKey].lngs.push((nwLng + seLng) / 2)
        groups[groupKey].lats.push((nwLat + seLat) / 2)
      })

    // Create features with averaged center points
    const features = Object.values(groups)
      .filter(group => group.lngs.length > 0 && group.lats.length > 0)
      .map(group => {
        const centerLng = group.lngs.reduce((a, b) => a + b, 0) / group.lngs.length
        const centerLat = group.lats.reduce((a, b) => a + b, 0) / group.lats.length

        return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [centerLng, centerLat]
        },
        properties: {
          name: group.name
        }
      }
    })

    return {
      type: 'FeatureCollection' as const,
      features
    }
  }, [overlays])

  // Create GeoJSON for close-zoom labels: one label per visible overlay
  const overlayPerImageLabelsGeoJSON = useMemo(() => {
    if (!overlays || overlays.length === 0) return null

    const features = overlays
      .filter(overlay => overlay.is_visible !== false)
      .filter((overlay) => !shouldHideOverlayLabel(overlay))
      .map((overlay) => {
        const labelName = (overlay.display_name || overlay.name || '').trim()
        const centerLng = (Number(overlay.nw_lng) + Number(overlay.se_lng)) / 2
        const centerLat = (Number(overlay.nw_lat) + Number(overlay.se_lat)) / 2

        if (!labelName || !isFinite(centerLng) || !isFinite(centerLat)) {
          return null
        }

        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [centerLng, centerLat]
          },
          properties: {
            name: labelName
          }
        }
      })
      .filter((feature): feature is NonNullable<typeof feature> => feature !== null)

    return {
      type: 'FeatureCollection' as const,
      features
    }
  }, [overlays])


  // Fly to plot when flyToPlot prop changes
  useEffect(() => {
    if (flyToPlot) {
      const map = mapRef.current?.getMap()
      if (map) {
        map.flyTo({
          center: [flyToPlot.lng, flyToPlot.lat],
          zoom: 19,
          pitch: 60,
          bearing: 0,
          duration: 700
        })
      }

      setMapInfo((prev) => ({
        ...prev,
        longitude: flyToPlot.lng,
        latitude: flyToPlot.lat,
        zoom: 19,
        pitch: 60,
        bearing: 0
      }))
    }
  }, [flyToPlot])

  // Helper function to check if overlay intersects with viewport bounds
  const isOverlayInViewport = useCallback((overlay: OverlayRow, bounds: maplibregl.LngLatBounds) => {
    const nwLng = Number(overlay.nw_lng)
    const nwLat = Number(overlay.nw_lat)
    const seLng = Number(overlay.se_lng)
    const seLat = Number(overlay.se_lat)

    if (!isFinite(nwLng) || !isFinite(nwLat) || !isFinite(seLng) || !isFinite(seLat)) {
      return false
    }

    // Check if overlay bounds intersect with viewport bounds
    const overlayWest = Math.min(nwLng, seLng)
    const overlayEast = Math.max(nwLng, seLng)
    const overlaySouth = Math.min(nwLat, seLat)
    const overlayNorth = Math.max(nwLat, seLat)

    const viewWest = bounds.getWest()
    const viewEast = bounds.getEast()
    const viewSouth = bounds.getSouth()
    const viewNorth = bounds.getNorth()

    // Expand viewport by 20% for preloading nearby overlays
    const expandX = (viewEast - viewWest) * 0.2
    const expandY = (viewNorth - viewSouth) * 0.2

    return !(
      overlayEast < viewWest - expandX ||
      overlayWest > viewEast + expandX ||
      overlayNorth < viewSouth - expandY ||
      overlaySouth > viewNorth + expandY
    )
  }, [])

  // Minimum zoom level to load overlays (helps weak mobile devices)
  const MIN_OVERLAY_ZOOM = isMobile ? 16.2 : 15.5

  // Lazy load overlays based on viewport - runs on map move
  const loadVisibleOverlays = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map || !mapReady || overlays.length === 0) return

    const currentZoom = map.getZoom()
    const bounds = map.getBounds()
    if (!bounds) return

    // If zoom is too low, hide all loaded overlays and don't load new ones
    if (currentZoom < MIN_OVERLAY_ZOOM) {
      loadedOverlayIds.forEach((overlayId) => {
        const layerId = `overlay-layer-${overlayId}`
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', 'none')
        }
      })
      return
    }

    // When zooming back in, show already loaded overlays again.
    loadedOverlayIds.forEach((overlayId) => {
      const layerId = `overlay-layer-${overlayId}`
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', showOverlays ? 'visible' : 'none')
      }
    })

    let newlyLoaded = 0

    // Keep per-cycle loading moderate to avoid frame drops while panning/zooming.
    const maxOverlaysToLoad = isMobile ? 4 : 16

    // Sort overlays by z_index (lower values load first, appear below)
    const sortedOverlays = [...overlays].sort((a, b) => (a.z_index ?? 0) - (b.z_index ?? 0))

    sortedOverlays.forEach((overlay: OverlayRow) => {
      // Stop if we've loaded enough overlays this round (mobile optimization)
      if (newlyLoaded >= maxOverlaysToLoad) return

      const sourceId = `overlay-${overlay.id}`
      const layerId = `overlay-layer-${overlay.id}`

      // Skip if already loaded
      if (loadedOverlayIds.has(overlay.id)) return

      // Retry failed overlays with cooldown instead of skipping forever.
      if (failedOverlayIds.has(overlay.id)) {
        const retry = failedOverlayRetryRef.current[overlay.id]
        if (!retry) return

        const reachedRetryLimit = retry.attempts >= MAX_OVERLAY_RETRIES
        const stillCoolingDown = Date.now() - retry.lastAttemptAt < OVERLAY_RETRY_COOLDOWN_MS
        if (reachedRetryLimit || stillCoolingDown) return
      }

      // Skip if not visible
      if (overlay.is_visible === false) return

      // Check if overlay is in viewport
      if (!isOverlayInViewport(overlay, bounds)) return

      // Ensure coordinates are numbers
      const nwLng = Number(overlay.nw_lng)
      const nwLat = Number(overlay.nw_lat)
      const seLng = Number(overlay.se_lng)
      const seLat = Number(overlay.se_lat)

      if (!isFinite(nwLng) || !isFinite(nwLat) || !isFinite(seLng) || !isFinite(seLat)) {
        return
      }

      // Image overlay coordinates: [top-left, top-right, bottom-right, bottom-left]
      const coordinates: [[number, number], [number, number], [number, number], [number, number]] = [
        [nwLng, nwLat], // Top Left (NW)
        [seLng, nwLat], // Top Right (NE)
        [seLng, seLat], // Bottom Right (SE)
        [nwLng, seLat]  // Bottom Left (SW)
      ]

      const candidateUrls = getOverlayCandidateUrls(overlay, isMobile)
      if (candidateUrls.length === 0) {
        return
      }

      // Load overlay image
      const loadOverlayImage = async () => {
        try {
          if (map.getSource(sourceId)) {
            setLoadedOverlayIds(prev => new Set([...prev, overlay.id]))
            return
          }

          let loaded = false
          let lastError: unknown = null

          for (const imageUrl of candidateUrls) {
            try {
              if (map.getLayer(layerId)) map.removeLayer(layerId)
              if (map.getSource(sourceId)) map.removeSource(sourceId)

              if (overlayObjectUrlsRef.current[overlay.id]) {
                URL.revokeObjectURL(overlayObjectUrlsRef.current[overlay.id])
                delete overlayObjectUrlsRef.current[overlay.id]
              }

              const localObjectUrl = await fetchOverlayObjectUrl(imageUrl)
              overlayObjectUrlsRef.current[overlay.id] = localObjectUrl

              map.addSource(sourceId, {
                type: 'image',
                url: localObjectUrl,
                coordinates: coordinates
              })

              const opacityValue = (overlay.opacity ?? 85) / 100

              map.addLayer({
                id: layerId,
                type: 'raster',
                source: sourceId,
                paint: {
                  'raster-opacity': opacityValue,
                  'raster-fade-duration': 300
                }
              })

              map.setLayoutProperty(layerId, 'visibility', showOverlays ? 'visible' : 'none')

              setLoadedOverlayIds(prev => new Set([...prev, overlay.id]))
              setFailedOverlayIds(prev => {
                if (!prev.has(overlay.id)) return prev
                const next = new Set(prev)
                next.delete(overlay.id)
                return next
              })
              delete failedOverlayRetryRef.current[overlay.id]
              console.log(`[Overlays] Loaded: ${overlay.name || overlay.id}`)

              const plotLayers = ['plots-circle', 'plots-hover', 'plots-selected']
              plotLayers.forEach(plotLayerId => {
                if (map.getLayer(plotLayerId)) {
                  map.moveLayer(plotLayerId)
                }
              })

              // Keep text labels above plot circles so markers do not hide labels.
              ;['overlay-labels-text', 'overlay-labels-close-text'].forEach((labelLayerId) => {
                if (map.getLayer(labelLayerId)) {
                  map.moveLayer(labelLayerId)
                }
              })

              loaded = true
              break
            } catch (innerErr) {
              lastError = innerErr
              continue
            }
          }

          if (!loaded) {
            throw lastError || new Error('No overlay URL candidate could be loaded')
          }
        } catch (err) {
          // Handle "already exists" error gracefully
          if (err instanceof Error && err.message.includes('already exists')) {
            console.log(`[Overlays] Already loaded: ${overlay.name || overlay.id}`)
            setLoadedOverlayIds(prev => new Set([...prev, overlay.id]))
            setFailedOverlayIds(prev => {
              if (!prev.has(overlay.id)) return prev
              const next = new Set(prev)
              next.delete(overlay.id)
              return next
            })
            delete failedOverlayRetryRef.current[overlay.id]
            return
          }

          const previousRetry = failedOverlayRetryRef.current[overlay.id]
          const nextAttempts = (previousRetry?.attempts || 0) + 1
          failedOverlayRetryRef.current[overlay.id] = {
            attempts: nextAttempts,
            lastAttemptAt: Date.now()
          }

          console.error(`[Overlays] Failed to load ${overlay.name || overlay.id}:`, err)
          setFailedOverlayIds(prev => new Set([...prev, overlay.id]))
        }
      }

      loadOverlayImage()
      newlyLoaded++
    })

    if (newlyLoaded > 0) {
      console.log(`[Overlays] Started loading ${newlyLoaded} overlays`)
    }
  }, [overlays, loadedOverlayIds, failedOverlayIds, mapReady, isOverlayInViewport, showOverlays, isMobile])

  // Initial load of visible overlays when map is ready
  useEffect(() => {
    if (mapReady && overlays.length > 0) {
      // Small delay to ensure map is fully rendered
      const timer = setTimeout(loadVisibleOverlays, 100)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, overlays.length]) // Purposely removed loadVisibleOverlays to prevent re-triggering on loaded overlays state changes

  // Clear loaded overlays when overlay data changes (e.g., image replaced)
  const overlayUrlsRef = useRef<Record<string, string>>({})
  
  useEffect(() => {
    const mapInstance = mapRef.current?.getMap()
    if (!mapInstance || !mapReady) return

    // Check if any overlay URLs have changed
    let hasChanges = false
    overlays.forEach(overlay => {
      const prevUrl = overlayUrlsRef.current[overlay.id]
      if (prevUrl && prevUrl !== overlay.url) {
        hasChanges = true
        // Remove old source and layer
        const layerId = `overlay-layer-${overlay.id}`
        const sourceId = `overlay-${overlay.id}`
        if (mapInstance.getLayer(layerId)) mapInstance.removeLayer(layerId)
        if (mapInstance.getSource(sourceId)) mapInstance.removeSource(sourceId)
        if (overlayObjectUrlsRef.current[overlay.id]) {
          URL.revokeObjectURL(overlayObjectUrlsRef.current[overlay.id])
          delete overlayObjectUrlsRef.current[overlay.id]
        }
        // Remove from loaded set so it will be reloaded
        setLoadedOverlayIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(overlay.id)
          return newSet
        })
        console.log(`[Overlays] URL changed for ${overlay.name}, will reload`)
      }
      overlayUrlsRef.current[overlay.id] = overlay.url
    })

    if (hasChanges) {
      // Trigger reload
      setTimeout(loadVisibleOverlays, 100)
    }
  }, [overlays, mapReady, loadVisibleOverlays])

  // Toggle overlay visibility for loaded overlays only
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    loadedOverlayIds.forEach((overlayId) => {
      const layerId = `overlay-layer-${overlayId}`
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', showOverlays ? 'visible' : 'none')
      }
    })
  }, [showOverlays, loadedOverlayIds])

  useEffect(() => {
    return () => {
      Object.values(overlayObjectUrlsRef.current).forEach((url) => {
        URL.revokeObjectURL(url)
      })
      overlayObjectUrlsRef.current = {}
    }
  }, [])

  useEffect(() => {
    return () => {
      if (viewInfoRafRef.current != null) {
        cancelAnimationFrame(viewInfoRafRef.current)
      }
    }
  }, [])

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    pendingViewStateRef.current = evt.viewState

    if (viewInfoRafRef.current != null) return

    viewInfoRafRef.current = requestAnimationFrame(() => {
      viewInfoRafRef.current = null
      setMapInfo(pendingViewStateRef.current)
    })
  }, [])

  const handleMoveEnd = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (map) {
      setMapInfo({
        longitude: map.getCenter().lng,
        latitude: map.getCenter().lat,
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing()
      })
    }

    loadVisibleOverlays()
  }, [loadVisibleOverlays])

  const bringOverlayLabelsToFront = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    ;['overlay-labels-text', 'overlay-labels-close-text'].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.moveLayer(layerId)
      }
    })
  }, [])

  useEffect(() => {
    if (!mapReady) return
    bringOverlayLabelsToFront()
  }, [mapReady, hoveredPlotId, selectedPlot, overlayLabelsGeoJSON, overlayPerImageLabelsGeoJSON, bringOverlayLabelsToFront])

  const handleZoomIn = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    map.easeTo({ zoom: Math.min(map.getZoom() + 1, 22), duration: 180 })
  }, [])

  const handleZoomOut = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    map.easeTo({ zoom: Math.max(map.getZoom() - 1, 10), duration: 180 })
  }, [])

  const handleReset = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    map.easeTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      pitch: INITIAL_VIEW_STATE.pitch,
      bearing: INITIAL_VIEW_STATE.bearing,
      duration: 350
    })
  }, [])

  // Handle plot click
  const handlePlotClick = useCallback((e: MapLayerMouseEvent) => {
    if (!e.features || e.features.length === 0) {
      setSelectedSpiritualSite(null)
      return
    }
    
    const feature = e.features[0]
    const props = feature.properties as PlotRow
    
    // Zoom to the clicked plot
    const map = mapRef.current?.getMap()
    if (map) {
      map.easeTo({
        center: [props.lng, props.lat],
        zoom: Math.max(map.getZoom(), 18),
        duration: 250
      })
    }
    
    setSelectedSpiritualSite(null)
    onPlotSelect(props)
  }, [onPlotSelect])

  const handleSpiritualSiteClick = useCallback((site: SpiritualSiteRow, event: React.MouseEvent) => {
    event.stopPropagation()
    onPlotSelect(null)
    setSelectedSpiritualSite(site)
  }, [onPlotSelect])

  const handleOpenDirectionsToSpiritualSite = useCallback(() => {
    if (!selectedSpiritualSite) return
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedSpiritualSite.lat},${selectedSpiritualSite.lng}&travelmode=walking`
    window.open(directionsUrl, '_blank', 'noopener,noreferrer')
  }, [selectedSpiritualSite])

  // Handle plot hover
  const handlePlotHover = useCallback((e: MapLayerMouseEvent) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0]
      setHoveredPlotId(feature.properties?.id || null)
    } else {
      setHoveredPlotId(null)
    }
  }, [])

  const handlePlotLeave = useCallback(() => {
    setHoveredPlotId(null)
  }, [])

  // Handle map load
  const handleMapLoad = useCallback(() => {
    console.log('[Map] Map loaded and ready')
    setMapReady(true)
  }, [])

  // Loading state
  if (isLoading && !hasPlotData && !loadingTimedOut) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-stone-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-stone-600 font-medium">Đang tải dữ liệu bản đồ...</p>
        </div>
      </div>
    )
  }

  // Timed out loading state when core plot data is still unavailable
  if (isLoading && !hasPlotData && loadingTimedOut) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-stone-100">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-stone-900 font-medium mb-2">Dữ liệu đang phản hồi quá chậm</p>
          <p className="text-stone-600 text-sm mb-4">Không lấy được danh sách vị trí trong thời gian chờ. Vui lòng thử tải lại.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Tải lại
          </Button>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-stone-100">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-stone-900 font-medium mb-2">Không thể tải dữ liệu</p>
          <p className="text-stone-600 text-sm mb-4">{error?.message || 'Đã có lỗi xảy ra'}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      {loadingTimedOut && (
        <div className={cn(
          'absolute left-1/2 -translate-x-1/2 z-30 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 shadow',
          isMobile ? 'top-[88px] w-[calc(100%-1rem)] max-w-md' : 'top-4'
        )}>
          <p className="text-sm text-amber-800">
            Dữ liệu đang tải chậm. Bản đồ đã mở, bạn có thể thử tải lại sau.
          </p>
        </div>
      )}

      {shouldShowPlotFallbackMarkers && (
        <div className={cn(
          'absolute left-1/2 -translate-x-1/2 z-30 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 shadow',
          isMobile ? 'top-[132px] w-[calc(100%-1rem)] max-w-md' : 'top-16'
        )}>
          <p className="text-sm text-blue-800">
            Đang dùng lớp hiển thị dự phòng cho vị trí. Dữ liệu vẫn đang có sẵn.
          </p>
        </div>
      )}

      {geoLocateError && (
        <div className={cn(
          'absolute left-1/2 -translate-x-1/2 z-30 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 shadow',
          isMobile ? 'top-[176px] w-[calc(100%-1rem)] max-w-md' : 'top-28'
        )}>
          <p className="text-sm text-rose-800">{geoLocateError}</p>
        </div>
      )}

      {/* MapLibre GL Map */}
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        onLoad={handleMapLoad}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
        interactiveLayerIds={['plots-circle']}
        onClick={handlePlotClick}
        onMouseMove={handlePlotHover}
        onMouseLeave={handlePlotLeave}
        cursor={hoveredPlotId ? 'pointer' : 'grab'}
      >
        {/* Navigation Controls */}
        {!isMobile && <NavigationControl position="bottom-right" showCompass showZoom={false} />}
        <GeolocateControl 
          position="bottom-right"
          positionOptions={{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }}
          trackUserLocation
          onError={(event) => {
            const message = (event as { message?: string } | undefined)?.message || 'Không thể lấy vị trí hiện tại. Hãy bật quyền truy cập vị trí cho trình duyệt.'
            setGeoLocateError(message)
          }}
          onGeolocate={() => {
            setGeoLocateError(null)
          }}
        />
        {!isMobile && <ScaleControl position="bottom-left" />}

        {/* Overlay Zone Labels - show zone names like B1.2, B3.1 */}
        {overlayLabelsGeoJSON && (
          <Source id="overlay-labels" type="geojson" data={overlayLabelsGeoJSON}>
            <Layer
              id="overlay-labels-text"
              type="symbol"
              layout={{
                'text-field': ['get', 'name'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14, 16,
                  16, 14,
                  16.8, 10,
                  17, 0
                ],
                'text-anchor': 'center',
                'text-allow-overlap': false,
                'text-ignore-placement': false,
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
              }}
              paint={{
                'text-color': '#1e40af',
                'text-halo-color': '#ffffff',
                'text-halo-width': 2,
                'text-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14, 1,
                  16.6, 0.65,
                  17, 0
                ]
              }}
            />
          </Source>
        )}

        {/* Overlay Labels (Close Zoom) - one label per overlay image */}
        {overlayPerImageLabelsGeoJSON && (
          <Source id="overlay-labels-close" type="geojson" data={overlayPerImageLabelsGeoJSON}>
            <Layer
              id="overlay-labels-close-text"
              type="symbol"
              layout={{
                'text-field': ['get', 'name'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  16.8, 0,
                  17, 11,
                  18, 12,
                  OVERLAY_LABELS_HIDE_ZOOM, 0,
                  22, 0
                ],
                'text-anchor': 'center',
                'text-allow-overlap': true,
                'text-ignore-placement': true,
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
              }}
              paint={{
                'text-color': '#1e3a8a',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1.8,
                'text-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  16.8, 0,
                  17, 0.75,
                  18, 0.9,
                  OVERLAY_LABELS_HIDE_ZOOM, 0,
                  22, 0
                ]
              }}
            />
          </Source>
        )}

        {/* GeoJSON Source for Plots */}
        {filteredGeoJSON && (
          <Source id="plots" type="geojson" data={filteredGeoJSON}>

            {/* Main circle layer */}
            <Layer
              id="plots-circle"
              type="circle"
              paint={plotsCirclePaint as never}
            />
            {/* Plot ID labels - HIDDEN per user request */}
            {/* <Layer
              id="plots-labels"
              type="symbol"
              layout={{
                'text-field': ['get', 'name'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  18, 0,
                  19, 10,
                  20, 12,
                  22, 14
                ],
                'text-offset': [0, 1.5],
                'text-anchor': 'top',
                'text-allow-overlap': false,
                'text-ignore-placement': false,
                'text-optional': true
              }}
              paint={{
                'text-color': '#374151',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1.5,
                'text-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  18, 0,
                  19, 1
                ]
              }}
            /> */}
            {/* Hover highlight layer */}
            {hoveredPlotId && (
              <Layer
                id="plots-hover"
                type="circle"
                filter={['==', ['get', 'id'], hoveredPlotId]}
                paint={plotsHoverPaint as never}
              />
            )}
            {/* Selected plot highlight */}
            {selectedPlot && (
              <Layer
                id="plots-selected"
                type="circle"
                filter={['==', ['get', 'id'], selectedPlot.id]}
                paint={{
                  'circle-radius': [
                    'interpolate', ['linear'], ['zoom'],
                    14, 10, 17, 16, 19, 24, 22, 32
                  ],
                  'circle-color': 'rgba(59, 130, 246, 0.2)',
                  'circle-stroke-color': '#2563EB',
                  'circle-stroke-width': 3
                } as never}
              />
            )}
          </Source>
        )}

        {/* Hovered Plot Popup */}
        {hoveredPlot && (
          <Popup
            longitude={hoveredPlot.lng}
            latitude={hoveredPlot.lat}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
            offset={20}
          >
            <div className="p-3 min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-stone-900">{hoveredPlot.name || 'Chưa đặt tên'}</span>
                <Badge 
                  variant={hoveredPlot.status === 'Trống' ? 'sage' : 'secondary'} 
                  className="text-[10px] py-0"
                >
                  {hoveredPlot.status}
                </Badge>
              </div>
              {hoveredPlot.zone && (
                <p className="text-xs text-stone-500">Khu {hoveredPlot.zone}</p>
              )}
              {hoveredPlot.deceased_name && (
                <p className="text-sm text-stone-600 mt-1">{hoveredPlot.deceased_name}</p>
              )}
              {hoveredPlot.price && (
                <p className="text-xs font-semibold text-amber-600 mt-1">
                  {formatVNCurrency(hoveredPlot.price)} VNĐ
                </p>
              )}
              {hoveredPlot.area && (
                <p className="text-xs text-stone-500 mt-0.5">
                  Diện tích: {hoveredPlot.area} m²
                </p>
              )}
            </div>
          </Popup>
        )}

        {/* Spiritual Sites Markers */}
        <AnimatePresence>
          {shouldShowPlotFallbackMarkers && filteredPlotFallback.map((plot) => (
            <Marker
              key={`fallback-plot-${plot.id}`}
              longitude={Number(plot.lng)}
              latitude={Number(plot.lat)}
              anchor="center"
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setSelectedSpiritualSite(null)
                  onPlotSelect(plot)
                }}
                className="h-2.5 w-2.5 rounded-full border border-white bg-emerald-600 shadow"
                aria-label={`Chọn vị trí ${plot.name || plot.id}`}
              />
            </Marker>
          ))}

          {showMarkers && spiritualSites
            .filter(site => isFinite(Number(site.lng)) && isFinite(Number(site.lat)))
            .map((site: SpiritualSiteRow) => (
            <Marker
              key={site.id}
              longitude={Number(site.lng)}
              latitude={Number(site.lat)}
              anchor="bottom"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="cursor-pointer"
                    >
                      <button
                        type="button"
                        onClick={(event) => handleSpiritualSiteClick(site, event)}
                        className="focus:outline-none"
                        aria-label={`Xem chi tiết ${site.name}`}
                      >
                        <div className="relative flex flex-col items-center">
                          <div
                            className={cn(
                              'w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-[3px] transition-all',
                              selectedSpiritualSite?.id === site.id
                                ? 'bg-amber-500 border-white scale-110'
                                : 'bg-slate-500 border-white'
                            )}
                          >
                            <Church className="w-4 h-4 text-white" />
                          </div>
                          <div
                            className={cn(
                              'w-3 h-3 -mt-1 rotate-45 rounded-[2px] shadow-sm',
                              selectedSpiritualSite?.id === site.id ? 'bg-amber-500' : 'bg-slate-500'
                            )}
                          />
                          <div className="w-2 h-2 -mt-1 rounded-full bg-white" />
                        </div>
                      </button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="font-medium text-sm">{site.name}</p>
                    {site.type && (
                      <p className="text-xs text-stone-500">{site.type}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Marker>
          ))}
        </AnimatePresence>
      </Map>

      {/* Spiritual Site Detail Panel (Google Maps-style) */}
      <AnimatePresence>
        {selectedSpiritualSite && (
          <motion.aside
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'absolute z-20 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden',
              isMobile
                ? 'left-3 right-3 bottom-3 w-auto'
                : 'top-20 left-4 w-[min(360px,calc(100vw-2rem))]'
            )}
          >
            {selectedSpiritualSite.image_url ? (
              <img
                src={selectedSpiritualSite.image_url}
                alt={selectedSpiritualSite.name}
                draggable={false}
                className={cn('w-full object-cover select-none', isMobile ? 'h-36' : 'h-44')}
                style={{ touchAction: 'none' }}
              />
            ) : (
              <div className={cn('w-full bg-stone-100 border-b border-stone-200 flex items-center justify-center text-stone-500 text-sm', isMobile ? 'h-36' : 'h-44')}>
                Chưa có hình ảnh
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold text-stone-900 leading-tight">{selectedSpiritualSite.name}</h3>
                  <p className="text-sm text-stone-500 mt-1">{selectedSpiritualSite.type || 'Điểm tâm linh'}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSpiritualSite(null)}
                  className="h-8 px-3"
                >
                  Đóng
                </Button>
              </div>

              <div className="mt-4 rounded-lg bg-stone-50 border border-stone-200 px-3 py-2">
                <p className="text-xs text-stone-500">Tọa độ</p>
                <p className="text-sm font-mono text-stone-700 mt-1">
                  {selectedSpiritualSite.lat.toFixed(6)}, {selectedSpiritualSite.lng.toFixed(6)}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleOpenDirectionsToSpiritualSite}
                className="w-full mt-3"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Chỉ đường bằng Google Maps
              </Button>

              {selectedSpiritualSite.image_url && (
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={selectedSpiritualSite.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700"
                  >
                    Xem ảnh gốc
                  </a>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Custom Map Controls Overlay */}
      {isMobile ? (
        <div
          className="absolute right-3 z-10 flex flex-col items-end gap-2"
          style={{ bottom: 'max(4.5rem, calc(env(safe-area-inset-bottom) + 3.5rem))' }}
        >
          <AnimatePresence>
            {showMobileControlPanel && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="glass rounded-2xl p-1.5 flex flex-col gap-1"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  className="h-11 w-11 cursor-pointer hover:bg-stone-100"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  className="h-11 w-11 cursor-pointer hover:bg-stone-100"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="h-11 w-11 cursor-pointer hover:bg-stone-100"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMarkers(!showMarkers)}
                  className={cn('h-11 w-11 cursor-pointer hover:bg-stone-100', showMarkers && 'bg-stone-100')}
                >
                  <Layers className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={cn('h-11 w-11 cursor-pointer hover:bg-stone-100', showOverlays && 'bg-stone-100')}
                >
                  <Image className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLegendMobile(!showLegendMobile)}
                  className={cn('h-11 w-11 cursor-pointer hover:bg-stone-100', showLegendMobile && 'bg-stone-100')}
                >
                  <Info className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowMobileControlPanel((prev) => !prev)}
            className="h-12 w-12 rounded-full shadow-lg border-stone-300 bg-white/95 cursor-pointer"
            aria-label={showMobileControlPanel ? 'Đóng điều khiển bản đồ' : 'Mở điều khiển bản đồ'}
          >
            {showMobileControlPanel ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      ) : (
        <div className="absolute right-3 sm:right-4 top-4 z-10 flex flex-col gap-2">
          <div className="glass rounded-xl p-1 flex flex-col gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomIn}
                    className="h-8 w-8 cursor-pointer hover:bg-stone-100"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Phóng to</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomOut}
                    className="h-8 w-8 cursor-pointer hover:bg-stone-100"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Thu nhỏ</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-8 w-8 cursor-pointer hover:bg-stone-100"
                  >
                    <Navigation className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Đặt lại góc nhìn</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMarkers(!showMarkers)}
                    className={cn('h-8 w-8 cursor-pointer hover:bg-stone-100', showMarkers && 'bg-stone-100')}
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Bật/tắt điểm đánh dấu</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowOverlays(!showOverlays)}
                    className={cn('h-8 w-8 cursor-pointer hover:bg-stone-100', showOverlays && 'bg-stone-100')}
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Bật/tắt lớp phủ</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="absolute bottom-4 left-4 z-10 glass rounded-xl p-3">
          <p className="text-xs font-medium text-stone-700 mb-2">Chú thích</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
              <span className="text-xs text-stone-600">Trống</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
              <span className="text-xs text-stone-600">Đã bán</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-xs text-stone-600">Đặt cọc</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6B7280' }} />
              <span className="text-xs text-stone-600">Đã an táng</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-3 pt-2 border-t border-stone-200 space-y-1">
            <p className="text-xs text-stone-500">
              Vị trí: <span className="font-medium text-stone-700">{filteredGeoJSON?.features.length || 0}</span> / {plots.length}
            </p>
            <p className="text-xs text-stone-500">
              Lớp phủ: <span className="font-medium text-stone-700">{loadedOverlayIds.size}</span> / {overlays.length}
              {loadedOverlayIds.size > 0 && showOverlays && <span className="text-emerald-600"> ✓</span>}
              {!showOverlays && <span className="text-amber-600 text-[10px] ml-1">(tắt)</span>}
              {failedOverlayIds.size > 0 && <span className="text-red-500 text-[10px] ml-1">({failedOverlayIds.size} lỗi)</span>}
            </p>
            <p className="text-xs text-stone-500">
              Tâm linh: <span className="font-medium text-stone-700">{spiritualSites.length}</span>
            </p>
          </div>
        </div>
      )}

      {isMobile && showLegendMobile && (
        <div
          className="absolute left-3 right-3 z-10 glass rounded-xl p-3"
          style={{ bottom: 'max(4.5rem, calc(env(safe-area-inset-bottom) + 3.5rem))' }}
        >
          <p className="text-xs font-medium text-stone-700 mb-2">Chú thích nhanh</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
              <span className="text-xs text-stone-600">Trống</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
              <span className="text-xs text-stone-600">Đã bán</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-xs text-stone-600">Đặt cọc</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6B7280' }} />
              <span className="text-xs text-stone-600">Đã an táng</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-stone-200 space-y-1">
            <p className="text-xs text-stone-500">
              Vị trí: <span className="font-medium text-stone-700">{filteredGeoJSON?.features.length || 0}</span> / {plots.length}
            </p>
            <p className="text-xs text-stone-500">
              Lớp phủ: <span className="font-medium text-stone-700">{loadedOverlayIds.size}</span> / {overlays.length}
            </p>
          </div>
        </div>
      )}

      {/* Coordinates Display */}
      {!isMobile && (
        <div className="absolute top-4 left-4 z-10 glass rounded-xl px-3 py-2">
          <p className="text-xs text-stone-600 font-mono">
            {mapInfo.latitude.toFixed(4)}°N, {mapInfo.longitude.toFixed(4)}°E | Zoom: {mapInfo.zoom.toFixed(1)}
          </p>
        </div>
      )}
    </div>
  )
}
