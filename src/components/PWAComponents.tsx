import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWA } from '@/hooks/usePWA'

/**
 * Toast notification for PWA updates
 */
export function PWAUpdatePrompt() {
  const { needRefresh, update, dismiss } = usePWA()

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-stone-900 text-sm">
                  Có bản cập nhật mới
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Phiên bản mới đã sẵn sàng. Cập nhật ngay để có trải nghiệm tốt nhất.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={update}
                    className="h-8 text-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Cập nhật
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={dismiss}
                    className="h-8 text-xs cursor-pointer"
                  >
                    Để sau
                  </Button>
                </div>
              </div>
              <button
                onClick={dismiss}
                className="p-1 hover:bg-stone-100 rounded cursor-pointer transition-colors duration-150"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Offline indicator banner
 */
interface OfflineIndicatorProps {
  isOnline: boolean
}

export function OfflineIndicator({ isOnline }: OfflineIndicatorProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-4 right-4 md:left-auto md:right-4 md:w-72 z-40"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm text-amber-800 font-medium">
              Bạn đang offline
            </span>
            <span className="text-xs text-amber-600 ml-auto">
              Dữ liệu cache
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
