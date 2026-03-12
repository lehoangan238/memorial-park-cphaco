/**
 * Form Validation Schemas using Zod
 * Centralized validation for all forms
 */
import { z } from 'zod'

// ==================== COMMON VALIDATORS ====================

const phoneRegex = /^(\+84|84|0)?[1-9]\d{8,9}$/
const coordinateSchema = z.number().min(-180).max(180)

// ==================== PLOT VALIDATION ====================

export const plotSchema = z.object({
  name: z.string().min(1, 'Tên plot không được để trống').max(100, 'Tên quá dài'),
  zone: z.string().max(50, 'Tên khu vực quá dài').nullable().optional(),
  lat: z.number().min(10, 'Vĩ độ không hợp lệ').max(12, 'Vĩ độ không hợp lệ'),
  lng: z.number().min(105, 'Kinh độ không hợp lệ').max(108, 'Kinh độ không hợp lệ'),
  status: z.enum(['Trống', 'Đã bán', 'Đặt cọc', 'Đã an táng', 'Khác']),
  price: z.number().min(0, 'Giá không được âm').nullable().optional(),
  area: z.number().min(0, 'Diện tích không được âm').nullable().optional(),
  customer_name: z.string().max(200, 'Tên khách hàng quá dài').nullable().optional(),
  notes: z.string().max(1000, 'Ghi chú quá dài').nullable().optional(),
})

export type PlotFormData = z.infer<typeof plotSchema>

// ==================== STAFF VALIDATION ====================

export const staffSchema = z.object({
  full_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100, 'Tên quá dài'),
  role: z.enum(['Admin', 'Security', 'Sale']),
  phone: z.string()
    .regex(phoneRegex, 'Số điện thoại không hợp lệ')
    .nullable()
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email('Email không hợp lệ')
    .nullable()
    .optional()
    .or(z.literal('')),
  active: z.boolean().default(true),
})

export type StaffFormData = z.infer<typeof staffSchema>

// ==================== OVERLAY VALIDATION ====================

export const overlaySchema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(100, 'Tên quá dài'),
  display_name: z.string().max(50, 'Display name quá dài').nullable().optional(),
  url: z.string().url('URL không hợp lệ'),
  url_mobile: z.string().url('URL mobile không hợp lệ').nullable().optional().or(z.literal('')),
  nw_lat: coordinateSchema,
  nw_lng: coordinateSchema,
  se_lat: coordinateSchema,
  se_lng: coordinateSchema,
  z_index: z.number().int().min(0).max(1000).default(0),
  opacity: z.number().int().min(0).max(100).default(85),
  is_visible: z.boolean().default(true),
  type: z.enum(['zone_map', 'satellite', 'blueprint', 'decoration', 'other']).default('zone_map'),
  description: z.string().max(500, 'Mô tả quá dài').nullable().optional(),
})

export type OverlayFormData = z.infer<typeof overlaySchema>

// ==================== SPIRITUAL SITE VALIDATION ====================

export const spiritualSiteSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(100, 'Tên quá dài'),
  type: z.string().max(50, 'Loại quá dài').nullable().optional(),
  image_url: z.string().url('URL hình ảnh không hợp lệ').nullable().optional().or(z.literal('')),
  lat: z.number().min(10, 'Vĩ độ không hợp lệ').max(12, 'Vĩ độ không hợp lệ'),
  lng: z.number().min(105, 'Kinh độ không hợp lệ').max(108, 'Kinh độ không hợp lệ'),
})

export type SpiritualSiteFormData = z.infer<typeof spiritualSiteSchema>

// ==================== ROAD NODE VALIDATION ====================

export const roadNodeSchema = z.object({
  name: z.string().max(100, 'Tên quá dài').nullable().optional(),
  lat: z.number().min(10, 'Vĩ độ không hợp lệ').max(12, 'Vĩ độ không hợp lệ'),
  lng: z.number().min(105, 'Kinh độ không hợp lệ').max(108, 'Kinh độ không hợp lệ'),
  node_type: z.enum(['gate', 'intersection', 'landmark', 'endpoint']),
})

export type RoadNodeFormData = z.infer<typeof roadNodeSchema>

// ==================== LOGIN VALIDATION ====================

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ==================== HELPER FUNCTIONS ====================

/**
 * Validate form data and return errors
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    if (!errors[path]) {
      errors[path] = issue.message
    }
  }
  
  return { success: false, errors }
}

/**
 * Get first error message from validation result
 */
export function getFirstError(errors: Record<string, string>): string {
  const firstKey = Object.keys(errors)[0]
  return firstKey ? errors[firstKey] : 'Dữ liệu không hợp lệ'
}
