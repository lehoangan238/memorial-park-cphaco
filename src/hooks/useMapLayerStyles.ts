import { useMemo } from 'react'
import { STATUS_COLORS, getStatusColor } from '@/constants/cemetery'

/**
 * MapLibre GL expression types for dynamic styling
 */
type InterpolateExpression = [
  'interpolate',
  ['linear'],
  ['zoom'],
  ...number[]
]

type GetExpression = ['get', string]

/**
 * Check if current device is mobile
 * Uses user agent detection for responsive map styling
 */
function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * Plot circle layer paint properties
 */
export interface PlotCirclePaint {
  'circle-radius': InterpolateExpression
  'circle-color': GetExpression | string
  'circle-stroke-color': string
  'circle-stroke-width': number
  'circle-pitch-scale': 'map' | 'viewport'
}

/**
 * Hold indicator layer paint properties (ring around held plots)
 */
export interface PlotHoldPaint {
  'circle-radius': InterpolateExpression
  'circle-color': string
  'circle-stroke-color': string
  'circle-stroke-width': number
  'circle-opacity': number
  'circle-pitch-scale': 'map' | 'viewport'
}

/**
 * Hold glow layer paint properties (blur effect behind held plots)
 */
export interface PlotHoldGlowPaint {
  'circle-radius': InterpolateExpression
  'circle-color': string
  'circle-blur': number
  'circle-pitch-scale': 'map' | 'viewport'
}

/**
 * Hit area layer paint properties (invisible larger circles for easier tapping)
 */
export interface PlotHitPaint {
  'circle-radius': InterpolateExpression
  'circle-color': string
}

/**
 * All map layer styles returned by the hook
 */
export interface MapLayerStyles {
  /** Main plot circle paint properties */
  plotsCircle: PlotCirclePaint
  /** Hold indicator ring paint properties */
  plotsHold: PlotHoldPaint
  /** Hold glow effect paint properties */
  plotsHoldGlow: PlotHoldGlowPaint
  /** Hit area paint properties (for touch targets) */
  plotsHit: PlotHitPaint
  /** Whether current device is mobile */
  isMobileDevice: boolean
  /** Status colors mapping */
  statusColors: typeof STATUS_COLORS
  /** Get color for a status */
  getStatusColor: typeof getStatusColor
}

/**
 * React Hook that returns MapLibre GL paint properties for cemetery plot layers
 * 
 * Migrated from legacy ocm-hybrid.js - translates the old paint property logic
 * to a React-friendly format with responsive mobile/desktop styling.
 * 
 * @example
 * ```tsx
 * const { plotsCircle, plotsHold, isMobileDevice } = useMapLayerStyles()
 * 
 * // Use in MapLibre layer definition
 * map.addLayer({
 *   id: 'plots-circle',
 *   type: 'circle',
 *   source: 'plots',
 *   paint: plotsCircle as CirclePaint
 * })
 * ```
 */
export function useMapLayerStyles(): MapLayerStyles {
  const mobile = useMemo(() => isMobile(), [])
  
  const styles = useMemo<MapLayerStyles>(() => {
    // Main plot circle - responsive radius based on device type
    // Mobile: larger circles for easier touch interaction
    // Desktop: smaller, more precise circles
    const plotsCircle: PlotCirclePaint = {
      'circle-radius': mobile
        ? ['interpolate', ['linear'], ['zoom'], 14, 6, 16, 11, 19, 16, 22, 24]
        : ['interpolate', ['linear'], ['zoom'], 15, 4, 19, 10, 22, 14],
      'circle-color': ['get', '_statusColor'],
      'circle-stroke-color': '#fff',
      'circle-stroke-width': mobile ? 2 : 1.5,
      'circle-pitch-scale': 'viewport'
    }
    
    // Hold indicator ring - shows when plot is being consulted
    const plotsHold: PlotHoldPaint = {
      'circle-radius': mobile
        ? ['interpolate', ['linear'], ['zoom'], 14, 10, 16, 18, 19, 28, 22, 36]
        : ['interpolate', ['linear'], ['zoom'], 15, 6, 19, 14, 22, 18],
      'circle-color': 'rgba(0,0,0,0)',
      'circle-stroke-color': '#4B5563',
      'circle-stroke-width': mobile ? 3 : 2,
      'circle-opacity': 1,
      'circle-pitch-scale': 'viewport'
    }
    
    // Hold glow effect - subtle blur behind held plots
    const plotsHoldGlow: PlotHoldGlowPaint = {
      'circle-radius': mobile
        ? ['interpolate', ['linear'], ['zoom'], 14, 14, 16, 24, 19, 36, 22, 48]
        : ['interpolate', ['linear'], ['zoom'], 15, 8, 19, 18, 22, 24],
      'circle-color': 'rgba(75,85,99,0.22)',
      'circle-blur': 0.6,
      'circle-pitch-scale': 'viewport'
    }
    
    // Hit area - invisible larger circle for easier tap/click detection
    const plotsHit: PlotHitPaint = {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 18, 16, 26, 19, 36],
      'circle-color': 'rgba(0,0,0,0)'
    }
    
    return {
      plotsCircle,
      plotsHold,
      plotsHoldGlow,
      plotsHit,
      isMobileDevice: mobile,
      statusColors: STATUS_COLORS,
      getStatusColor
    }
  }, [mobile])
  
  return styles
}

/**
 * Get base paint properties for plots-circle layer (non-hook version)
 * Useful for initial layer setup before React hydration
 */
export function getPlotCirclePaint(mobile: boolean = false): PlotCirclePaint {
  return {
    'circle-radius': mobile
      ? ['interpolate', ['linear'], ['zoom'], 14, 6, 16, 11, 19, 16, 22, 24]
      : ['interpolate', ['linear'], ['zoom'], 15, 4, 19, 10, 22, 14],
    'circle-color': ['get', '_statusColor'],
    'circle-stroke-color': '#fff',
    'circle-stroke-width': mobile ? 2 : 1.5,
    'circle-pitch-scale': 'viewport'
  }
}

/**
 * Create a feature with status color property for GeoJSON data
 * Useful when building GeoJSON features for the plots source
 */
export function withStatusColor<T extends Record<string, unknown>>(
  properties: T & { status: string }
): T & { _statusColor: string } {
  return {
    ...properties,
    _statusColor: getStatusColor(properties.status)
  }
}
