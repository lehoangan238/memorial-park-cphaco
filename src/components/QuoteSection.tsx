import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

export const QuoteSection = () => {
  return (
    <section className="relative">
      {/* Full width image at bottom */}
      <div className="pt-32 lg:pt-48">
        <div 
          className="w-full h-[400px] bg-cover bg-center"
          style={{ backgroundImage: `url(${familyHug})` }}
        />
      </div>
      
      {/* Overlapping Blue Quote Box */}
      <div className="absolute top-0 left-0 w-full lg:w-1/2 z-10">
        <div className="relative">
          {/* Cyan left border */}
          <div 
            className="absolute left-0 top-8 bottom-8 w-1"
            style={{ backgroundColor: '#00d4ff' }}
          />
          
          <div 
            className="py-16 px-8 lg:px-16 ml-4"
            style={{ backgroundColor: '#4a5aef' }}
          >
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white text-lg md:text-xl leading-relaxed max-w-lg"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            >
              "Chúng ta kết hợp nhiều thứ để làm phong phú cuộc sống bằng cách đón nhận những mục tiêu mới và sống theo cách lành mạnh. Chúng ta cũng có thể lên kế hoạch trước cho một hành trình cuối cùng không lo lắng bằng cách chịu trách nhiệm hoàn toàn cho cuộc sống và hạnh phúc của chính mình – vì chúng ta xứng đáng được an tâm – bây giờ và mãi mãi."
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
