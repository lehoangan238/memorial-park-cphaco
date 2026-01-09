import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

const easeOut = [0.22, 1, 0.36, 1] as const;

export const QuoteSection = () => {
  return (
    <section className="relative pb-[200px] lg:pb-[250px]">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Blue Quote Box */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="lg:w-auto relative z-10"
        >
          <div 
            className="py-12 lg:py-16 px-8 lg:px-12 lg:pr-16 flex items-center relative"
            style={{ backgroundColor: '#4a5aef' }}
          >
            {/* Cyan left border INSIDE the box */}
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
              className="absolute left-6 top-8 bottom-8 w-1 origin-top"
              style={{ backgroundColor: '#00d4ff' }}
            />
            
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7, ease: easeOut }}
              className="text-white text-lg md:text-xl leading-relaxed max-w-md ml-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            >
              "Chúng ta kết hợp nhiều thứ để làm phong phú cuộc sống bằng cách đón nhận những mục tiêu mới và sống theo cách lành mạnh. Chúng ta cũng có thể lên kế hoạch trước cho một hành trình cuối cùng không lo lắng bằng cách chịu trách nhiệm hoàn toàn cho cuộc sống và hạnh phúc của chính mình – vì chúng ta xứng đáng được an tâm – bây giờ và mãi mãi."
            </motion.blockquote>
          </div>
        </motion.div>
        
        {/* Right: Image - 90% width, centered */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2, duration: 0.8, ease: easeOut }}
          className="lg:w-[90%] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/4"
        >
          <div 
            className="w-full h-[400px] lg:h-[450px] bg-cover bg-center"
            style={{ backgroundImage: `url(${familyHug})` }}
          />
        </motion.div>
      </div>
    </section>
  );
};
