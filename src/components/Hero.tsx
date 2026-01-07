import { motion } from 'framer-motion';
import heroTrees from '@/assets/hero-trees.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroTrees})` }}
      />
      
      {/* Gradient Overlay - exact Nirvana colors */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 147, 227, 0.85) 0%, rgba(155, 81, 224, 0.8) 100%)'
        }}
      />
      
      {/* Decorative wave pattern */}
      <div className="absolute inset-0 swirl-pattern opacity-30" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center py-24">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl lg:text-8xl text-white mb-4"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Nirvana Asia
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/90 mb-10 italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Caring for Life
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button 
            className="text-base px-10 py-4 text-white font-normal tracking-wide hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: '#00d084',
              fontFamily: "'Open Sans', sans-serif"
            }}
          >
            Start your planning today
          </button>
        </motion.div>
      </div>
    </section>
  );
};
