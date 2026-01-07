import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import familyHug from '@/assets/family-hug.jpg';
import familyGenerations from '@/assets/family-generations.jpg';

const infoCards = [
  {
    title: "5 main advantages of pre-planning",
    image: familyHug,
  },
  {
    title: "What's the best choice for you",
    image: familyGenerations,
  },
  {
    title: "Why should I pre-plan?",
    image: familyHug,
  },
];

export const CaringSection = () => {
  return (
    <section className="relative">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${familyHug})` }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 147, 227, 0.85) 0%, rgba(155, 81, 224, 0.8) 100%)'
        }}
      />
      
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 
              className="text-5xl md:text-6xl text-white mb-6"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Caring for Life
            </h2>
            <p 
              className="text-white/90 text-base max-w-4xl mx-auto leading-relaxed mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              A first-of-its-kind pre-planning program designed to help protect and sustain the things that matter most 
              to you and your loved ones. Together, we seek to give meaning to our lives, celebrate our culture, 
              and invest in our families' legacy.
            </p>
            <button 
              className="px-8 py-3 text-white text-sm tracking-wider hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: '#00d084',
                fontFamily: "'Open Sans', sans-serif"
              }}
            >
              START YOUR PLANNING TODAY
            </button>
          </motion.div>
        </div>
      </div>

      {/* Info Cards - outside the gradient overlay */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {infoCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <h3 
                    className="text-[#2f3237] text-sm group-hover:text-[#0693e3] transition-colors"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-[#0693e3] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
