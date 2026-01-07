import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, ShoppingCart, Phone } from 'lucide-react';

const navItems = [
  { label: 'Enlightenment Ceremony', href: '#ceremony' },
  { 
    label: 'Getting Started', 
    href: '#started',
    hasDropdown: true
  },
  { 
    label: 'Planning Options', 
    href: '#planning',
    hasDropdown: true
  },
  { 
    label: 'Resources', 
    href: '#resources',
    hasDropdown: true
  },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span 
              className="text-2xl text-[#2f3237]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              富貴
            </span>
            <span 
              className="text-xl tracking-[0.2em] text-[#2f3237] font-light"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              N<span className="text-lg">IRVANA</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 text-[14px] text-[#2f3237] hover:text-[#0693e3] transition-colors"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </a>
            ))}
            
            {/* Language Selector */}
            <div 
              className="flex items-center gap-2 text-[14px] text-[#2f3237] cursor-pointer"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <span className="w-5 h-5 rounded-sm overflow-hidden bg-blue-800 flex items-center justify-center text-white text-[10px]">
                🇬🇧
              </span>
              English
              <ChevronDown className="w-4 h-4" />
            </div>
          </nav>

          {/* Right side icons */}
          <div className="hidden lg:flex items-center gap-5">
            <button className="text-[#2f3237] hover:text-[#0693e3] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <a 
              href="#cart" 
              className="flex items-center gap-1.5 text-[14px] text-[#2f3237] hover:text-[#0693e3] transition-colors"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
            </a>
            <a 
              href="tel:1800-88-1818" 
              className="flex items-center gap-1.5 text-[14px] text-[#2f3237] hover:text-[#0693e3] transition-colors"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <Phone className="w-5 h-5" />
              Contact
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#2f3237]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className="bg-white border-t border-gray-100">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-6 py-3 text-sm text-[#2f3237] hover:bg-gray-50 border-b border-gray-100 last:border-0"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
            </a>
          ))}
          <div className="flex items-center justify-around py-4 border-t border-gray-100">
            <a href="#" className="text-[#2f3237]"><Search className="w-5 h-5" /></a>
            <a href="#" className="text-[#2f3237]"><ShoppingCart className="w-5 h-5" /></a>
            <a href="#" className="text-[#2f3237]"><Phone className="w-5 h-5" /></a>
          </div>
        </nav>
      </div>
    </header>
  );
};
