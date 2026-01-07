import { Facebook, Instagram, Youtube } from 'lucide-react';

const gettingStartedLinks = [
  { label: 'Nhu Cầu Cấp Bách', href: '#' },
  { label: 'Lên Kế Hoạch Trước', href: '#' },
];

const planningOptionsLinks = [
  { label: 'Dịch Vụ Tang Lễ', href: '#' },
  { label: 'Lô Đất An Táng', href: '#' },
  { label: 'Nhà Lưu Trữ Tro Cốt', href: '#' },
  { label: 'Sản Phẩm Khác', href: '#' },
];

const resourcesLinks = [
  { label: 'Về Chúng Tôi', href: '#' },
  { label: 'Chi Nhánh', href: '#' },
  { label: 'Tham Quan 360°', href: '#' },
  { label: 'Cập Nhật Mới Nhất', href: '#' },
  { label: 'Liên Hệ', href: '#' },
  { label: 'Bài Viết', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'Cửa Hàng Nirvana', href: '#' },
];

export const Footer = () => {
  return (
    <footer>
      {/* Main Footer with 2 columns */}
      <div className="grid lg:grid-cols-[1fr_2fr]">
        {/* Left - Contact Info with Primary Color */}
        <div 
          className="py-12 px-8 lg:px-12"
          style={{ backgroundColor: '#4453c4' }}
        >
          <h3 
            className="text-white text-2xl font-semibold mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Liên Hệ
          </h3>
          <p className="text-white/90 text-sm mb-1">
            Đường dây nóng 1800-88-1818
          </p>
          <p className="text-white/80 text-sm mb-6">
            info@nvasia.com.my
          </p>
          
          <p className="text-white/70 text-xs mb-1">
            Văn Phòng Công Ty
          </p>
          <p className="text-white/70 text-xs leading-relaxed mb-6">
            Wisma Nirvana, No. 3, Persiaran Tasik, Desa Parkcity<br />
            Sri Petaling, 57000 Kuala Lumpur, Malaysia
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-3">
            <a 
              href="#" 
              className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              <span className="text-sm">f</span>
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right - Links with Dark Background */}
        <div 
          className="py-12 px-8 lg:px-12"
          style={{ backgroundColor: '#1a1d2e' }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Getting Started & Planning Options */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">
                Bắt Đầu
              </h4>
              <ul className="space-y-2 mb-6">
                {gettingStartedLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              
              <h4 className="text-white text-sm font-semibold mb-4">
                Tùy Chọn Kế Hoạch
              </h4>
              <ul className="space-y-2">
                {planningOptionsLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">
                Tài Nguyên
              </h4>
              <ul className="space-y-2">
                {resourcesLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buttons & Policies */}
            <div>
              <div className="flex flex-col gap-2 mb-6">
                <button className="border border-gray-600 text-gray-400 px-4 py-2.5 text-sm hover:border-white hover:text-white transition-colors text-left">
                  E-Brochure
                </button>
                <button className="border border-gray-600 text-gray-400 px-4 py-2.5 text-sm hover:border-white hover:text-white transition-colors text-left">
                  MyNirvana
                </button>
                <button className="border border-gray-600 text-gray-400 px-4 py-2.5 text-sm hover:border-white hover:text-white transition-colors text-left">
                  Cổng Đại Lý
                </button>
              </div>
              
              <div className="flex flex-col gap-2">
                <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">
                  Chính Sách Bảo Mật
                </a>
                <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">
                  Điều Khoản Sử Dụng
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div 
        className="py-4 text-center"
        style={{ backgroundColor: '#0d0f1a' }}
      >
        <p className="text-gray-500 text-sm">
          © 2024 NIRVANA ASIA. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
};
