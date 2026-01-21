import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.main'
import { AdminApp } from './admin'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

// Simple hash-based routing for admin
const isAdmin = window.location.hash === '#/admin' || window.location.pathname === '/admin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {isAdmin ? <AdminApp /> : <App />}
    </QueryClientProvider>
  </StrictMode>,
)
