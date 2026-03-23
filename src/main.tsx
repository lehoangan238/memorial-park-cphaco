import { createRoot } from 'react-dom/client'
import { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'

// In development, remove stale SW/cache to avoid old title/favicon being served.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map((registration) => registration.unregister()))

      if ('caches' in window) {
        const cacheKeys = await caches.keys()
        await Promise.all(cacheKeys.map((key) => caches.delete(key)))
      }
    } catch {
      // Ignore cache cleanup errors in development.
    }
  })
}

// Create React Query client with proper config to prevent abort errors
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, // Keep cache for 10 minutes
    },
  },
})

// Simple hash/path-based routing for admin
const isAdmin = window.location.hash.startsWith('#/admin') || window.location.pathname.startsWith('/admin')
const LazyAdminApp = lazy(() => import('./admin/AdminApp').then(module => ({ default: module.AdminApp })))

if (!isAdmin) {
  document.title = 'Bản Đồ Số  - Hoa Viên Bình Dương'
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    {isAdmin ? (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-stone-600">Đang tải trang quản trị...</div>}>
        <LazyAdminApp />
      </Suspense>
    ) : <App />}
  </QueryClientProvider>,
)
