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
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Product List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-8">
              Our Products
            </h2>
            
            <ul className="space-y-4 mb-8">
              {products.map((product, index) => (
                <motion.li
                  key={product}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {product}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="flex gap-4">
              <Button variant="nirvana">
                Learn More
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
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
            <div className="rounded-2xl overflow-hidden card-shadow">
              <img
                src={columbarium}
                alt="Columbarium Interior"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-8 -right-8 w-24 h-24 grid grid-cols-4 gap-2">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary/20" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
