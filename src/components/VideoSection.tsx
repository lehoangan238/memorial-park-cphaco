import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import landscape from '@/assets/landscape.jpg';

export const VideoSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src={landscape}
            alt="Nirvana Memorial Park"
            className="w-full h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-foreground/95 rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-foreground transition-colors"
          >
            <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
