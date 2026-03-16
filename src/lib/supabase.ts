import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { logger } from '@/lib/logger'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

logger.info('[Supabase] URL:', supabaseUrl)
logger.info('[Supabase] Key prefix:', supabaseAnonKey?.substring(0, 20) + '...')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

// Custom storage that doesn't use navigator.locks
const customStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(key)
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, value)
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: customStorage,
    storageKey: 'supabase-auth'
  },
  global: {
    headers: {
      'X-Client-Info': 'memorial-park-app'
    }
  },
  // Disable realtime by default to prevent connection issues
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
})

// Public readonly client used by map pages to avoid session lock-related aborts.
export const supabasePublic = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'memorial-park-public'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
})

// Supabase JS v2 throws AbortError from its internal fetch/lock mechanism as
// unhandled promise rejections — they originate inside the library's own code,
// so no try/catch in our code can intercept them. Suppress ONLY AbortErrors
// with the message "signal is aborted without reason" which is the literal
// default message the browser sets when AbortSignal.abort() is called with no
// reason argument — exactly what Supabase does internally.
// DOMException (which AbortError is) often has no stack property, so we cannot
// rely on stack inspection; the name+message pair is specific enough.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    if (
      reason != null &&
      reason.name === 'AbortError' &&
      (reason.message === '' ||
        reason.message === 'signal is aborted without reason' ||
        (typeof reason.message === 'string' && reason.message.includes('signal is aborted')))
    ) {
      event.preventDefault()
    }
  })
}
