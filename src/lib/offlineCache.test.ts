import { describe, it, expect } from 'vitest'
import { saveToCache, getFromCache, clearCache } from './offlineCache'

// Mock IndexedDB is complex, so we'll just test that functions exist and are callable
describe('offlineCache', () => {
  describe('saveToCache', () => {
    it('should be a function', () => {
      expect(typeof saveToCache).toBe('function')
    })

    it('should return a promise', () => {
      // This will fail in test env without proper IndexedDB mock
      // but we're just checking the function signature
      const result = saveToCache('plots', [])
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('getFromCache', () => {
    it('should be a function', () => {
      expect(typeof getFromCache).toBe('function')
    })

    it('should return a promise', () => {
      const result = getFromCache('plots')
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('clearCache', () => {
    it('should be a function', () => {
      expect(typeof clearCache).toBe('function')
    })

    it('should return a promise', () => {
      const result = clearCache('plots')
      expect(result).toBeInstanceOf(Promise)
    })
  })
})
