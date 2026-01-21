import { motion } from 'framer-motion'
import { Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PlotStatus } from '@/types'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  activeFilter: PlotStatus | 'all'
  onFilterChange: (filter: PlotStatus | 'all') => void
}

const filters: Array<{ value: PlotStatus | 'all'; label: string; color: string }> = [
  { value: 'all', label: 'All Plots', color: 'bg-stone-500' },
  { value: 'available', label: 'Available', color: 'bg-sage' },
  { value: 'occupied', label: 'Occupied', color: 'bg-stone-500' },
  { value: 'reserved', label: 'Reserved', color: 'bg-gold' },
  { value: 'maintenance', label: 'Maintenance', color: 'bg-red-500' },
]

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-xl p-3"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-stone-600 mr-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'h-8 text-xs gap-1.5',
              activeFilter === filter.value 
                ? 'bg-stone-900 text-white hover:bg-stone-800'
                : 'text-stone-700 hover:bg-stone-100'
            )}
          >
            <div className={cn('w-2 h-2 rounded-full', filter.color)} />
            {filter.label}
          </Button>
        ))}

        {/* Additional filters dropdown placeholder */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-stone-600 ml-auto"
        >
          More Filters
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </motion.div>
  )
}
