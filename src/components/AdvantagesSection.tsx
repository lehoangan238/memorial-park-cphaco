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
    description: "Flexible monthly payments with no interest charges.",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    description: "Our professional team is always ready to assist you.",
  },
  {
    icon: HeartHandshake,
    title: "Compassionate guidance",
    description: "Expert advice to help families make the best decisions.",
  },
  {
    icon: Award,
    title: "Award-winning service",
    description: "Recognized as Asia's leading bereavement care provider.",
  },
];

export const AdvantagesSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-nirvana-gradient opacity-[0.92]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Title & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display text-primary-foreground leading-snug mb-4">
              The 5 main<br />
              advantages of pre-<br />
              planning with<br />
              Nirvana
            </h2>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Our pre-planning program offers comprehensive benefits designed to give you and your family peace of mind.
            </p>
            <Button variant="green" size="default" className="gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              Start an Appointment
            </Button>
          </motion.div>

          {/* Right - Advantages Grid */}
          <div className="space-y-6">
            {advantages.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-primary-foreground/60">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
