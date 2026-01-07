import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'Burial Plots', href: '#' },
    { label: 'Columbaria', href: '#' },
    { label: 'Funeral Service', href: '#' },
    { label: 'Ancestral Tablets', href: '#' },
    { label: 'Pet Haven', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'News', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Partners', href: '#' },
  ],
  support: [
    { label: 'FAQ', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Promotions', href: '#' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Contact Bar */}
      <div className="bg-nirvana-gradient py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-display">Get In Touch</h3>
              <p className="text-primary-foreground/80 text-sm">Hotline: 1800-88-3838</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-display font-semibold">Nirvana</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6 max-w-sm">
              Nirvana is Malaysia's leading bereavement care services provider, 
              with over 30 years of experience serving the community.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1" />
                <div>
                  <p className="text-sm text-primary-foreground/70">Hotline 24/7</p>
                  <p className="font-semibold">1800-88-3838</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1" />
                <p className="text-sm">info@nirvana.com.my</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1" />
                <p className="text-sm text-primary-foreground/70">Kuala Lumpur, Malaysia</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            © 2024 Nirvana Asia. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
