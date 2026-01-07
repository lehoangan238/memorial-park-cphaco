import { Facebook, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer>
      {/* Get in Touch Section */}
      <div 
        className="py-12"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 147, 227, 1) 0%, rgb(155, 81, 224) 100%)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left - Contact Info */}
            <div>
              <h3 
                className="text-white text-xl font-semibold mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Get in Touch
              </h3>
              <p 
                className="text-white/90 text-sm mb-1"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Careline 1800-88-1818
              </p>
              <p 
                className="text-white/70 text-xs"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                NIRVANA ASIA LTD | 0909, FLOOR 9, TOWER<br />
                2, ETIQA TWINS, NO.11, JALAN PINANG,<br />
                50450 KUALA LUMPUR
              </p>
            </div>

            {/* Right - Social & Newsletter */}
            <div className="text-right">
              <p 
                className="text-white/80 text-xs mb-3 tracking-wider"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                SIGN UP FOR LATEST UPDATE
              </p>
              <div className="flex gap-3 justify-end">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1a1f3c] py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span 
                className="text-white/60 text-xs"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                © 2024 Nirvana Asia Ltd. All Rights Reserved.
              </span>
            </div>
            <div 
              className="flex gap-4 text-xs text-white/60"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <a href="#" className="hover:text-white transition-colors">Personal Data Protection</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
