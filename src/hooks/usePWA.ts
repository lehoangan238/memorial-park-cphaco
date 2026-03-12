import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useOfflineCacheStore } from '@/store/mapStore'
import { logger } from '@/lib/logger'

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
      logger.info('[PWA] Service worker registered:', r)
    },
    onRegisterError(error: Error) {
      logger.error('[PWA] Service worker registration error:', error)
    },
    onNeedRefresh() {
      logger.info('[PWA] New content available, please refresh')
    },
    onOfflineReady() {
      logger.info('[PWA] App ready to work offline')
    }
  })

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
        logger.info('[PWA] Back online')
      setOnline(true)
    }

    const handleOffline = () => {
        logger.info('[PWA] Gone offline')
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
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
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
