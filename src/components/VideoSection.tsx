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
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="text-center text-[#5e636e] text-sm tracking-[0.3em] mb-6"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          XEM VIDEO
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="relative overflow-hidden rounded-lg shadow-lg max-w-4xl mx-auto group"
        >
          <img
            src={landscape}
            alt="Nirvana Memorial Park"
            className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          />
          
          {/* Play Button */}
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all border-2 border-white/50"
          >
            <Play className="w-6 h-6 text-[#5e636e] ml-1" fill="currentColor" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
