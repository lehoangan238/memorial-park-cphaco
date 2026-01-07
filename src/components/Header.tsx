import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '#' },
  { 
    label: 'Products', 
    href: '#products',
    subItems: [
      { label: 'Burial Plots', href: '#burial' },
      { label: 'Columbaria', href: '#columbarium' },
      { label: 'Ancestral Tablets', href: '#ancestral' },
    ]
  },
  { label: 'Funeral Service', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-nirvana-gradient rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">N</span>
          </div>
          <span className={`text-xl font-display font-semibold transition-colors ${
            isScrolled ? 'text-primary' : 'text-primary-foreground'
          }`}>
            Nirvana
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <a
                href={item.href}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}
              >
                {item.label}
                {item.subItems && <ChevronDown className="w-4 h-4" />}
              </a>
              {item.subItems && (
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-card rounded-lg shadow-xl border border-border overflow-hidden min-w-[200px]">
                    {item.subItems.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-3 text-sm text-card-foreground hover:bg-secondary hover:text-primary transition-colors"
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA & Phone */}
        <div className="hidden lg:flex items-center gap-4">
          <a 
            href="tel:1800-88-3838" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isScrolled ? 'text-primary' : 'text-primary-foreground'
            }`}
          >
            <Phone className="w-4 h-4" />
            1800-88-3838
          </a>
          <Button variant="nirvana" size="sm">
            Make Appointment
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 transition-colors ${
            isScrolled ? 'text-foreground' : 'text-primary-foreground'
          }`}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className="bg-card border-t border-border mt-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-6 py-4 text-sm font-medium text-card-foreground hover:bg-secondary hover:text-primary border-b border-border last:border-0 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="p-4 border-t border-border">
            <Button variant="nirvana" className="w-full">
              Make Appointment
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
