import { motion } from 'framer-motion';
import { Play, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-32">
        <div className="max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium mb-6"
          >
            Hơn 30 năm kinh nghiệm
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display text-primary-foreground leading-tight mb-6 text-shadow"
          >
            Chăm Sóc Cho <br />
            <span className="text-gold">Cuộc Sống</span> & Tương Lai
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl leading-relaxed"
          >
            Nirvana cung cấp dịch vụ tang lễ và sản phẩm tưởng niệm chuyên nghiệp, 
            giúp gia đình bạn có sự an tâm và chuẩn bị chu đáo cho tương lai.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Button variant="gold" size="lg" className="gap-2">
              <Calendar className="w-5 h-5" />
              Đặt lịch tư vấn miễn phí
            </Button>
            <Button variant="hero" size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Xem tour 360°
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-gold rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};
