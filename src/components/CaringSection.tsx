import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import familyHug from '@/assets/family-hug.jpg';
import familyGenerations from '@/assets/family-generations.jpg';

const infoCards = [
  {
    title: "5 main advantages of pre-planning",
    icon: "📋",
  },
  {
    title: "What's the best time to start plan?",
    icon: "⏰",
  },
  {
    title: "Why should we plan?",
    icon: "❓",
  },
];

export const CaringSection = () => {
  return (
    <section className="py-16 bg-secondary/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-script text-primary mb-4">
            Caring for Life
          </h2>
          <p className="text-muted-foreground text-sm max-w-3xl mx-auto leading-relaxed">
            A first-of-its-kind pre-planning program designed to help protect and sustain the things that matter most 
            to you and your loved ones. Together, we seek to give meaning to our lives, celebrate our culture, 
            and invest in our families' legacy.
          </p>
        </motion.div>

        {/* Family Images Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <img src={familyHug} alt="Family together" className="w-full h-[280px] object-cover hover:scale-105 transition-transform duration-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <img src={familyGenerations} alt="Multi-generation family" className="w-full h-[280px] object-cover hover:scale-105 transition-transform duration-500" />
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {infoCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-border hover:border-primary/20 flex items-center gap-4"
            >
              <span className="text-2xl">{card.icon}</span>
              <div className="flex-1">
                <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
              </div>
              <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
