/**
 * Centralized Error Handling Utilities
 * Provides consistent error messages in Vietnamese
 */

// Error message translations
const ERROR_MESSAGES: Record<string, string> = {
  // Network errors
  'Failed to fetch': 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
  'Network Error': 'Lỗi kết nối mạng. Vui lòng thử lại.',
  'timeout': 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',
  
  // Auth errors
  'Invalid login credentials': 'Email hoặc mật khẩu không đúng.',
  'Email not confirmed': 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.',
  'User not found': 'Không tìm thấy tài khoản.',
  'Invalid email': 'Email không hợp lệ.',
  'Password should be at least 6 characters': 'Mật khẩu phải có ít nhất 6 ký tự.',
  
  // Database errors
  'duplicate key value': 'Dữ liệu đã tồn tại.',
  'violates foreign key constraint': 'Không thể xóa vì có dữ liệu liên quan.',
  'null value in column': 'Thiếu thông tin bắt buộc.',
  'permission denied': 'Bạn không có quyền thực hiện thao tác này.',
  
  // File errors
  'File too large': 'File quá lớn. Vui lòng chọn file nhỏ hơn.',
  'Invalid file type': 'Loại file không được hỗ trợ.',
  
  // Generic
  'Something went wrong': 'Đã có lỗi xảy ra. Vui lòng thử lại.',
}

/**
 * Get user-friendly error message in Vietnamese
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return ERROR_MESSAGES['Something went wrong']
  
  let message = ''
  
  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (typeof error === 'object' && 'message' in error) {
    message = String((error as { message: unknown }).message)
  }
  
  // Check for known error patterns
  for (const [pattern, translation] of Object.entries(ERROR_MESSAGES)) {
    if (message.toLowerCase().includes(pattern.toLowerCase())) {
      return translation
    }
  }
  
  // Return original message if no translation found
  return message || ERROR_MESSAGES['Something went wrong']
}

/**
 * Success messages in Vietnamese
 */
export const SUCCESS_MESSAGES = {
  // CRUD operations
  created: 'Tạo mới thành công!',
  updated: 'Cập nhật thành công!',
  deleted: 'Xóa thành công!',
  saved: 'Lưu thành công!',
  
  // Auth
  loggedIn: 'Đăng nhập thành công!',
  loggedOut: 'Đã đăng xuất.',
  
  // Data operations
  imported: 'Nhập dữ liệu thành công!',
  exported: 'Xuất dữ liệu thành công!',
  uploaded: 'Tải lên thành công!',
  
  // Generic
  success: 'Thao tác thành công!',
} as const

/**
 * Confirmation messages in Vietnamese
 */
export const CONFIRM_MESSAGES = {
  delete: 'Bạn có chắc chắn muốn xóa?',
  deleteWithName: (name: string) => `Bạn có chắc chắn muốn xóa "${name}"?`,
  unsavedChanges: 'Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?',
  logout: 'Bạn có chắc chắn muốn đăng xuất?',
} as const

/**
 * Loading messages in Vietnamese
 */
export const LOADING_MESSAGES = {
  loading: 'Đang tải...',
  saving: 'Đang lưu...',
  deleting: 'Đang xóa...',
  uploading: 'Đang tải lên...',
  processing: 'Đang xử lý...',
} as const
