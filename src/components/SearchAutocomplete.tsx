import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Loader2, User } from 'lucide-react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return []
    
    const q = query.toLowerCase()
    return plots.filter(plot => {
      const matchId = plot.id.toLowerCase().includes(q)
      const matchName = plot.name?.toLowerCase().includes(q)
      const matchZone = plot.zone?.toLowerCase().includes(q)
      const matchCustomer = searchCustomerName && plot.customer_name?.toLowerCase().includes(q)
      
      return matchId || matchName || matchZone || matchCustomer
    }).slice(0, 8)
  }, [query, plots, searchCustomerName])

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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <Input
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
          className="pl-10 pr-10 h-10 rounded-xl border-stone-200 bg-white/90 backdrop-blur focus:bg-white"
        />
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
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50"
          >
            <div className="max-h-80 overflow-y-auto">
              {results.map((plot, index) => (
                <button
                  key={plot.id}
                  onClick={() => handleSelect(plot)}
                  className={cn(
                    'w-full px-4 py-3 flex items-start gap-3 text-left transition-colors cursor-pointer',
                    index === selectedIndex ? 'bg-stone-100' : 'hover:bg-stone-50'
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[plot.status] || STATUS_COLORS['Khác'] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900 truncate">
                        {plot.name || plot.id}
                      </span>
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {plot.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span className="text-xs text-stone-500 truncate">
                        {plot.zone || 'Khu vực chung'}
                      </span>
                    </div>
                    {searchCustomerName && plot.customer_name && (
                      <div className="flex items-center gap-2 mt-0.5">
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
        {isOpen && query.trim() && results.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-4 text-center z-50"
          >
            <p className="text-sm text-stone-500">Không tìm thấy kết quả</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
