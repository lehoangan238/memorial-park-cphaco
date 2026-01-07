import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

const infoCards = [
  {
    title: "5 main advantages of pre-planning",
    image: familyHug,
  },
  {
    title: "When is the best time to pre-plan?",
    image: familyHug,
  },
  {
    title: "Who should pre-plan ?",
    image: familyHug,
  },
];

export const CaringSection = () => {
  return (
    <section className="relative">
      {/* Background with family image */}
      <div 
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: `url(${familyHug})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-white mb-8"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Caring for Life
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-sm md:text-base max-w-4xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Backed by integrated facilities and comprehensive products, Nirvana aims to provide a comforting experience with its internationally-acclaimed bereavement care services during a critical time of need. "Caring for Life" is our philosophy and we view every life as meaningful and precious. Be assured that our team will strive to ensure your loved one is properly honoured and celebrated with utmost professionalism and dedication.
          </motion.p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
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
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h3 
                  className="text-[#2f3237] text-sm"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {card.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
