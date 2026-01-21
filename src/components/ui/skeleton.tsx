import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-stone-200/80",
        className
      )}
    />
  )
}

/**
 * Skeleton for plot list items in sidebar
 */
export function PlotListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-xl p-4 border border-stone-200"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton for stats cards
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div 
          key={i}
          className="bg-white rounded-xl p-4 border border-stone-200"
        >
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton for sidebar content
 */
export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats skeleton */}
      <StatsSkeleton />
      
      {/* Filter skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
      
      {/* List skeleton */}
      <PlotListSkeleton />
    </div>
  )
}

/**
 * Full page loading skeleton with map placeholder
 */
export function MapLoadingSkeleton() {
  return (
    <div className="absolute inset-0 w-full h-full bg-stone-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* Animated map icon */}
          <div className="absolute inset-0 rounded-full bg-emerald-200 animate-ping opacity-25" />
          <div className="relative w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-emerald-600 animate-pulse"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
              />
            </svg>
          </div>
        </div>
        <p className="text-stone-600 font-medium">Đang tải bản đồ...</p>
        <p className="text-stone-400 text-sm mt-1">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  )
}
