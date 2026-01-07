import { Facebook, Instagram, Youtube } from 'lucide-react';

const gettingStartedLinks = [
  { label: 'Nhu Cầu Cấp Bách', href: '#' },
  { label: 'Lên Kế Hoạch Trước', href: '#' },
];

const planningOptionsLinks = [
  { label: 'Dịch Vụ Tang Lễ', href: '#' },
  { label: 'Lô Đất An Táng', href: '#' },
  { label: 'Nhà Lưu Trữ Tro Cốt', href: '#' },
  { label: 'Thú Cưng', href: '#' },
  { label: 'Sản Phẩm Khác', href: '#' },
];

const resourcesLinks = [
  { label: 'Về Chúng Tôi', href: '#' },
  { label: 'Chi Nhánh', href: '#' },
  { label: 'Tham Quan 360°', href: '#' },
  { label: 'Cập Nhật Mới Nhất', href: '#' },
  { label: 'Liên Hệ', href: '#' },
  { label: 'Bài Viết', href: '#' },
  { label: 'Life Cafe', href: '#' },
  { label: 'Cửa Hàng Nirvana', href: '#' },
];

export const Footer = () => {
  return (
    <footer>
      {/* Main Footer */}
      <div 
        className="py-12"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 147, 227, 1) 0%, rgb(155, 81, 224) 100%)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-10">
            {/* Get in Touch */}
            <div>
              <h3 
                className="text-white text-xl font-semibold mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Liên Hệ
              </h3>
              <p 
                className="text-white/90 text-sm mb-2"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Đường dây nóng 1800-88-1818
              </p>
              <p 
                className="text-white/80 text-sm mb-4"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                info@nvasia.com.my
              </p>
              <p 
                className="text-white/70 text-xs mb-1"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Văn Phòng Công Ty
              </p>
              <p 
                className="text-white/70 text-xs mb-4 leading-relaxed"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Tầng 9, Tháp 1, Avenue 3, The Horizon, Bangsar South,<br />
                Số 8, Jalan Kerinchi 59200 Kuala Lumpur, Malaysia.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-2">
                <a 
                  href="#" 
                  className="w-9 h-9 rounded bg-[#1877f2] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded bg-[#ff0000] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
              
              <p 
                className="text-white/50 text-xs mt-6"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                © 2024 NIRVANA ASIA. Bảo lưu mọi quyền.
              </p>
            </div>

            <div>
              <h4 
                className="text-white/80 text-sm font-semibold mb-4 tracking-wide"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Bắt Đầu
              </h4>
              <ul className="space-y-2">
                {gettingStartedLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-white/60 text-sm hover:text-white transition-colors"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              
              <h4 
                className="text-white/80 text-sm font-semibold mt-6 mb-4 tracking-wide"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Tùy Chọn Kế Hoạch
              </h4>
              <ul className="space-y-2">
                {planningOptionsLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-white/60 text-sm hover:text-white transition-colors"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 
                className="text-white/80 text-sm font-semibold mb-4 tracking-wide"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Tài Nguyên
              </h4>
              <ul className="space-y-2">
                {resourcesLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-white/60 text-sm hover:text-white transition-colors"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <button 
                  className="border border-white/50 text-white px-4 py-2 text-xs hover:bg-white/10 transition-colors text-left"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  E-Brochure
                </button>
                <button 
                  className="border border-white/50 text-white px-4 py-2 text-xs hover:bg-white/10 transition-colors text-left"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  MyNirvana
                </button>
                <button 
                  className="border border-white/50 text-white px-4 py-2 text-xs hover:bg-white/10 transition-colors text-left"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Cổng Đại Lý
                </button>
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                <a 
                  href="#" 
                  className="text-white/50 text-xs hover:text-white transition-colors"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Chính Sách Bảo Mật
                </a>
                <a 
                  href="#" 
                  className="text-white/50 text-xs hover:text-white transition-colors"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Điều Khoản Sử Dụng
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1a1f3c] py-3">
        <div className="container mx-auto px-4">
          {/* Empty bottom bar for spacing */}
        </div>
      </div>
    </footer>
  );
};
