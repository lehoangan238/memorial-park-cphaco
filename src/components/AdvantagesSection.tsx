import { motion } from 'framer-motion';
import { Shield, Percent, Compass, PawPrint, Building2 } from 'lucide-react';

const advantages = [
  {
    icon: Shield,
    title: "RM100 million maintenance trust fund",
    description: "Nirvana's memorial parks are backed by a maintenance trust fund of over RM100 million managed by an independent trustee for road works, garden landscaping and infrastructure maintenance.",
  },
  {
    icon: Percent,
    title: "0% interest",
    description: "Enjoy peace of mind with our 0% interest instalment plan up to 36 months with low down payment.",
    customIcon: true,
  },
  {
    icon: Compass,
    title: "Excellent Feng Shui",
    description: "Our memorial parks are endorsed by renowned Feng Shui masters for having excellent Feng Shui.",
  },
  {
    icon: PawPrint,
    title: "Comprehensive facilities",
    description: "Our numerous memorial parks and integrated centres has comprehensive facilities with professional service support.",
  },
  {
    icon: Building2,
    title: "Majestic architecture",
    description: "Each of our memorial parks are designed with elegant and majestic architecture to ensure peace and comfort.",
  },
];

export const AdvantagesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Title & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl md:text-5xl text-[#2f3237] leading-tight mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The 5 main<br />
              advantages of pre-<br />
              planning with<br />
              Nirvana
            </h2>
            <p 
              className="text-[#5e636e] text-sm mb-8"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Your needs are our utmost concern
            </p>
            <button 
              className="px-8 py-3 text-white text-sm tracking-wide"
              style={{
                backgroundColor: '#0693e3',
                fontFamily: "'Open Sans', sans-serif"
              }}
            >
              MAKE AN APPOINTMENT
            </button>
          </motion.div>

          {/* Right - Advantages Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {advantages.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full border border-[#0693e3] flex items-center justify-center mb-4">
                  {item.customIcon ? (
                    <span 
                      className="text-[#0693e3] text-lg font-semibold"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      0%
                    </span>
                  ) : (
                    <item.icon className="w-6 h-6 text-[#0693e3]" strokeWidth={1.5} />
                  )}
                </div>
                
                <h3 
                  className="text-[#2f3237] text-sm font-semibold mb-2"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-[#5e636e] text-xs leading-relaxed"
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
