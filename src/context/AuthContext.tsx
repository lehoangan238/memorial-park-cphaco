import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { StaffRole } from '@/types/database'
import { logger } from '@/lib/logger'

// Define permissions for each role
const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  Admin: ['*'], // Full access
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<StaffRole | null>(null)

  // Fetch user role from staff table
  const fetchUserRole = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('role')
        .eq('email', email)
        .eq('active', true)
        .single()
      
      if (error) {
        logger.warn('[Auth] Could not fetch user role:', error.message)
        // Default to Admin for users not in staff table (e.g., super admin)
        setUserRole('Admin')
        return
      }
      
      const roleData = data as { role?: StaffRole } | null
      setUserRole(roleData?.role || 'Admin')
    } catch (error) {
      logger.error('[Auth] Error fetching role:', error)
      setUserRole('Admin')
    }
  }, [])

  // Check if user has permission for a page
  const hasPermission = useCallback((page: string): boolean => {
    if (!userRole) return false
    const permissions = ROLE_PERMISSIONS[userRole]
    return permissions.includes('*') || permissions.includes(page)
  }, [userRole])

  // Initialize auth state
  useEffect(() => {
    let isMounted = true
    
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (!isMounted) return
        
        setSession(initialSession)
        setUser(initialSession?.user ?? null)
        
        // Fetch role if user exists
        if (initialSession?.user?.email) {
          await fetchUserRole(initialSession.user.email)
        }
      } catch (error) {
        logger.error('[Auth] Error getting initial session:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes (but ignore initial event)
    let isInitialEvent = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // Skip the initial INITIAL_SESSION event to prevent double-render
        if (isInitialEvent) {
          isInitialEvent = false
          return
        }
        
        if (!isMounted) return
        
        logger.info('[Auth] State changed:', event)
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        
        // Fetch role on auth change
        if (currentSession?.user?.email) {
          await fetchUserRole(currentSession.user.email)
        } else {
          setUserRole(null)
        }
        
        setIsLoading(false)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserRole])

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        logger.error('[Auth] Sign in error:', error)
        return { error }
      }

      setSession(data.session)
      setUser(data.user)
      
      // Fetch role after login
      if (data.user?.email) {
        await fetchUserRole(data.user.email)
      }
      
      return { error: null }
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
      logger.error('[Auth] Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshSession = useCallback(async () => {
    const { data: { session: newSession } } = await supabase.auth.refreshSession()
    setSession(newSession)
    setUser(newSession?.user ?? null)
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