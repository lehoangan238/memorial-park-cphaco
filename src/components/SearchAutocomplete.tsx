import { useState, useMemo, useRef, useEffect, useDeferredValue } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Loader2, User, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { PlotRow } from '@/types/database'
import { cn } from '@/lib/utils'

interface SearchAutocompleteProps {
  plots: PlotRow[]
  onSelect: (plot: PlotRow) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
  searchCustomerName?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  'Trống': '#10B981',
  'Đã bán': '#EF4444',
  'Đặt cọc': '#F59E0B',
  'Đã an táng': '#6B7280',
  'Khác': '#9CA3AF'
}

export function SearchAutocomplete({
  plots,
  onSelect,
  isLoading = false,
  placeholder = 'Tìm kiếm vị trí...',
  className,
  searchCustomerName = false
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const MIN_MOBILE_QUERY_LENGTH = 2
  const normalizedQuery = deferredQuery.trim().toLowerCase()
  const shouldSearch = normalizedQuery.length > 0 && (!isMobile || normalizedQuery.length >= MIN_MOBILE_QUERY_LENGTH)

  const searchIndex = useMemo(() => {
    return plots.map((plot) => ({
      plot,
      name: (plot.name || '').toLowerCase(),
      id: plot.id.toLowerCase(),
      zone: (plot.zone || '').toLowerCase(),
      customer: (plot.customer_name || '').toLowerCase()
    }))
  }, [plots])

  // Filter results
  const results = useMemo(() => {
    if (!shouldSearch) return []

    const maxResults = isMobile ? 6 : 8
    return searchIndex
      .filter(({ id, name, zone, customer }) => {
        const matchId = id.includes(normalizedQuery)
        const matchName = name.includes(normalizedQuery)
        const matchZone = zone.includes(normalizedQuery)
        const matchCustomer = searchCustomerName && customer.includes(normalizedQuery)

        return matchId || matchName || matchZone || matchCustomer
      })
      .slice(0, maxResults)
      .map((entry) => entry.plot)
  }, [shouldSearch, isMobile, searchIndex, normalizedQuery, searchCustomerName])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (plot: PlotRow) => {
    setQuery(plot.name || plot.id)
    setIsOpen(false)
    onSelect(plot)
  }

  const handleClear = () => {
    setQuery('')
    setSelectedIndex(-1)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <label htmlFor="plot-search-input" className="sr-only">
          Tìm kiếm vị trí theo mã lô, tên khu hoặc khách hàng
        </label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
        <Input
          id="plot-search-input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-expanded={isOpen}
          aria-controls="plot-search-results"
          aria-autocomplete="list"
          className={cn(
            'pl-10 h-11 sm:h-10 rounded-2xl border-stone-300 bg-white/95 text-stone-900 shadow-sm backdrop-blur focus:bg-white focus:ring-2 focus:ring-blue-100 touch-manipulation',
            query ? 'pr-20' : 'pr-10'
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Xóa nội dung tìm kiếm"
            className="absolute right-9 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer touch-manipulation"
          >
            <X className="w-3.5 h-3.5 mx-auto" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 animate-spin" />
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            id="plot-search-results"
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/90">
              <p className="text-[11px] font-semibold tracking-wide uppercase text-stone-500">
                {results.length} kết quả phù hợp
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto overscroll-contain">
              {results.map((plot, index) => (
                <button
                  key={plot.id}
                  onClick={() => handleSelect(plot)}
                  className={cn(
                    'w-full px-3.5 py-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer touch-manipulation border-b border-stone-100 last:border-b-0',
                    index === selectedIndex ? 'bg-blue-50/70' : 'hover:bg-stone-50'
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[plot.status] || STATUS_COLORS['Khác'] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-[15px] leading-5 text-stone-900 truncate">
                        {plot.name || plot.id}
                      </span>
                      <Badge variant="secondary" className="text-[10px] leading-4 py-0.5 px-2 rounded-full bg-stone-100 text-stone-600 border border-stone-200 shrink-0">
                        {plot.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-xs text-stone-500 truncate">
                        {plot.zone || 'Khu vực chung'}
                      </span>
                    </div>
                    {searchCustomerName && plot.customer_name && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <User className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-600 truncate">
                          {plot.customer_name}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      <AnimatePresence>
        {isOpen && query.trim() && !shouldSearch && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 text-center z-50"
          >
            <p className="text-sm text-stone-600">Nhập ít nhất 2 ký tự để tìm nhanh hơn trên mobile</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && shouldSearch && results.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 text-center z-50"
          >
            <p className="text-sm text-stone-500">Không tìm thấy kết quả</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
