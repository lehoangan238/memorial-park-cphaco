import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, ShoppingCart, Phone } from 'lucide-react';

const dropdownMenus = {
  'Bắt Đầu': [
    { label: 'Tại Sao Nên Lên Kế Hoạch Trước', href: '#why-preplan' },
    { label: 'Cách Thức Hoạt Động', href: '#how-it-works' },
    { label: 'Câu Hỏi Thường Gặp', href: '#faq' },
    { label: 'Đánh Giá Khách Hàng', href: '#testimonials' },
    { label: 'Liên Hệ', href: '#contact' },
  ],
  'Tùy Chọn Kế Hoạch': [
    { label: 'Công Viên Tưởng Niệm', href: '#memorial-parks' },
    { label: 'Nhà Lưu Trữ Tro Cốt', href: '/columbaria' },
    { label: 'Lô Đất An Táng', href: '/burial-plots' },
    { label: 'Dịch Vụ Tang Lễ', href: '/funeral-service' },
    { label: 'Sản Phẩm Khác', href: '/others' },
    { label: 'Khu Mộ Gia Đình', href: '#family-estates' },
    { label: 'Tưởng Niệm Thú Cưng', href: '#pet-memorial' },
  ],
  'Tài Nguyên': [
    { label: 'Blog & Bài Viết', href: '#blog' },
    { label: 'Hướng Dẫn Lập Kế Hoạch', href: '#guide' },
    { label: 'Công Cụ Tính Toán', href: '#calculator' },
    { label: 'Tải Brochure', href: '#brochure' },
    { label: 'Tin Tức & Sự Kiện', href: '#news' },
  ],
};

const navItems = [
  { label: 'Lễ Khai Sáng', href: '#ceremony' },
  { 
    label: 'Bắt Đầu', 
    href: '#started',
    hasDropdown: true
  },
  { 
    label: 'Tùy Chọn Kế Hoạch', 
    href: '#planning',
    hasDropdown: true
  },
  { 
    label: 'Tài Nguyên', 
    href: '#resources',
    hasDropdown: true
  },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);

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
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-[14px] text-[#2f3237] hover:text-[#0693e3] transition-colors py-6"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </a>
                
                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div 
                    className="absolute top-full left-0 bg-white shadow-lg rounded-md border border-gray-100 min-w-[220px] py-2 z-50"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {dropdownMenus[item.label as keyof typeof dropdownMenus]?.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-5 py-2.5 text-[14px] text-[#2f3237] hover:bg-[#0693e3] hover:text-white transition-colors"
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Language Selector */}
            <div 
              className="flex items-center gap-2 text-[14px] text-[#2f3237] cursor-pointer"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <span className="w-5 h-5 rounded-sm overflow-hidden bg-red-600 flex items-center justify-center text-white text-[10px]">
                🇻🇳
              </span>
              Tiếng Việt
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
              Giỏ Hàng
            </a>
            <a 
              href="tel:1800-88-1818" 
              className="flex items-center gap-1.5 text-[14px] text-[#2f3237] hover:text-[#0693e3] transition-colors"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <Phone className="w-5 h-5" />
              Liên Hệ
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
        isMobileMenuOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className="bg-white border-t border-gray-100">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                className="flex items-center justify-between w-full px-6 py-3 text-sm text-[#2f3237] hover:bg-gray-50 border-b border-gray-100"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
                onClick={() => {
                  if (item.hasDropdown) {
                    setMobileActiveDropdown(mobileActiveDropdown === item.label ? null : item.label);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileActiveDropdown === item.label ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </button>
              
              {/* Mobile Dropdown */}
              {item.hasDropdown && mobileActiveDropdown === item.label && (
                <div className="bg-gray-50">
                  {dropdownMenus[item.label as keyof typeof dropdownMenus]?.map((subItem) => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-10 py-2.5 text-sm text-[#2f3237] hover:text-[#0693e3] border-b border-gray-100 last:border-0"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
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
