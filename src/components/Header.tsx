import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Menu, X, User } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { graves } from '@/data/graves_data'
import type { Grave } from '@/types'

interface HeaderProps {
  onSearch: (query: string) => void
  onSearchResultSelect: (grave: Grave) => void
  onMenuToggle: () => void
  isMenuOpen: boolean
}

const statusLabels: Record<string, string> = {
  available: 'Còn trống',
  occupied: 'Đã sử dụng',
  reserved: 'Đã đặt',
  maintenance: 'Bảo trì',
}

export function Header({ onSearch, onSearchResultSelect, onMenuToggle, isMenuOpen }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter graves based on search value
  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return []
    const query = searchValue.toLowerCase()
    return graves.filter((grave) => 
      grave.id.toLowerCase().includes(query) ||
      grave.name?.toLowerCase().includes(query) ||
      grave.area.toLowerCase().includes(query)
    ).slice(0, 6) // Limit to 6 results
  }, [searchValue])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    setShowResults(true)
    setSelectedIndex(-1)
    onSearch(value) // Filter markers in real-time
  }

  const handleResultSelect = (grave: Grave) => {
    setSearchValue(grave.name || grave.id)
    setShowResults(false)
    onSearchResultSelect(grave)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleResultSelect(searchResults[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      handleResultSelect(searchResults[0])
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-4 left-4 right-4 z-50"
    >
      <div className="glass rounded-2xl shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-xl font-semibold text-stone-900">
                  Eternal Gardens
                </h1>
                <p className="text-xs text-stone-600">Digital Memorial Park</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div ref={searchRef} className="hidden md:block relative flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm kiếm mộ phần, tên người..."
                    value={searchValue}
                    onChange={handleInputChange}
                    onFocus={() => searchValue && setShowResults(true)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 bg-white/80 border-stone-200"
                  />
                </div>
              </form>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {searchResults.map((grave, index) => (
                        <button
                          key={grave.id}
                          onClick={() => handleResultSelect(grave)}
                          className={cn(
                            "w-full px-4 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer",
                            selectedIndex === index 
                              ? "bg-stone-100" 
                              : "hover:bg-stone-50"
                          )}
                        >
                          {/* Avatar/Icon */}
                          <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {grave.imageUrl ? (
                              <img 
                                src={grave.imageUrl} 
                                alt={grave.name || 'Grave'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-stone-500" />
                            )}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-900 truncate">
                              {grave.name || `Mộ phần ${grave.id}`}
                            </p>
                            <p className="text-xs text-stone-500 flex items-center gap-2">
                              <span>{grave.id}</span>
                              <span>•</span>
                              <span>{grave.area}</span>
                            </p>
                          </div>
                          {/* Status Badge */}
                          <Badge 
                            variant={grave.status === 'available' ? 'sage' : 'secondary'}
                            className="text-[10px] flex-shrink-0"
                          >
                            {statusLabels[grave.status]}
                          </Badge>
                        </button>
                      ))}
                    </div>
                    {searchValue && (
                      <div className="px-4 py-2 bg-stone-50 border-t border-stone-200">
                        <p className="text-xs text-stone-500">
                          Nhấn Enter để chọn • Tìm thấy {searchResults.length} kết quả
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {showResults && searchValue && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="px-4 py-6 text-center">
                      <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-sm text-stone-600">Không tìm thấy kết quả</p>
                      <p className="text-xs text-stone-400 mt-1">Thử tìm với từ khóa khác</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {['Map', 'Directory', 'Services', 'About'].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className={cn(
                    'text-stone-700 hover:text-stone-900 hover:bg-stone-100/80',
                    item === 'Map' && 'bg-stone-100/80 text-stone-900'
                  )}
                >
                  {item}
                </Button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="accent"
                size="sm"
                className="hidden sm:flex"
              >
                Book Visit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMenuToggle}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass mt-2 rounded-xl p-4 lg:hidden"
        >
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <Input
                type="text"
                placeholder="Tìm kiếm mộ phần..."
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
            {/* Mobile Search Results */}
            {searchValue && searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-lg border border-stone-200 overflow-hidden">
                {searchResults.slice(0, 4).map((grave, index) => (
                  <button
                    key={grave.id}
                    onClick={() => handleResultSelect(grave)}
                    className={cn(
                      "w-full px-3 py-2 flex items-center gap-2 text-left transition-colors cursor-pointer",
                      selectedIndex === index ? "bg-stone-100" : "hover:bg-stone-50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {grave.imageUrl ? (
                        <img src={grave.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-stone-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">
                        {grave.name || grave.id}
                      </p>
                      <p className="text-xs text-stone-500">{grave.area}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
          <nav className="flex flex-col gap-1">
            {['Bản đồ', 'Danh mục', 'Dịch vụ', 'Giới thiệu'].map((item) => (
              <Button
                key={item}
                variant="ghost"
                className="justify-start cursor-pointer"
              >
                {item}
              </Button>
            ))}
            <Button variant="accent" className="mt-2 cursor-pointer">
              Đặt lịch thăm viếng
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
