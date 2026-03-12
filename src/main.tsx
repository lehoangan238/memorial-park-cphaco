import { createRoot } from 'react-dom/client'
import { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'

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

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    {isAdmin ? (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-stone-600">Đang tải trang quản trị...</div>}>
        <LazyAdminApp />
      </Suspense>
    ) : <App />}
  </QueryClientProvider>,
)
