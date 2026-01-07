import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import family2 from '@/assets/family-2.jpg';
import family3 from '@/assets/family-3.jpg';

const infoCards = [
  {
    title: "5 main advantages of pre-planning",
    description: "Learn why planning ahead brings peace of mind for you and your family.",
  },
  {
    title: "What's the best time to plan?",
    description: "Discover when is the optimal time to start your pre-planning journey.",
  },
  {
    title: "Why should we plan?",
    description: "Understanding the importance of planning for your family's future.",
  },
];

export const CaringSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display text-foreground italic">
            Caring for Life
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
            A first-of-its-kind pre-planning program designed to help protect and sustain the things that matter most 
            to you and your loved ones. Together, we seek to give meaning to our lives, celebrate our culture, 
            and invest in our families' legacy.
          </p>
        </motion.div>

        {/* Family Images Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden card-shadow"
          >
            <img src={family2} alt="Family outdoor" className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden card-shadow"
          >
            <img src={family3} alt="Multi-generation family" className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-500" />
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {infoCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-card rounded-xl p-6 card-shadow hover:shadow-xl transition-all duration-300 cursor-pointer border border-border hover:border-primary/30"
            >
              <h3 className="font-display text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {card.description}
              </p>
              <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
