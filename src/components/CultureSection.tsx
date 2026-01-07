import { motion } from 'framer-motion';
import family1 from '@/assets/family-1.jpg';

export const CultureSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden card-shadow">
              <img
                src={family1}
                alt="Happy family gathering"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-nirvana-gradient rounded-2xl -z-10 opacity-20" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Our Culture</span>
            <h2 className="text-4xl md:text-5xl font-display text-foreground mt-3 mb-6 leading-tight">
              Our Culture <br />Our Future
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At Nirvana Asia, we understand that our cultural heritage, our history and our traditions have shaped who we are, 
              and inform how we live and make decisions. To better honour your past and loved ones while giving peace of mind 
              for your family's future, we provide a range of products and services for your consideration today.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our commitment is to help you protect what matters most - your legacy and your loved ones' memories.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
