import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

export const QuoteSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Left - Blue Quote Section */}
        <div 
          className="py-16 px-8 lg:px-16 relative"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 147, 227, 1) 0%, rgb(155, 81, 224) 100%)'
          }}
        >
          {/* Diagonal cut effect */}
          <div 
            className="absolute top-0 right-0 w-32 h-full bg-white hidden lg:block"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
            }}
          />
          
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white text-lg leading-relaxed max-w-md"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
          >
            "We put together many things to enrich our lives by embracing new goals and living the healthy way. We can also pre-plan a worry-free final journey by taking complete responsibility for our own life and happiness – because we deserve peace of mind – now and forever."
          </motion.blockquote>
        </div>

        {/* Right - Image */}
        <div 
          className="h-64 lg:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${familyHug})` }}
        />
      </div>
    </section>
  );
};
