import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import columbarium from '@/assets/columbarium.jpg';

const products = [
  "Burial Plots",
  "Columbaria",
  "Funeral Service",
  "Cremation Service",
  "Ancestral Tablets",
  "Life Memorial Garden",
  "Pet Haven",
];

export const ProductsSection = () => {
  return (
    <section id="products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left - Product List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-display text-foreground mb-6">
              Our Products
            </h2>
            
            <ul className="space-y-3 mb-8">
              {products.map((product, index) => (
                <motion.li
                  key={product}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                    {product}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs">
                Learn More
              </Button>
              <Button variant="green" size="sm" className="text-xs">
                360 Virtual Tour
              </Button>
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
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src={columbarium}
                alt="Columbarium Interior"
                className="w-full h-[420px] object-cover"
              />
            </div>
            {/* Decorative dots grid */}
            <div className="absolute -top-6 -right-6 w-20 h-20 grid grid-cols-4 gap-1.5 opacity-30">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
