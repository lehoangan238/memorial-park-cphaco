import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, Camera, Phone, Heart, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeceasedModalStore } from '@/store/mapStore'

/**
 * Format date for display in Vietnamese
 */
function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Không rõ'
  
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

/**
 * Calculate age at death
 */
function calculateAge(birthDate?: string, deathDate?: string): string | null {
  if (!birthDate || !deathDate) return null
  
  try {
    const birth = new Date(birthDate)
    const death = new Date(deathDate)
    const age = Math.floor((death.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    return `${age} tuổi`
  } catch {
    return null
  }
}

/**
 * Modal displaying deceased person information
 * Only shown when explicitly enabled and with family permission
 */
export function DeceasedInfoModal() {
  const { isOpen, deceasedInfo, closeModal } = useDeceasedModalStore()

  if (!deceasedInfo) return null

  const age = calculateAge(deceasedInfo.birthDate, deceasedInfo.deathDate)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header with photo */}
              <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 pt-8 pb-16 text-center">
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full cursor-pointer transition-colors duration-150"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Photo */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {deceasedInfo.photo ? (
                    <img
                      src={deceasedInfo.photo}
                      alt={deceasedInfo.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full border-4 border-white/50 bg-stone-700 flex items-center justify-center">
                      <User className="w-16 h-16 text-stone-500" />
                    </div>
                  )}
                  
                  {/* Memorial ribbon */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <div className="bg-amber-500 px-3 py-0.5 rounded-full">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-xl font-serif font-semibold text-white">
                  {deceasedInfo.name}
                </h2>
                {age && (
                  <p className="text-sm text-white/70 mt-1">({age})</p>
                )}
              </div>

              {/* Info content */}
              <div className="p-6 -mt-8">
                <div className="bg-stone-50 rounded-xl p-4 space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>Ngày sinh</span>
                      </div>
                      <p className="font-medium text-stone-900">
                        {formatDate(deceasedInfo.birthDate)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>Ngày mất</span>
                      </div>
                      <p className="font-medium text-stone-900">
                        {formatDate(deceasedInfo.deathDate)}
                      </p>
                    </div>
                  </div>

                  {/* Plot ID */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                      <Camera className="w-3 h-3" />
                      <span>Vị trí</span>
                    </div>
                    <p className="font-medium text-stone-900">{deceasedInfo.plotId}</p>
                  </div>

                  {/* Biography */}
                  {deceasedInfo.biography && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                        <Book className="w-3 h-3" />
                        <span>Tiểu sử</span>
                      </div>
                      <p className="text-sm text-stone-700 leading-relaxed">
                        {deceasedInfo.biography}
                      </p>
                    </div>
                  )}

                  {/* Family contact */}
                  {deceasedInfo.familyContact && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                        <Phone className="w-3 h-3" />
                        <span>Liên hệ gia đình</span>
                      </div>
                      <p className="font-medium text-stone-900">{deceasedInfo.familyContact}</p>
                    </div>
                  )}
                </div>

                {/* Memorial message */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-stone-500 italic">
                    "Yên nghỉ trong bình an"
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  Đóng
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
