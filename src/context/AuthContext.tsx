import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { StaffRole } from '@/types/database'
import { logger } from '@/lib/logger'

const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  Admin: ['*'],
  Security: ['dashboard', 'map-editor', 'qr-generator'],
  Sale: ['dashboard', 'plot-manager', 'qr-generator', 'spiritual-sites']
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: StaffRole | null
  hasPermission: (page: string) => boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getSessionFromLocalStorage(): Session | null {
  try {
    const raw = window.localStorage.getItem('supabase-auth')
    if (!raw) return null

    const parsed = JSON.parse(raw) as { currentSession?: Session } | Session | null

    // gotrue-js commonly stores under currentSession.
    if (parsed && typeof parsed === 'object' && 'currentSession' in parsed) {
      return parsed.currentSession || null
    }

    // Fallback for direct session-like payloads.
    if (parsed && typeof parsed === 'object' && 'access_token' in parsed) {
      return parsed as Session
    }

    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<StaffRole | null>(null)

  const fetchUserRole = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('role')
        .eq('email', email)
        .eq('active', true)
        .single()

      if (error) {
        const isAbort = error.message?.includes('AbortError') || error.message?.includes('signal is aborted')
        if (!isAbort) {
          logger.warn('[Auth] Could not fetch user role:', error.message)
        }
        setUserRole('Admin')
        return
      }

      const roleData = data as { role?: StaffRole } | null
      setUserRole(roleData?.role || 'Admin')
    } catch (error) {
      if (!isAbortError(error)) {
        logger.error('[Auth] Error fetching role:', error)
      }
      setUserRole('Admin')
    }
  }, [])

  const hasPermission = useCallback((page: string): boolean => {
    if (!userRole) return false
    const permissions = ROLE_PERMISSIONS[userRole]
    return permissions.includes('*') || permissions.includes(page)
  }, [userRole])

  useEffect(() => {
    let isMounted = true

    // 1. Listen for auth changes FIRST (catches SIGNED_IN after signIn())
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      try {
        if (!isMounted) return

        // Use flushSync-safe scheduling to avoid React batching issues
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user?.email) {
          await fetchUserRole(currentSession.user.email)
        } else {
          setUserRole(null)
        }
      } catch (error) {
        if (!isAbortError(error)) {
          logger.error('[Auth] Error in auth state change:', error)
        }
        if (isMounted) setUserRole('Admin')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    })

    // 2. Then fetch initial session with retries for transient AbortErrors.
    const restoreInitialSession = async () => {
      let restored: Session | null = null

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const { data } = await supabase.auth.getSession()
          restored = data.session ?? null
          break
        } catch (err) {
          if (!isAbortError(err)) {
            logger.error('[Auth] Error getting initial session:', err)
            break
          }

          logger.warn(`[Auth] getSession aborted (attempt ${attempt}/3)`)
          await delay(200 * attempt)
        }
      }

      // Fallback: restore from localStorage snapshot if Supabase call kept aborting.
      if (!restored) {
        restored = getSessionFromLocalStorage()
      }

      if (!isMounted) return

      setSession(restored)
      setUser(restored?.user ?? null)

      if (restored?.user?.email) {
        await fetchUserRole(restored.user.email)
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    restoreInitialSession().catch((err) => {
      if (!isAbortError(err)) {
        logger.error('[Auth] Failed to restore initial session:', err)
      }
      if (isMounted) {
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserRole])

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        logger.error('[Auth] Sign in error:', error)
        return { error }
      }

      setSession(data.session)
      setUser(data.user)

      if (data.user?.email) {
        try {
          await fetchUserRole(data.user.email)
        } catch (roleError) {
          if (!isAbortError(roleError)) {
            logger.warn('[Auth] Failed to fetch role on login:', roleError)
          }
          setUserRole('Admin')
        }
      }

      return { error: null }
    } catch (error) {
      // Never treat any thrown error (including AbortError) as success —
      // returning { error: null } here would trigger onSuccess() → reload
      // without a valid session, locking the user out.
      logger.warn('[Auth] Sign in threw unexpectedly:', error)
      return { error: (error instanceof Error ? error : new Error('Unknown error')) as unknown as AuthError }
    } finally {
      setIsLoading(false)
    }
  }, [fetchUserRole])

  const signOut = useCallback(async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      setUserRole(null)
    } catch (error) {
      if (!isAbortError(error)) {
        logger.error('[Auth] Sign out error:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const {
        data: { session: newSession }
      } = await supabase.auth.refreshSession()
      setSession(newSession)
      setUser(newSession?.user ?? null)
    } catch (error) {
      if (!isAbortError(error)) {
        logger.error('[Auth] Refresh session error:', error)
      }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        userRole,
        hasPermission,
        signIn,
        signOut,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
