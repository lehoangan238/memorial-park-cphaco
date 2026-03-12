import { describe, it, expect } from 'vitest'
import { getErrorMessage, SUCCESS_MESSAGES, CONFIRM_MESSAGES, LOADING_MESSAGES } from './errors'

describe('getErrorMessage', () => {
  it('should return Vietnamese message for known errors', () => {
    expect(getErrorMessage('Failed to fetch')).toBe('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.')
  })

  it('should return Vietnamese message for auth errors', () => {
    expect(getErrorMessage('Invalid login credentials')).toBe('Email hoặc mật khẩu không đúng.')
  })

  it('should return original message for unknown errors', () => {
    expect(getErrorMessage('Some random error')).toBe('Some random error')
  })

  it('should handle Error objects', () => {
    const error = new Error('Network Error')
    expect(getErrorMessage(error)).toBe('Lỗi kết nối mạng. Vui lòng thử lại.')
  })

  it('should handle null/undefined', () => {
    expect(getErrorMessage(null)).toBe('Đã có lỗi xảy ra. Vui lòng thử lại.')
    expect(getErrorMessage(undefined)).toBe('Đã có lỗi xảy ra. Vui lòng thử lại.')
  })

  it('should handle objects with message property', () => {
    const error = { message: 'permission denied' }
    expect(getErrorMessage(error)).toBe('Bạn không có quyền thực hiện thao tác này.')
  })
})

describe('SUCCESS_MESSAGES', () => {
  it('should have correct messages', () => {
    expect(SUCCESS_MESSAGES.created).toBe('Tạo mới thành công!')
    expect(SUCCESS_MESSAGES.updated).toBe('Cập nhật thành công!')
    expect(SUCCESS_MESSAGES.deleted).toBe('Xóa thành công!')
  })
})

describe('CONFIRM_MESSAGES', () => {
  it('should have correct messages', () => {
    expect(CONFIRM_MESSAGES.delete).toBe('Bạn có chắc chắn muốn xóa?')
    expect(CONFIRM_MESSAGES.deleteWithName('Test')).toBe('Bạn có chắc chắn muốn xóa "Test"?')
  })
})

describe('LOADING_MESSAGES', () => {
  it('should have correct messages', () => {
    expect(LOADING_MESSAGES.loading).toBe('Đang tải...')
    expect(LOADING_MESSAGES.saving).toBe('Đang lưu...')
  })
})
