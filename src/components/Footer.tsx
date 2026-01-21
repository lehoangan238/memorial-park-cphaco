import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-stone-900 text-stone-300 py-12 mt-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <MapPin className="w-5 h-5 text-stone-900" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-white">
                  Eternal Gardens
                </h3>
                <p className="text-xs text-stone-500">Since 1952</p>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              A place of peace, remembrance, and eternal rest. Serving families with dignity and compassion.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gold" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gold" />
                <span>info@eternalgardens.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                <span>123 Peaceful Lane<br />Serenity Valley, CA 90210</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Visiting Hours
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gold" />
                <span>Daily: 8:00 AM - 6:00 PM</span>
              </li>
              <li className="text-sm text-stone-500 mt-2">
                Office Hours: Mon-Fri 9AM-5PM
              </li>
              <li className="text-sm text-stone-500">
                Weekend appointments available
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Find a Memorial', 'Plan Ahead', 'Services', 'Pricing', 'FAQ', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-stone-400 hover:text-gold transition-colors cursor-pointer"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-500">
              © 2024 Eternal Gardens Memorial Park. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-stone-500 hover:text-gold transition-colors cursor-pointer">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-stone-500 hover:text-gold transition-colors cursor-pointer">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-stone-500 hover:text-gold transition-colors cursor-pointer">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
