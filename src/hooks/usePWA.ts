import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useOfflineCacheStore } from '@/store/mapStore'

/**
 * Hook to manage PWA service worker registration and updates
 */
export function usePWA() {
  const { setOnline } = useOfflineCacheStore()

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log('[PWA] Service worker registered:', r)
    },
    onRegisterError(error: Error) {
      console.error('[PWA] Service worker registration error:', error)
    },
    onNeedRefresh() {
      console.log('[PWA] New content available, please refresh')
    },
    onOfflineReady() {
      console.log('[PWA] App ready to work offline')
    }
  })

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('[PWA] Back online')
      setOnline(true)
    }

    const handleOffline = () => {
      console.log('[PWA] Gone offline')
      setOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set initial state
    setOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline])

  const update = () => {
    updateServiceWorker(true)
    setNeedRefresh(false)
  }

  const dismiss = () => {
    setNeedRefresh(false)
  }

  return {
    needRefresh,
    update,
    dismiss
  }
}

/**
 * Utility to check if app is running in PWA mode (standalone)
 */
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

/**
 * Utility to get PWA display mode
 */
export function getPWADisplayMode(): string {
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen'
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone'
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui'
  }
  return 'browser'
}
