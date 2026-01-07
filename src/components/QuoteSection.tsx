import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

export const QuoteSection = () => {
  return (
    <section className="relative">
      {/* Full width image */}
      <div 
        className="w-full h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${familyHug})` }}
      />
      
      {/* Overlapping Blue Quote Box - positioned to overlap image */}
      <div className="absolute top-0 left-0 w-full lg:w-[55%] h-[380px] z-10">
        <div className="relative h-full flex">
          {/* Cyan left border */}
          <div 
            className="w-1 h-full flex-shrink-0"
            style={{ backgroundColor: '#00d4ff' }}
          />
          
          {/* Blue box */}
          <div 
            className="flex-1 py-12 px-10 lg:px-16 flex items-center"
            style={{ backgroundColor: '#4a5aef' }}
          >
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white text-xl md:text-2xl leading-relaxed"
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
