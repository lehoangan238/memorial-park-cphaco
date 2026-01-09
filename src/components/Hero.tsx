import { motion } from 'framer-motion';
import heroTrees from '@/assets/hero-trees.jpg';

const easeOut = [0.22, 1, 0.36, 1] as const;

export const Hero = () => {
  return (
    <section className="relative min-h-[55vh] flex items-center overflow-hidden">
      {/* Background Image with zoom animation */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: easeOut }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroTrees})` }}
      />
      
      {/* Dark overlay - NOT gradient */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="text-6xl md:text-7xl lg:text-8xl text-white mb-6"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Nirvana Châu Á
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
          className="text-2xl md:text-3xl text-white/90 tracking-wider"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
        >
          An Nghỉ. Yên Tâm.
        </motion.p>
      </div>
    </section>
  );
};
