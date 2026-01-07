import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import heroPark from '@/assets/hero-park.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroPark})` }}
      />
      
      {/* Gradient Overlay with decorative swirls */}
      <div className="absolute inset-0 hero-gradient swirl-pattern" />
      
      {/* Decorative SVG curves */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <path d="M0,100 Q200,50 400,100 T800,100" fill="none" stroke="white" strokeWidth="1" className="animate-float" />
        <path d="M0,200 Q300,150 500,200 T1000,200" fill="none" stroke="white" strokeWidth="1" style={{ animationDelay: '1s' }} className="animate-float" />
        <path d="M0,300 Q250,250 450,300 T900,300" fill="none" stroke="white" strokeWidth="1" style={{ animationDelay: '2s' }} className="animate-float" />
      </svg>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center py-32">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-display text-primary-foreground mb-6"
        >
          Nirvana Asia
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-primary-foreground/90 font-display italic mb-10"
        >
          Caring for Life
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button variant="nirvana" size="lg" className="text-base">
            Start your planning today
          </Button>
        </motion.div>
      </div>
      
      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 100V50C240 0 480 0 720 25C960 50 1200 100 1440 75V100H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};
