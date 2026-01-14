import { motion } from 'framer-motion';
import heroTrees from '@/assets/linh-hoa-tue-dan.jpg';

const easeOut = [0.22, 1, 0.36, 1] as const;

export const Hero = () => {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex flex-col">
      {/* Background Image with zoom animation */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: easeOut }}
        className="absolute inset-0 bg-cover bg-no-repeat will-change-transform"
        style={{ 
          backgroundImage: `url(${heroTrees})`,
          backgroundPosition: 'center 20%'
        }}
      />
      
      {/* Bottom fog/cloud effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 md:h-32 bg-gradient-to-t from-white/80 via-white/40 to-transparent z-[1]" />
      
      {/* Content - empty, just showing the image */}
      <div className="flex-1" />

      {/* Careline Bar - Full width on mobile, curved pill on desktop */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
        className="absolute left-0 right-0 sm:right-auto z-50 bottom-0 sm:-bottom-7"
      >
        <div className="bg-[#4a6cb3] text-white py-3 sm:py-4 px-4 sm:px-10 sm:pr-20 text-center sm:text-left rounded-none sm:rounded-r-[50px]">
          <span className="text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium">
            ĐƯỜNG DÂY TƯ VẤN : <span className="font-semibold">1900 599 915</span>
          </span>
        </div>
      </motion.div>
    </section>
  );
};
