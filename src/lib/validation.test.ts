import { describe, it, expect } from 'vitest'
import { plotSchema, overlaySchema, spiritualSiteSchema, validateForm, getFirstError } from './validation'

describe('plotSchema', () => {
  it('should validate a valid plot', () => {
    const validPlot = {
      name: 'A001',
      lat: 11.168266,
      lng: 106.651891,
      status: 'Trống',
      zone: 'Khu A'
    }
    const result = plotSchema.safeParse(validPlot)
    expect(result.success).toBe(true)
  })

  it('should reject invalid coordinates', () => {
    const invalidPlot = {
      name: 'A001',
      lat: 200, // Invalid latitude (must be 10-12)
      lng: 106.651891,
      status: 'Trống'
    }
    const result = plotSchema.safeParse(invalidPlot)
    expect(result.success).toBe(false)
  })

  it('should reject empty name', () => {
    const invalidPlot = {
      name: '',
      lat: 11.168266,
      lng: 106.651891,
      status: 'Trống'
    }
    const result = plotSchema.safeParse(invalidPlot)
    expect(result.success).toBe(false)
  })

  it('should accept optional fields', () => {
    const plotWithOptionals = {
      name: 'A001',
      lat: 11.168266,
      lng: 106.651891,
      status: 'Đã bán',
      customer_name: 'Nguyễn Văn A',
      price: 50000000,
      area: 4.5
    }
    const result = plotSchema.safeParse(plotWithOptionals)
    expect(result.success).toBe(true)
  })
})

describe('overlaySchema', () => {
  it('should validate a valid overlay', () => {
    const validOverlay = {
      name: 'Khu A',
      url: 'https://example.com/image.png',
      nw_lat: 11.17,
      nw_lng: 106.65,
      se_lat: 11.16,
      se_lng: 106.66
    }
    const result = overlaySchema.safeParse(validOverlay)
    expect(result.success).toBe(true)
  })

  it('should reject invalid URL', () => {
    const invalidOverlay = {
      name: 'Khu A',
      url: 'not-a-url',
      nw_lat: 11.17,
      nw_lng: 106.65,
      se_lat: 11.16,
      se_lng: 106.66
    }
    const result = overlaySchema.safeParse(invalidOverlay)
    expect(result.success).toBe(false)
  })
})

describe('spiritualSiteSchema', () => {
  it('should validate a valid spiritual site', () => {
    const validSite = {
      name: 'Chùa ABC',
      lat: 11.168266,
      lng: 106.651891,
      type: 'Chùa'
    }
    const result = spiritualSiteSchema.safeParse(validSite)
    expect(result.success).toBe(true)
  })

  it('should reject missing name', () => {
    const invalidSite = {
      lat: 11.168266,
      lng: 106.651891
    }
    const result = spiritualSiteSchema.safeParse(invalidSite)
    expect(result.success).toBe(false)
  })
})

describe('validateForm', () => {
  it('should return success with valid data', () => {
    const data = {
      name: 'Test',
      lat: 11.168266,
      lng: 106.651891,
      status: 'Trống'
    }
    const result = validateForm(plotSchema, data)
    expect(result.success).toBe(true)
  })

  it('should return errors with invalid data', () => {
    const data = {
      name: '',
      lat: 11.168266,
      lng: 106.651891,
      status: 'Trống'
    }
    const result = validateForm(plotSchema, data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toHaveProperty('name')
    }
  })
})

describe('getFirstError', () => {
  it('should return first error message', () => {
    const errors = { name: 'Name required', email: 'Email invalid' }
    expect(getFirstError(errors)).toBe('Name required')
  })

  it('should return default message for empty errors', () => {
    expect(getFirstError({})).toBe('Dữ liệu không hợp lệ')
  })
})
