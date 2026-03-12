/**
 * Global Search Component for Admin
 * Search across plots, overlays, spiritual sites, and staff
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, X, MapPin, Layers, Church, Users, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface SearchResult {
  id: string
  type: 'plot' | 'overlay' | 'spiritual_site' | 'staff'
  title: string
  subtitle?: string
  icon: typeof MapPin
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void
  onNavigate?: (page: string, id?: string) => void
}

export function GlobalSearch({ onResultClick, onNavigate }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    const searchResults: SearchResult[] = []

    try {
      // Search plots
      const { data: plots } = await supabase
        .from('plots')
        .select('id, name, zone, status')
        .or(`name.ilike.%${searchQuery}%,zone.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%`)
        .limit(5)

      if (plots) {
        (plots as Array<{ id: string; name: string | null; zone: string | null; status: string }>).forEach(plot => {
          searchResults.push({
            id: plot.id,
            type: 'plot',
            title: plot.name || plot.id,
            subtitle: `${plot.zone || 'N/A'} - ${plot.status}`,
            icon: MapPin
          })
        })
      }

      // Search overlays
      const { data: overlays } = await supabase
        .from('overlays')
        .select('id, name, type')
        .or(`name.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
        .limit(5)

      if (overlays) {
        (overlays as Array<{ id: string; name: string | null; type: string }>).forEach(overlay => {
          searchResults.push({
            id: overlay.id,
            type: 'overlay',
            title: overlay.name || overlay.id,
            subtitle: overlay.type,
            icon: Layers
          })
        })
      }

      // Search spiritual sites
      const { data: sites } = await supabase
        .from('spiritual_sites')
        .select('id, name, type')
        .ilike('name', `%${searchQuery}%`)
        .limit(5)

      if (sites) {
        (sites as Array<{ id: string; name: string; type: string | null }>).forEach(site => {
          searchResults.push({
            id: site.id,
            type: 'spiritual_site',
            title: site.name,
            subtitle: site.type || 'Điểm tâm linh',
            icon: Church
          })
        })
      }

      // Search staff
      const { data: staff } = await supabase
        .from('staff')
        .select('id, full_name, role, email')
        .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(5)

      if (staff) {
        (staff as Array<{ id: string; full_name: string; role: string; email: string | null }>).forEach(s => {
          searchResults.push({
            id: s.id,
            type: 'staff',
            title: s.full_name,
            subtitle: `${s.role} - ${s.email || 'N/A'}`,
            icon: Users
          })
        })
      }

      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result)
    }
    if (onNavigate) {
      const pageMap: Record<string, string> = {
        plot: 'plot-manager',
        overlay: 'overlay-manager',
        spiritual_site: 'spiritual-sites',
        staff: 'staff'
      }
      onNavigate(pageMap[result.type], result.id)
    }
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 text-sm"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Tìm kiếm...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white rounded text-xs text-gray-400 border border-gray-200">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm plots, overlays, nhân viên..."
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                  autoFocus
                />
                {isLoading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result) => {
                      const Icon = result.icon
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className={`p-2 rounded-lg ${
                            result.type === 'plot' ? 'bg-blue-100 text-blue-600' :
                            result.type === 'overlay' ? 'bg-purple-100 text-purple-600' :
                            result.type === 'spiritual_site' ? 'bg-amber-100 text-amber-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{result.title}</p>
                            <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                          </div>
                          <span className="text-xs text-gray-400 capitalize">
                            {result.type.replace('_', ' ')}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : query.length >= 2 && !isLoading ? (
                  <div className="py-8 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Không tìm thấy kết quả cho "{query}"</p>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400">
                    <p className="text-sm">Nhập ít nhất 2 ký tự để tìm kiếm</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border">↵</kbd> chọn
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border">esc</kbd> đóng
                  </span>
                </div>
                <span>{results.length} kết quả</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
