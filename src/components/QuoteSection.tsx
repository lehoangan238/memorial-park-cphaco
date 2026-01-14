import { motion } from 'framer-motion';
import coupleBeach from '@/assets/couple-beach.jpg';

const easeOut = [0.22, 1, 0.36, 1] as const;

export const QuoteSection = () => {
  return (
    <section className="relative">
      <div 
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{ backgroundImage: `url(${coupleBeach})` }}
      >
        <div className="absolute inset-0 bg-[#3B82F6]/85" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-light">
              "When pre-planning your memorial arrangements, you're not just preparing for the inevitable. 
              You're creating a lasting gift of peace and clarity for your loved ones, ensuring they can 
              focus on celebrating your life rather than making difficult decisions during a challenging time."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
