import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Normalize Vietnamese text for search/comparison
 * Removes diacritics, converts to lowercase, normalizes whitespace
 * Migrated from legacy ocm-hybrid.js
 */
export function vnNormalize(str: string | null | undefined): string {
  if (!str) return ''
  
  let s = String(str).toLowerCase()
  
  // Remove Vietnamese diacritics using NFD normalization
  try {
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  } catch {
    // Fallback if normalize not supported
  }
  
  // Replace đ with d, remove non-alphanumeric, normalize spaces
  s = s
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  return s
}

/**
 * Parsed coordinates result
 */
export interface ParsedCoordinates {
  lat: number
  lng: number
}

/**
 * Parse Google Maps URL or coordinate string to extract lat/lng
 * Supports various formats: direct coords, @lat,lng, ?q=, !3d!4d, etc.
 * Migrated from legacy ocm-hybrid.js
 */
export function parseGmaps(input: string | null | undefined): ParsedCoordinates | null {
  if (!input) return null
  
  let s = String(input).trim()
  
  // Try to decode URL encoding
  try {
    s = decodeURIComponent(s)
  } catch {
    // Ignore decode errors
  }
  
  // Normalize whitespace and special characters
  s = s
    .replace(/\+/g, ' ')
    .replace(/[\u00A0\u2000-\u200D]/g, ' ')
    .replace(/，/g, ',')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Pattern 1: Direct coordinates "lat, lng" or "lat,lng"
  let m = s.match(/(-?\d+(?:\.\d+)?)[\s\u200B]*[,，][\s\u200B]*(-?\d+(?:\.\d+)?)/)
  if (m) {
    const a = parseFloat(m[1])
    const b = parseFloat(m[2])
    if (Number.isFinite(a) && Number.isFinite(b)) {
      // Determine which is lat vs lng based on valid ranges
      if (Math.abs(a) <= 90 && Math.abs(b) <= 180) {
        return { lat: a, lng: b }
      } else {
        return { lat: b, lng: a }
      }
    }
  }
  
  // Pattern 2: Google Maps URL with @lat,lng
  m = s.match(/@(-?\d+(?:\.\d+)?)[\s\u200B]*,[\s\u200B]*(-?\d+(?:\.\d+)?)/)
  if (m) {
    return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
  }
  
  // Pattern 3: Query parameter ?q=lat,lng or ?query=lat,lng
  m = s.match(/[?&](?:q|query)=(-?\d+(?:\.\d+)?)[\s\u200B]*,[\s\u200B]*(-?\d+(?:\.\d+)?)/)
  if (m) {
    return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
  }
  
  // Pattern 4: Google Maps data parameters !3d(lat)!4d(lng)
  m = s.match(/!3d(-?\d+(?:\.\d+)?)[\s\u200B]*!4d(-?\d+(?:\.\d+)?)/)
  if (m) {
    return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
  }
  
  // Pattern 5: Reverse order !4d(lng)!3d(lat)
  m = s.match(/!4d(-?\d+(?:\.\d+)?)[\s\u200B]*!3d(-?\d+(?:\.\d+)?)/)
  if (m) {
    return { lat: parseFloat(m[2]), lng: parseFloat(m[1]) }
  }
  
  // Pattern 6: Fallback - extract any two numbers
  const nums = (s.match(/-?\d+(?:\.\d+)?/g) || [])
    .map(Number)
    .filter(Number.isFinite)
  
  if (nums.length >= 2) {
    const a = nums[0]
    const b = nums[1]
    
    if (Math.abs(a) <= 90 && Math.abs(b) <= 180) {
      return { lat: a, lng: b }
    } else {
      return { lat: b, lng: a }
    }
  }
  
  return null
}
