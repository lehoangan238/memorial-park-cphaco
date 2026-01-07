import { motion } from 'framer-motion';
import { Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTA = () => {
  return (
    <section className="py-24 bg-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-gold text-sm font-medium uppercase tracking-wider mb-4"
          >
            Bắt đầu ngay hôm nay
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display text-background mb-6"
          >
            Lập Kế Hoạch Cho <span className="text-gold">Sự An Tâm</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-background/70 text-lg mb-10 max-w-2xl mx-auto"
          >
            Đừng để những quyết định khó khăn phải đưa ra trong lúc đau buồn. 
            Hãy để chúng tôi giúp bạn chuẩn bị từ hôm nay.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button variant="gold" size="lg" className="gap-2">
              <Calendar className="w-5 h-5" />
              Đặt lịch tư vấn miễn phí
            </Button>
            <Button variant="outline" size="lg" className="gap-2 border-background/20 text-background hover:bg-background/10">
              <Phone className="w-5 h-5" />
              1800-88-3838
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 text-background/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              Kuala Lumpur
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              Penang
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              Johor Bahru
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              Melaka
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
