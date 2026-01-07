import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import heroTrees from '@/assets/hero-trees.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroTrees})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(75,85,175,0.9)] via-[rgba(100,80,160,0.85)] to-[rgba(75,85,175,0.8)]" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center py-32">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-script text-white mb-4"
        >
          Nirvana Asia
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/90 font-display italic mb-12"
        >
          Caring for Life
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button variant="green" size="lg" className="text-base px-8">
            Start your planning today
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
