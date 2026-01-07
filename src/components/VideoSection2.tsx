import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import landscape from '@/assets/landscape.jpg';

export const VideoSection2 = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-lg shadow-lg max-w-5xl mx-auto"
        >
          <img
            src={landscape}
            alt="Nirvana Memorial Park Landscape"
            className="w-full h-[350px] object-cover"
          />
          
          {/* Play Button */}
          <motion.button
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
