import { Facebook, Instagram, Youtube } from 'lucide-react';

const gettingStartedLinks = [
  { label: 'Nhu Cầu Khẩn Cấp', href: '/immediate-need' },
  { label: 'Lập Kế Hoạch Trước', href: '/pre-planning' },
];

const planningOptionsLinks = [
  { label: 'Dịch Vụ Tang Lễ', href: '/funeral-service' },
  { label: 'Đất Mộ Phần', href: '/burial-plots' },
  { label: 'Tháp Cốt', href: '/columbaria' },
  { label: 'Tưởng Niệm Thú Cưng', href: '#' },
  { label: 'Sản Phẩm Khác', href: '/others' },
];

const resourcesLinks = [
  { label: 'Về Chúng Tôi', href: '#' },
  { label: 'Địa Điểm', href: '#' },
  { label: 'Tour 360°', href: '#' },
  { label: 'Cập Nhật Mới Nhất', href: '#' },
  { label: 'Liên Hệ', href: '#' },
  { label: 'Bài Viết', href: '#' },
];

export const Footer = () => {
  return (
    <footer className="bg-[#1e293b]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Get in Touch */}
          <div>
            <h3 className="text-white text-lg font-medium mb-6">Liên Hệ</h3>
            <div className="space-y-2 mb-6">
              <p className="text-white/80 text-sm">Đường dây tư vấn: 1900 599 915</p>
              <p className="text-white/60 text-sm">info@hoavienbd.com</p>
            </div>
            <div className="mb-6">
              <p className="text-white/50 text-xs mb-1">Địa chỉ</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Hoa Viên Nghĩa Trang Bình Dương<br />
                Phường Chánh Phú Hoà, TP.HCM
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-[#1877f2] flex items-center justify-center text-white hover:opacity-80 transition-opacity cursor-pointer" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-white hover:opacity-80 transition-opacity cursor-pointer" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#ff0000] flex items-center justify-center text-white hover:opacity-80 transition-opacity cursor-pointer" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Getting Started & Planning Options */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Bắt Đầu</h4>
            <ul className="space-y-2 mb-8">
              {gettingStartedLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="text-white text-sm font-medium mb-4">Tùy Chọn Kế Hoạch</h4>
            <ul className="space-y-2">
              {planningOptionsLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Tài Nguyên</h4>
            <ul className="space-y-2">
              {resourcesLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <div className="space-y-3 mb-8">
              <a href="#" className="block border border-white/30 text-white px-4 py-2.5 text-sm hover:bg-white/10 transition-colors cursor-pointer text-center">
                E-Brochure
              </a>
              <a href="#" className="block border border-white/30 text-white px-4 py-2.5 text-sm hover:bg-white/10 transition-colors cursor-pointer text-center">
                Cổng Thông Tin Hoa Viên
              </a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block text-white/50 text-xs hover:text-white transition-colors cursor-pointer">Chính Sách Bảo Mật</a>
              <a href="#" className="block text-white/50 text-xs hover:text-white transition-colors cursor-pointer">Điều Khoản Dịch Vụ</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            © 2024 Hoa Viên Bình Dương. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};
