/**
 * Advanced Search Component
 * Search plots by name, deceased name, birth/death dates
 */
import { useState, useCallback, useMemo } from 'react'
import { Search, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PlotRow } from '@/types/database'

interface AdvancedSearchProps {
  plots: PlotRow[]
  onResultSelect: (plot: PlotRow) => void
  onFilteredPlotsChange?: (plots: PlotRow[]) => void
}

interface SearchFilters {
  keyword: string
  deathDateFrom: string
  deathDateTo: string
  birthDateFrom: string
  birthDateTo: string
  zone: string
}

const initialFilters: SearchFilters = {
  keyword: '',
  deathDateFrom: '',
  deathDateTo: '',
  birthDateFrom: '',
  birthDateTo: '',
  zone: ''
}

export function AdvancedSearch({ plots, onResultSelect, onFilteredPlotsChange }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [showResults, setShowResults] = useState(false)

  // Get unique zones
  const zones = useMemo(() => {
    const uniqueZones = new Set(plots.map(p => p.zone).filter(Boolean))
    return Array.from(uniqueZones).sort()
  }, [plots])

  // Filter plots based on criteria
  const filteredPlots = useMemo(() => {
    return plots.filter(plot => {
      // Keyword search (name, deceased_name, customer_name, id)
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        const matchesKeyword = 
          plot.id?.toLowerCase().includes(keyword) ||
          plot.name?.toLowerCase().includes(keyword) ||
          plot.deceased_name?.toLowerCase().includes(keyword) ||
          plot.customer_name?.toLowerCase().includes(keyword)
        if (!matchesKeyword) return false
      }

      // Zone filter
      if (filters.zone && plot.zone !== filters.zone) {
        return false
      }

      // Death date range
      if (filters.deathDateFrom && plot.death_date) {
        if (plot.death_date < filters.deathDateFrom) return false
      }
      if (filters.deathDateTo && plot.death_date) {
        if (plot.death_date > filters.deathDateTo) return false
      }

      // Birth date range
      if (filters.birthDateFrom && plot.birth_date) {
        if (plot.birth_date < filters.birthDateFrom) return false
      }
      if (filters.birthDateTo && plot.birth_date) {
        if (plot.birth_date > filters.birthDateTo) return false
      }

      return true
    })
  }, [plots, filters])

  // Notify parent of filtered results
  const handleSearch = useCallback(() => {
    setShowResults(true)
    onFilteredPlotsChange?.(filteredPlots)
  }, [filteredPlots, onFilteredPlotsChange])

  // Clear all filters
  const handleClear = useCallback(() => {
    setFilters(initialFilters)
    setShowResults(false)
    onFilteredPlotsChange?.(plots)
  }, [plots, onFilteredPlotsChange])

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('vi-VN')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Search Header */}
      <div className="p-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã mộ..."
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-stone-600"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Nâng cao</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-3 bg-stone-50 border-b border-stone-100 space-y-3">
          {/* Zone Filter */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1 block">Khu vực</label>
            <select
              value={filters.zone}
              onChange={e => setFilters(prev => ({ ...prev, zone: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white"
            >
              <option value="">Tất cả khu vực</option>
              {zones.map(zone => (
                <option key={zone} value={zone!}>{zone}</option>
              ))}
            </select>
          </div>

          {/* Death Date Range */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1 block">Ngày mất</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.deathDateFrom}
                onChange={e => setFilters(prev => ({ ...prev, deathDateFrom: e.target.value }))}
                className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg"
              />
              <span className="text-stone-400">→</span>
              <input
                type="date"
                value={filters.deathDateTo}
                onChange={e => setFilters(prev => ({ ...prev, deathDateTo: e.target.value }))}
                className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          {/* Birth Date Range */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1 block">Ngày sinh</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.birthDateFrom}
                onChange={e => setFilters(prev => ({ ...prev, birthDateFrom: e.target.value }))}
                className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg"
              />
              <span className="text-stone-400">→</span>
              <input
                type="date"
                value={filters.birthDateTo}
                onChange={e => setFilters(prev => ({ ...prev, birthDateTo: e.target.value }))}
                className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button onClick={handleSearch} size="sm" className="flex-1">
              <Search className="w-4 h-4 mr-1" />
              Tìm kiếm
            </Button>
            {hasActiveFilters && (
              <Button onClick={handleClear} variant="outline" size="sm">
                <X className="w-4 h-4 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="max-h-64 overflow-y-auto">
          {filteredPlots.length === 0 ? (
            <div className="p-4 text-center text-stone-500 text-sm">
              Không tìm thấy kết quả
            </div>
          ) : (
            <>
              <div className="px-3 py-2 bg-stone-50 text-xs text-stone-600 border-b border-stone-100">
                Tìm thấy {filteredPlots.length} kết quả
              </div>
              {filteredPlots.slice(0, 20).map(plot => (
                <button
                  key={plot.id}
                  onClick={() => {
                    onResultSelect(plot)
                    setShowResults(false)
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-stone-50 border-b border-stone-100 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm text-stone-900">
                        {plot.deceased_name || plot.name || plot.id}
                      </span>
                      {plot.zone && (
                        <span className="ml-2 text-xs text-stone-500">{plot.zone}</span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      plot.status === 'Trống' ? 'bg-emerald-100 text-emerald-700' :
                      plot.status === 'Đã bán' ? 'bg-red-100 text-red-700' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {plot.status}
                    </span>
                  </div>
                  {(plot.death_date || plot.birth_date) && (
                    <div className="text-xs text-stone-500 mt-1">
                      {plot.birth_date && <span>Sinh: {formatDate(plot.birth_date)}</span>}
                      {plot.birth_date && plot.death_date && <span className="mx-1">•</span>}
                      {plot.death_date && <span>Mất: {formatDate(plot.death_date)}</span>}
                    </div>
                  )}
                </button>
              ))}
              {filteredPlots.length > 20 && (
                <div className="px-3 py-2 text-center text-xs text-stone-500 bg-stone-50">
                  Và {filteredPlots.length - 20} kết quả khác...
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch
