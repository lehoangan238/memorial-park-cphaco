import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import landscape from '@/assets/landscape.jpg';

const easeOut = [0.22, 1, 0.36, 1] as const;

export const VideoSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Watch label */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="text-center text-[#5e636e] text-sm tracking-[0.3em] mb-6"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          XEM VIDEO
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="relative overflow-hidden rounded-lg shadow-lg max-w-4xl mx-auto group"
        >
          <motion.img
            src={landscape}
            alt="Nirvana Memorial Park"
            className="w-full h-[400px] object-cover"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Play Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-colors border-2 border-white/50"
          >
            <Play className="w-6 h-6 text-[#5e636e] ml-1" fill="currentColor" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
