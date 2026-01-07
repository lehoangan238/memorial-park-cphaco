import { Facebook, Instagram, Youtube } from 'lucide-react';

const gettingStartedLinks = [
  { label: 'Immediate Need', href: '#' },
  { label: 'Pre-Planning', href: '#' },
];

const planningOptionsLinks = [
  { label: 'Funeral Service', href: '#' },
  { label: 'Burial Plots', href: '#' },
  { label: 'Columbaria', href: '#' },
  { label: 'Pets', href: '#' },
  { label: 'Other Products', href: '#' },
];

const resourcesLinks = [
  { label: 'Who We Are', href: '#' },
  { label: 'Branches', href: '#' },
  { label: '360 Virtual Tour', href: '#' },
  { label: 'Latest Updates', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Article', href: '#' },
  { label: 'Life Cafe', href: '#' },
  { label: 'Nirvana Store', href: '#' },
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
                Get in Touch
              </h3>
              <p 
                className="text-white/90 text-sm mb-2"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Careline 1800-88-1818
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
                Corporate Office
              </p>
              <p 
                className="text-white/70 text-xs mb-4 leading-relaxed"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Level 9, Tower 1, Avenue 3, The Horizon, Bangsar South,<br />
                No 8, Jalan Kerinchi 59200 Kuala Lumpur, Malaysia.
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
                © 2024 NIRVANA ASIA. All Rights Reserved.
              </p>
            </div>

            {/* Getting Started */}
            <div>
              <h4 
                className="text-white/80 text-sm font-semibold mb-4 tracking-wide"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Getting Started
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
                Planning Options
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

            {/* Resources */}
            <div>
              <h4 
                className="text-white/80 text-sm font-semibold mb-4 tracking-wide"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Resources
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

            {/* Buttons */}
            <div>
              <div className="flex flex-col gap-2">
                <button 
                  className="border border-white/50 text-white px-4 py-2 text-xs hover:bg-white/10 transition-colors text-left"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  E-Booklet
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
                  Agent Portal
                </button>
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                <a 
                  href="#" 
                  className="text-white/50 text-xs hover:text-white transition-colors"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  className="text-white/50 text-xs hover:text-white transition-colors"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Terms of Use
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
