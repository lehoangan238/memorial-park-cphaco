/**
 * Cemetery status colors - Vietnamese status labels mapped to hex colors
 * Migrated from legacy ocm-hybrid.js
 */
export const STATUS_COLORS: Record<string, string> = {
  'Trống': '#0EA5E9',
  'Đặt cọc': '#D1D5DB',
  'Đặt cọc ngắn hạn': '#F97316',
  'Đặt cọc dài hạn': '#EA580C',
  'Đã nhượng quyền sử dụng': '#6366F1',
  'Đã bán': '#22C55E',
  'Đã an táng': '#EF4444',
  'Khác': '#6B7280'
} as const

/**
 * Status display order for UI rendering
 */
export const STATUS_ORDER: string[] = [
  'Trống',
  'Đã bán',
  'Đặt cọc',
  'Đã an táng',
  'Đặt cọc ngắn hạn',
  'Đặt cọc dài hạn',
  'Đã nhượng quyền sử dụng',
  'Khác'
]

/**
 * Type for valid cemetery statuses
 */
export type CemeteryStatus = keyof typeof STATUS_COLORS

/**
 * Get color for a given status, with fallback
 */
export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || STATUS_COLORS['Khác']
}

/**
 * Normalize raw status string to standard status
 */
export function normalizeStatus(raw: string | null | undefined): CemeteryStatus {
  if (!raw) return 'Khác'
  
  const s = String(raw).trim().replace(/\s+/g, ' ')
  
  if (/an\s*tang|an\stáng|an\s*táng|an\tang/i.test(s)) return 'Đã an táng'
  if (/ngan\s*han|ngắn\s*hạn/i.test(s)) return 'Đặt cọc ngắn hạn'
  if (/dai\s*han|dài\s*hạn|kh(ô|o)ng\s*k(ỳ|y)\s*h(ạ|a)n|đ(ặ|a)c\s*bi(ệ|e)t/i.test(s)) return 'Đặt cọc dài hạn'
  if (/nh(ư|u)ợng\s*quyền/i.test(s)) return 'Đã nhượng quyền sử dụng'
  
  if (['Trống', 'Đã bán', 'Đặt cọc'].includes(s)) return s as CemeteryStatus
  
  return 'Khác'
}
