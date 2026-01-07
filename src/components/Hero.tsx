import { motion } from 'framer-motion';
import heroTrees from '@/assets/hero-trees.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-[55vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroTrees})` }}
      />
      
      {/* Dark overlay - NOT gradient */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl lg:text-8xl text-white mb-6"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Nirvana Asia
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl text-white/90 tracking-wider"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
        >
          Rest. Assured.
        </motion.p>
      </div>
    </section>
  );
};
