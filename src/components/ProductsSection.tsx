import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import columbarium from '@/assets/columbarium.jpg';

const products = [
  "Burial Plots",
  "Columbaria",
  "Funeral Service",
  "Cremation Service",
  "Memorial Services",
  "Life Memorial Garden",
  "Pet Cremation",
];

export const ProductsSection = () => {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Product List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="text-4xl text-[#2f3237] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Products
            </h2>
            
            <ul className="space-y-3 mb-10">
              {products.map((product, index) => (
                <motion.li
                  key={product}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#0693e3] group-hover:translate-x-1 transition-transform" />
                  <span 
                    className="text-[#5e636e] text-[15px] group-hover:text-[#0693e3] transition-colors"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {product}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="flex gap-4">
              <button 
                className="border border-[#0693e3] text-[#0693e3] px-6 py-2.5 text-sm hover:bg-[#0693e3] hover:text-white transition-all"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Learn More
              </button>
              <button 
                className="px-6 py-2.5 text-white text-sm"
                style={{
                  backgroundColor: '#00d084',
                  fontFamily: "'Open Sans', sans-serif"
                }}
              >
                Get a Free Guide
              </button>
            </div>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative circular pattern */}
            <div className="absolute -top-8 -right-8 w-32 h-32 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0693e3" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#0693e3" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="#0693e3" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="#0693e3" strokeWidth="0.5" />
                {/* Radial lines */}
                {[...Array(12)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="5"
                    x2="50"
                    y2="95"
                    stroke="#0693e3"
                    strokeWidth="0.5"
                    transform={`rotate(${i * 30} 50 50)`}
                  />
                ))}
              </svg>
            </div>
            
            <div className="overflow-hidden shadow-xl">
              <img
                src={columbarium}
                alt="Columbarium Interior"
                className="w-full h-[450px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
