import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';

const locations = [
  "Semenyih", "Sungai Besi", "Shah Alam", "Klang", "Rawang", "Melaka", "Kulai", "Ipoh"
];

const quickLinks = [
  { label: 'Burial Plots', href: '#' },
  { label: 'Columbaria', href: '#' },
  { label: 'Funeral Service', href: '#' },
  { label: 'Pre-planning', href: '#' },
  { label: 'Promotions', href: '#' },
];

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Contact Bar */}
      <div className="bg-nirvana-gradient py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Get In Touch</h3>
              <p className="text-primary-foreground/80 text-sm">Hotline: 1800-88-3838</p>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-sm text-primary-foreground/80">SIGN UP FOR LATEST UPDATE</p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-foreground">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Contact */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">富</span>
                </div>
                <span className="font-display font-semibold">Nirvana</span>
              </div>
              <div className="space-y-2 text-sm text-background/70">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  1800-88-3838
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@nirvana.com.my
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-4 text-sm">Our Locations</h4>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <span key={location} className="text-xs text-background/60 bg-background/10 px-2 py-1 rounded">
                    {location}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10">
          <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-background/40">
              © 2024 Nirvana Asia. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-background/40">
              <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-background transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-background transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
