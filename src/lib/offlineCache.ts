/**
 * Offline Cache Service
 * Caches data to IndexedDB for offline access
 */

import { logger } from '@/lib/logger'

const DB_NAME = 'hoavien_offline_db'
const DB_VERSION = 1

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

// Cache durations in milliseconds
const CACHE_DURATIONS = {
  plots: 24 * 60 * 60 * 1000,      // 24 hours
  overlays: 7 * 24 * 60 * 60 * 1000, // 7 days
  spiritual_sites: 7 * 24 * 60 * 60 * 1000,
  road_nodes: 7 * 24 * 60 * 60 * 1000,
  road_edges: 7 * 24 * 60 * 60 * 1000,
} as const

type CacheKey = keyof typeof CACHE_DURATIONS

/**
 * Open IndexedDB connection
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      // Create object stores for each data type
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' })
      }
    }
  })
}

/**
 * Save data to offline cache
 */
export async function saveToCache<T>(key: CacheKey, data: T): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction('cache', 'readwrite')
    const store = tx.objectStore('cache')
    
    const entry: CacheEntry<T> & { key: string } = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATIONS[key]
    }
    
    store.put(entry)
    
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    
    logger.info(`[OfflineCache] Saved ${key} to cache`)
  } catch (error) {
    logger.error(`[OfflineCache] Error saving ${key}:`, error)
  }
}

/**
 * Get data from offline cache
 */
export async function getFromCache<T>(key: CacheKey): Promise<T | null> {
  try {
    const db = await openDB()
    const tx = db.transaction('cache', 'readonly')
    const store = tx.objectStore('cache')
    
    const result = await new Promise<CacheEntry<T> & { key: string } | undefined>((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    if (!result) {
      logger.info(`[OfflineCache] No cache found for ${key}`)
      return null
    }
    
    // Check if cache is expired
    if (Date.now() > result.expiresAt) {
      logger.info(`[OfflineCache] Cache expired for ${key}`)
      await clearCache(key)
      return null
    }
    
    logger.info(`[OfflineCache] Loaded ${key} from cache (age: ${Math.round((Date.now() - result.timestamp) / 1000 / 60)}min)`)
    return result.data
  } catch (error) {
    logger.error(`[OfflineCache] Error loading ${key}:`, error)
    return null
  }
}

/**
 * Clear specific cache entry
 */
export async function clearCache(key: CacheKey): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction('cache', 'readwrite')
    const store = tx.objectStore('cache')
    store.delete(key)
    
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    
    logger.info(`[OfflineCache] Cleared cache for ${key}`)
  } catch (error) {
    logger.error(`[OfflineCache] Error clearing ${key}:`, error)
  }
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction('cache', 'readwrite')
    const store = tx.objectStore('cache')
    store.clear()
    
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    
    logger.info('[OfflineCache] Cleared all cache')
  } catch (error) {
    logger.error('[OfflineCache] Error clearing all cache:', error)
  }
}

/**
 * Get cache status for all keys
 */
export async function getCacheStatus(): Promise<Record<CacheKey, { cached: boolean; age: number | null }>> {
  const status: Record<string, { cached: boolean; age: number | null }> = {}
  
  for (const key of Object.keys(CACHE_DURATIONS) as CacheKey[]) {
    try {
      const db = await openDB()
      const tx = db.transaction('cache', 'readonly')
      const store = tx.objectStore('cache')
      
      const result = await new Promise<CacheEntry<unknown> & { key: string } | undefined>((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      
      if (result && Date.now() <= result.expiresAt) {
        status[key] = {
          cached: true,
          age: Math.round((Date.now() - result.timestamp) / 1000 / 60) // minutes
        }
      } else {
        status[key] = { cached: false, age: null }
      }
    } catch {
      status[key] = { cached: false, age: null }
    }
  }
  
  return status as Record<CacheKey, { cached: boolean; age: number | null }>
}
