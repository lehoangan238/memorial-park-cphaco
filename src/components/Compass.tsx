import { motion } from 'framer-motion'

interface CompassProps {
  bearing?: number
  className?: string
}

export function Compass({ bearing = 0, className }: CompassProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-2xl p-3 shadow-lg ${className}`}
    >
      <div className="relative w-12 h-12">
        {/* Compass Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-stone-300" />
        
        {/* Direction Markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="absolute top-0.5 text-[10px] font-bold text-red-500">N</span>
          <span className="absolute bottom-0.5 text-[10px] font-medium text-stone-400">S</span>
          <span className="absolute left-0.5 text-[10px] font-medium text-stone-400">W</span>
          <span className="absolute right-0.5 text-[10px] font-medium text-stone-400">E</span>
        </div>
        
        {/* Compass Needle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: -bearing }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* North Arrow (Red) */}
            <div className="absolute top-2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[12px] border-l-transparent border-r-transparent border-b-red-500" />
            {/* South Arrow (White) */}
            <div className="absolute bottom-2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[12px] border-l-transparent border-r-transparent border-t-stone-300" />
            {/* Center Dot */}
            <div className="w-2 h-2 rounded-full bg-stone-600" />
          </div>
        </motion.div>
      </div>
      
      {/* Label */}
      <div className="text-center mt-1">
        <p className="text-[10px] text-stone-500 font-medium">
          {bearing.toFixed(0)}°
        </p>
      </div>
    </motion.div>
  )
}