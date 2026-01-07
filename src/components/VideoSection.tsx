import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import landscape from '@/assets/landscape.jpg';

export const VideoSection = () => {
  return (
    <section className="py-0 bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden"
      >
        <img
          src={landscape}
          alt="Nirvana Memorial Park"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-colors"
        >
          <Play className="w-8 h-8 text-[#0693e3] ml-1" fill="currentColor" />
        </motion.button>
      </motion.div>
    </section>
  );
};
