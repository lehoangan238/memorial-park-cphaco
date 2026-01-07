import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

export const QuoteSection = () => {
  return (
    <section className="relative">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Blue Quote Box */}
        <div className="lg:w-1/2 relative z-10">
          <div className="relative">
            {/* Cyan left border */}
            <div 
              className="absolute left-0 top-8 bottom-8 w-1"
              style={{ backgroundColor: '#00d4ff' }}
            />
            
            <div 
              className="py-16 lg:py-24 px-8 lg:px-16 ml-4 min-h-[400px] lg:min-h-[500px] flex items-center"
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
        
        {/* Right: Image positioned to overlap */}
        <div className="lg:w-[60%] lg:absolute lg:right-0 lg:top-1/3">
          <div 
            className="w-full h-[350px] lg:h-[400px] bg-cover bg-center"
            style={{ backgroundImage: `url(${familyHug})` }}
          />
        </div>
      </div>
    </section>
  );
};
