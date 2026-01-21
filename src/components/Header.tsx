import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.png';

const dropdownMenus = {
  'Bắt Đầu': [
    { label: 'Nhu Cầu Khẩn Cấp', href: '/immediate-need' },
    { label: 'Lập Kế Hoạch Trước', href: '/pre-planning' },
    { label: 'Tại Sao Lập Kế Hoạch Trước', href: '#why-preplan' },
    { label: 'Cách Thức Hoạt Động', href: '#how-it-works' },
    { label: 'Câu Hỏi Thường Gặp', href: '#faq' },
    { label: 'Lời Chứng Thực', href: '#testimonials' },
    { label: 'Liên Hệ', href: '#contact' },
  ],
  'Tùy Chọn Kế Hoạch': [
    { label: 'Công Viên Tưởng Niệm', href: '#memorial-parks' },
    { label: 'Tháp Cốt', href: '/columbaria' },
    { label: 'Đất Mộ Phần', href: '/burial-plots' },
    { label: 'Dịch Vụ Tang Lễ', href: '/funeral-service' },
    { label: 'Sản Phẩm Khác', href: '/others' },
    { label: 'Tưởng Niệm Thú Cưng', href: '#pet-memorial' },
  ],
  'Tài Nguyên': [
    { label: 'Blog & Bài Viết', href: '#blog' },
    { label: 'Hướng Dẫn Kế Hoạch', href: '#guide' },
    { label: 'Máy Tính', href: '#calculator' },
    { label: 'Tải Brochure', href: '#brochure' },
    { label: 'Tin Tức & Sự Kiện', href: '#news' },
  ],
};

const navItems = [
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
  { label: 'Về Chúng Tôi', href: '#about' },
  { label: 'Liên Hệ', href: '#contact' },
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Hoa Viên Bình Dương" className="h-8 sm:h-10 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 transition-colors duration-200 py-6 cursor-pointer font-body"
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
                        className="block px-5 py-2.5 text-[14px] text-[#2f3237] hover:bg-[#0693e3] hover:text-white transition-colors duration-200 cursor-pointer"
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
              className="flex items-center gap-2 text-[14px] text-[#2f3237] cursor-pointer hover:text-[#0693e3] transition-colors duration-200"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <span className="w-5 h-5 rounded-sm overflow-hidden flex items-center justify-center text-[10px]">
                🇻🇳
              </span>
              Tiếng Việt
              <ChevronDown className="w-4 h-4" />
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#2f3237] cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full screen overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 sm:top-16 z-[9998] bg-white">
          <nav className="h-full overflow-y-auto pb-20 bg-white">
            {navItems.map((item) => (
              <div key={item.label} className="bg-white">
                <button
                  className="flex items-center justify-between w-full px-4 sm:px-6 py-4 text-sm text-[#2f3237] hover:bg-gray-50 border-b border-gray-100 min-h-[52px] cursor-pointer bg-white"
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
                        className="block px-8 sm:px-10 py-3.5 text-sm text-[#2f3237] hover:text-[#0693e3] border-b border-gray-100 last:border-0 min-h-[48px] flex items-center cursor-pointer"
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
            
            {/* Mobile Language Selector */}
            <div 
              className="flex items-center gap-2 px-4 sm:px-6 py-4 text-sm text-[#2f3237] border-b border-gray-100 min-h-[52px] cursor-pointer bg-white"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <span className="w-5 h-5 rounded-sm overflow-hidden flex items-center justify-center text-[10px]">
                🇻🇳
              </span>
              Tiếng Việt
              <ChevronDown className="w-4 h-4" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
