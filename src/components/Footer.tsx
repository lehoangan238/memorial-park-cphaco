import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'Phần mộ gia đình', href: '#' },
    { label: 'Nhà tro cốt', href: '#' },
    { label: 'Dịch vụ tang lễ', href: '#' },
    { label: 'Bài vị thờ cúng', href: '#' },
    { label: 'Đèn phước lành vĩnh cửu', href: '#' },
  ],
  company: [
    { label: 'Về chúng tôi', href: '#' },
    { label: 'Tin tức', href: '#' },
    { label: 'Nghề nghiệp', href: '#' },
    { label: 'Đối tác', href: '#' },
  ],
  support: [
    { label: 'Câu hỏi thường gặp', href: '#' },
    { label: 'Liên hệ', href: '#' },
    { label: 'Khuyến mãi', href: '#' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-display text-background mb-4">NIRVANA</h3>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              Nirvana là nhà cung cấp dịch vụ chăm sóc tang lễ và sản phẩm tưởng niệm hàng đầu tại Malaysia, 
              với hơn 30 năm kinh nghiệm phục vụ cộng đồng.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-gold hover:text-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-gold hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-gold hover:text-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-background font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-gold transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-background font-semibold mb-4">Công ty</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-gold transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-background font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold mt-1" />
                <div>
                  <p className="text-sm">Hotline 24/7</p>
                  <p className="text-background font-semibold">1800-88-3838</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-1" />
                <div>
                  <p className="text-sm">Email</p>
                  <p className="text-background">info@nirvana.com.my</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-1" />
                <div>
                  <p className="text-sm">Trụ sở chính</p>
                  <p className="text-background text-sm">Kuala Lumpur, Malaysia</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2024 Nirvana Asia. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-background/50">
            <a href="#" className="hover:text-gold transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-gold transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
