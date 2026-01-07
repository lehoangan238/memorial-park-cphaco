import { motion } from 'framer-motion';
import coupleBeach from '@/assets/couple-beach.jpg';

export const CultureSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src={coupleBeach}
                alt="Happy elderly couple on beach"
                className="w-full h-[380px] object-cover"
              />
            </div>
            {/* Info boxes overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-2 rounded text-xs">
                <span className="font-semibold">Peace of Mind</span>
              </div>
              <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-2 rounded text-xs">
                <span className="font-semibold">Love</span>
              </div>
              <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-2 rounded text-xs">
                <span className="font-semibold">Your Family</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary text-sm font-medium uppercase tracking-widest">Our Culture</span>
            <h2 className="text-4xl md:text-5xl font-script text-primary mt-2 mb-6">
              Our Culture Our Future
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
              At Nirvana Asia, we understand that our cultural heritage, our history and our traditions have shaped who we are, 
              and inform how we live and make decisions.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm">
              To better honour your past and loved ones while giving peace of mind for your family's future, 
              we provide a range of products and services for your consideration today.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
