import { motion } from 'framer-motion';
import { Shield, Wallet, Clock, HeartHandshake, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const advantages = [
  {
    icon: Shield,
    title: "RM100 million maintenance fund",
    description: "Ensuring perpetual care and maintenance of the grounds.",
  },
  {
    icon: Wallet,
    title: "0% interest installment",
    description: "Flexible monthly payments with no additional charges.",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    description: "Our professional team is always ready to assist.",
  },
  {
    icon: HeartHandshake,
    title: "Compassionate guidance",
    description: "Expert advice to help families make informed decisions.",
  },
  {
    icon: Award,
    title: "Award-winning service",
    description: "Recognized as Asia's leading bereavement care provider.",
  },
];

export const AdvantagesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-nirvana-gradient opacity-95" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Title & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display text-primary-foreground leading-tight mb-6">
              The 5 main advantages of pre-planning with Nirvana
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Our pre-planning program offers comprehensive benefits designed to give you and your family peace of mind.
            </p>
            <Button variant="hero" size="lg" className="gap-2">
              <Calendar className="w-5 h-5" />
              Start an Appointment
            </Button>
          </motion.div>

          {/* Right - Advantages Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {advantages.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4 group-hover:bg-primary-foreground/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg text-primary-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
