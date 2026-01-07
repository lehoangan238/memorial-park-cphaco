import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

export const QuoteSection = () => {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2">
          {/* Left: Blue Quote Box */}
          <div 
            className="py-16 px-8 lg:px-12 flex items-center"
            style={{ backgroundColor: '#4453c4' }}
          >
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white text-lg leading-[1.8]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            >
              "Chúng ta kết hợp nhiều thứ để làm phong phú cuộc sống bằng cách đón nhận những mục tiêu mới và sống theo cách lành mạnh. Chúng ta cũng có thể lên kế hoạch trước cho một hành trình cuối cùng không lo lắng bằng cách chịu trách nhiệm hoàn toàn cho cuộc sống và hạnh phúc của chính mình – vì chúng ta xứng đáng được an tâm – bây giờ và mãi mãi."
            </motion.blockquote>
          </div>
          
          {/* Right: Image */}
          <div className="h-[350px] lg:h-auto">
            <img 
              src={familyHug} 
              alt="Family hug" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
