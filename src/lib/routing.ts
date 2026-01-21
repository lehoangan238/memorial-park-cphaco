/**
 * Routing System with OSRM API Integration
 * Tìm đường đi theo đường thực tế sử dụng OpenStreetMap data
 */

import type { RoadNodeRow, RoadEdgeRow, RouteResult } from '@/types/database'

// OSRM Public Demo Server (for production, host your own or use paid service)
const OSRM_BASE_URL = 'https://router.project-osrm.org'

export interface OSRMRoute {
  geometry: {
    coordinates: [number, number][] // [lng, lat]
    type: 'LineString'
  }
  legs: {
    distance: number
    duration: number
    steps: {
      distance: number
      duration: number
      name: string
      maneuver: {
        type: string
        modifier?: string
        location: [number, number]
      }
    }[]
  }[]
  distance: number // meters
  duration: number // seconds
}

export interface OSRMResponse {
  code: string
  routes: OSRMRoute[]
  waypoints: {
    name: string
    location: [number, number]
  }[]
}

/**
 * Get route from OSRM API
 * @param startLat Start latitude
 * @param startLng Start longitude  
 * @param endLat End latitude
 * @param endLng End longitude
 * @param profile 'driving' | 'walking' | 'cycling'
 */
export async function getOSRMRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  profile: 'driving' | 'walking' | 'cycling' | 'foot' = 'foot'
): Promise<OSRMRoute | null> {
  try {
    // OSRM uses [lng, lat] format, and 'foot' for walking profile
    const osrmProfile = profile === 'walking' ? 'foot' : profile
    const url = `${OSRM_BASE_URL}/route/v1/${osrmProfile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`
    
    console.log('🗺️ OSRM Request:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('❌ OSRM API error:', response.status)
      return null
    }
    
    const data: OSRMResponse = await response.json()
    console.log('📍 OSRM Response:', data)
    
    if (data.code !== 'Ok' || !data.routes.length) {
      console.error('❌ OSRM no route found:', data.code)
      return null
    }
    
    console.log('✅ OSRM Route found:', data.routes[0].distance, 'm')
    return data.routes[0]
  } catch (error) {
    console.error('❌ OSRM fetch error:', error)
    return null
  }
}

/**
 * Convert OSRM route to GeoJSON for map display
 */
export function osrmRouteToGeoJSON(route: OSRMRoute) {
  return {
    type: 'Feature' as const,
    properties: {
      distance: route.distance,
      duration: route.duration
    },
    geometry: route.geometry
  }
}

/**
 * Get turn-by-turn directions from OSRM route
 */
export function getDirectionsFromOSRM(route: OSRMRoute): {
  instruction: string
  distance: number
  duration: number
}[] {
  const directions: { instruction: string; distance: number; duration: number }[] = []
  
  for (const leg of route.legs) {
    for (const step of leg.steps) {
      const maneuver = step.maneuver
      let instruction = ''
      
      switch (maneuver.type) {
        case 'depart':
          instruction = `Bắt đầu đi ${step.name || 'theo đường'}`
          break
        case 'arrive':
          instruction = 'Đã đến nơi'
          break
        case 'turn':
          const turnDir = maneuver.modifier === 'left' ? 'trái' : 
                         maneuver.modifier === 'right' ? 'phải' : 
                         maneuver.modifier === 'slight left' ? 'chếch trái' :
                         maneuver.modifier === 'slight right' ? 'chếch phải' : ''
          instruction = `Rẽ ${turnDir}${step.name ? ` vào ${step.name}` : ''}`
          break
        case 'continue':
          instruction = `Đi thẳng${step.name ? ` theo ${step.name}` : ''}`
          break
        case 'roundabout':
          instruction = `Đi vào vòng xuyến${step.name ? `, ra ${step.name}` : ''}`
          break
        default:
          instruction = step.name ? `Đi theo ${step.name}` : 'Tiếp tục đi'
      }
      
      if (instruction && step.distance > 5) { // Skip very short segments
        directions.push({
          instruction,
          distance: step.distance,
          duration: step.duration
        })
      }
    }
  }
  
  return directions
}

// Priority Queue for Dijkstra
class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = []

  enqueue(element: T, priority: number) {
    const item = { element, priority }
    let added = false
    for (let i = 0; i < this.items.length; i++) {
      if (item.priority < this.items[i].priority) {
        this.items.splice(i, 0, item)
        added = true
        break
      }
    }
    if (!added) this.items.push(item)
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000 // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 + 
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLng/2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Build adjacency list from nodes and edges
 */
export function buildGraph(
  nodes: RoadNodeRow[],
  edges: RoadEdgeRow[]
): Map<string, { nodeId: string; distance: number }[]> {
  const graph = new Map<string, { nodeId: string; distance: number }[]>()
  
  // Initialize all nodes
  nodes.forEach(node => {
    graph.set(node.id, [])
  })
  
  // Add edges
  edges.forEach(edge => {
    const distance = edge.distance || 0
    
    // Add forward edge
    const fromEdges = graph.get(edge.from_node_id) || []
    fromEdges.push({ nodeId: edge.to_node_id, distance })
    graph.set(edge.from_node_id, fromEdges)
    
    // Add reverse edge if bidirectional
    if (edge.bidirectional) {
      const toEdges = graph.get(edge.to_node_id) || []
      toEdges.push({ nodeId: edge.from_node_id, distance })
      graph.set(edge.to_node_id, toEdges)
    }
  })
  
  return graph
}

/**
 * Find nearest node to a given coordinate
 */
export function findNearestNode(
  lat: number,
  lng: number,
  nodes: RoadNodeRow[]
): RoadNodeRow | null {
  if (nodes.length === 0) return null
  
  let nearest = nodes[0]
  let minDistance = calculateDistance(lat, lng, nearest.lat, nearest.lng)
  
  for (const node of nodes) {
    const distance = calculateDistance(lat, lng, node.lat, node.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearest = node
    }
  }
  
  return nearest
}

/**
 * Dijkstra's algorithm to find shortest path
 */
export function findShortestPath(
  startNodeId: string,
  endNodeId: string,
  nodes: RoadNodeRow[],
  edges: RoadEdgeRow[]
): RouteResult | null {
  const graph = buildGraph(nodes, edges)
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  
  // Distance from start to each node
  const distances = new Map<string, number>()
  // Previous node in optimal path
  const previous = new Map<string, string | null>()
  // Priority queue
  const pq = new PriorityQueue<string>()
  
  // Initialize
  nodes.forEach(node => {
    distances.set(node.id, node.id === startNodeId ? 0 : Infinity)
    previous.set(node.id, null)
  })
  
  pq.enqueue(startNodeId, 0)
  
  while (!pq.isEmpty()) {
    const currentId = pq.dequeue()!
    
    // Found destination
    if (currentId === endNodeId) break
    
    const currentDistance = distances.get(currentId) || Infinity
    const neighbors = graph.get(currentId) || []
    
    for (const neighbor of neighbors) {
      const newDistance = currentDistance + neighbor.distance
      const oldDistance = distances.get(neighbor.nodeId) || Infinity
      
      if (newDistance < oldDistance) {
        distances.set(neighbor.nodeId, newDistance)
        previous.set(neighbor.nodeId, currentId)
        pq.enqueue(neighbor.nodeId, newDistance)
      }
    }
  }
  
  // Reconstruct path
  const path: RoadNodeRow[] = []
  let current: string | null = endNodeId
  
  while (current !== null) {
    const node = nodeMap.get(current)
    if (node) path.unshift(node)
    current = previous.get(current) || null
  }
  
  // Check if path was found
  if (path.length === 0 || path[0].id !== startNodeId) {
    return null // No path found
  }
  
  const totalDistance = distances.get(endNodeId) || 0
  const coordinates: [number, number][] = path.map(node => [node.lat, node.lng])
  
  return {
    path,
    totalDistance,
    coordinates
  }
}

/**
 * Find route from any point to destination
 * Automatically finds nearest road nodes
 */
export function findRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  nodes: RoadNodeRow[],
  edges: RoadEdgeRow[]
): RouteResult | null {
  if (nodes.length === 0) return null
  
  // Find nearest nodes to start and end points
  const startNode = findNearestNode(startLat, startLng, nodes)
  const endNode = findNearestNode(endLat, endLng, nodes)
  
  if (!startNode || !endNode) return null
  
  // Find path between nodes
  const result = findShortestPath(startNode.id, endNode.id, nodes, edges)
  
  if (!result) return null
  
  // Add actual start/end points to coordinates
  const coordinates: [number, number][] = [
    [startLat, startLng], // Actual start
    ...result.coordinates,
    [endLat, endLng] // Actual end
  ]
  
  // Recalculate total distance including start/end segments
  const startToFirstNode = calculateDistance(startLat, startLng, startNode.lat, startNode.lng)
  const lastNodeToEnd = calculateDistance(
    result.path[result.path.length - 1].lat,
    result.path[result.path.length - 1].lng,
    endLat, endLng
  )
  
  return {
    path: result.path,
    totalDistance: result.totalDistance + startToFirstNode + lastNodeToEnd,
    coordinates
  }
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Format walking time estimate (80m/min ~ 5km/h)
 */
export function formatWalkingTime(meters: number): string {
  const minutes = Math.ceil(meters / 80)
  if (minutes < 1) return '< 1 phút'
  return `${minutes} phút`
}

/**
 * Get bearing direction name in Vietnamese
 */
export function getBearingName(
  fromLat: number, fromLng: number,
  toLat: number, toLng: number
): string {
  const dLng = (toLng - fromLng) * Math.PI / 180
  const lat1 = fromLat * Math.PI / 180
  const lat2 = toLat * Math.PI / 180
  
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
  
  const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc']
  return directions[Math.round(bearing / 45) % 8]
}
