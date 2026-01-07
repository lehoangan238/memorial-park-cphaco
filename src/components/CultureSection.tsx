import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import columbarium from '@/assets/columbarium.jpg';

export const CultureSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Image Card with Slider */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative lines */}
            <div className="absolute -top-4 -left-4 w-16 h-16">
              <div className="absolute top-0 left-2 w-8 h-[2px] bg-[#c2c9d6] rotate-45 origin-left"></div>
              <div className="absolute top-2 left-0 w-8 h-[2px] bg-[#c2c9d6] rotate-45 origin-left"></div>
              <div className="absolute top-4 left-2 w-6 h-[2px] bg-[#c2c9d6] rotate-45 origin-left"></div>
            </div>
            
            <div className="relative overflow-hidden shadow-lg">
              <img
                src={columbarium}
                alt="Rhyme of Life Columbarium"
                className="w-full h-[450px] object-cover"
              />
              
              {/* Overlay content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                <h3 
                  className="text-4xl text-white mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  Rhyme of Life
                </h3>
                <p className="text-white text-sm tracking-[0.2em] mb-4 font-light">New Launch</p>
                <p className="text-white/90 text-sm leading-relaxed mb-6 max-w-sm">
                  The "Rhyme of Life" – is an elegant and luxurious columbarium that integrates culture, style and six-star facilities.
                </p>
                <button className="self-start border border-white text-white px-6 py-2.5 text-sm tracking-wider hover:bg-white hover:text-black transition-all">
                  Read More
                </button>
              </div>
              
              {/* Slider dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <button 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all ${i === 4 ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pt-8"
          >
            <span 
              className="text-[#5e636e] text-sm tracking-[0.4em] uppercase"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              N I R V A N A
            </span>
            
            <h2 
              className="text-5xl mt-4 mb-8"
              style={{ 
                fontFamily: "'Great Vibes', cursive",
                color: '#0693e3'
              }}
            >
              Our Culture Our Future
            </h2>
            
            <p 
              className="text-[#2f3237] leading-[1.9] text-[15px] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              A culture that has stood the test of time for over a thousand years is like the flow of water – little by little, it eventually forms a rich history.{' '}
              <strong>Established in 1990,</strong> Nirvana Asia Group understands this sentiment deeply by embracing our tradition and culture with pride by offering a comprehensive suite of bereavement care services to honour and uplift life.
            </p>
            
            <a 
              href="#about" 
              className="inline-flex items-center gap-3 text-[#5e636e] text-sm tracking-[0.15em] hover:text-primary transition-colors group"
            >
              READ MORE
              <span className="w-6 h-6 rounded-full border border-[#0693e3] flex items-center justify-center text-[#0693e3] group-hover:bg-[#0693e3] group-hover:text-white transition-all">
                <Plus className="w-3 h-3" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
