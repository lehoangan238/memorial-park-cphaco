import { motion } from 'framer-motion';
import heroTrees from '@/assets/hero-trees.jpg';

const advantages = [
  {
    title: "Build an everlasting legacy",
    description: "Create a meaningful tribute that honors your family's heritage and values for generations to come.",
  },
  {
    title: "Ease your family's burden",
    description: "Relieve your loved ones from making difficult decisions during an emotional time.",
  },
  {
    title: "60-month interest-free installment plan",
    description: "Flexible payment options that make planning accessible and affordable.",
  },
  {
    title: "Compassionate care",
    description: "Our dedicated team provides personalized guidance with empathy and respect.",
  },
  {
    title: "Comprehensive post-need services",
    description: "Complete support for your family when they need it most.",
  },
];

export const AdvantagesSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Left - Image */}
        <div className="relative min-h-[600px]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroTrees})` }}
          />
        </div>

        {/* Right - Content */}
        <div 
          className="py-16 px-8 lg:px-16"
          style={{
            background: 'linear-gradient(180deg, #1a1f3c 0%, #2d2a4a 100%)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-3xl md:text-4xl text-white leading-snug mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The 5 main<br />
              advantages of pre-<br />
              planning with<br />
              Nirvana
            </h2>
            <p 
              className="text-white/60 text-sm mb-8"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Don't wait to plan for what matters
            </p>
            <button 
              className="px-6 py-3 text-white text-sm tracking-wide mb-12"
              style={{
                backgroundColor: '#00d084',
                fontFamily: "'Open Sans', sans-serif"
              }}
            >
              Start the conversation
            </button>
          </motion.div>

          {/* Advantages Grid */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            {advantages.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 
                  className="text-white text-sm font-semibold mb-2"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-white/50 text-xs leading-relaxed"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
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
