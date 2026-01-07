import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const CultureSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Blue Promotional Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div 
              className="relative overflow-hidden py-20 px-8 text-center"
              style={{ backgroundColor: '#4169e1' }}
            >
              {/* Decorative bubbles/circles */}
              <div className="absolute top-10 left-10 w-16 h-16 rounded-full border-2 border-white/20" />
              <div className="absolute top-20 right-16 w-12 h-12 rounded-full border-2 border-white/20" />
              <div className="absolute bottom-16 left-20 w-20 h-20 rounded-full border-2 border-white/20" />
              <div className="absolute bottom-10 right-10 w-14 h-14 rounded-full border-2 border-white/20" />
              
              {/* Hands silhouette at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#3158d3] to-transparent opacity-50" />
              
              <div className="relative z-10">
                <h3 
                  className="text-2xl md:text-3xl text-white mb-4 leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Kế hoạch cuộc sống hợp lý<br />
                  chỉ với 10 nghìn/ngày?
                </h3>
                <p 
                  className="text-white/80 text-sm mb-8"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Lên kế hoạch cuộc sống không tốn kém như bạn nghĩ...
                </p>
                <button 
                  className="border border-white text-white px-8 py-3 text-sm tracking-wider hover:bg-white hover:text-[#4169e1] transition-all"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Tìm hiểu thêm
                </button>
              </div>
              
              {/* Slider dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <button 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all ${i === 2 ? 'bg-white' : 'bg-white/40'}`}
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
            className="pt-4"
          >
            <span 
              className="text-[#5e636e] text-sm tracking-[0.4em]"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              N I R V A N A
            </span>
            
            <h2 
              className="text-4xl lg:text-5xl mt-4 mb-8"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                color: '#4169e1'
              }}
            >
              Văn Hóa Của Chúng Tôi - Tương Lai Của Chúng Tôi
            </h2>
            
            <p 
              className="text-[#2f3237] leading-[1.9] text-[16px] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Một nền văn hóa đã trải qua hàng nghìn năm thử thách giống như dòng chảy của nước – từng chút một, cuối cùng nó hình thành nên một lịch sử phong phú.{' '}
              <strong>Thành lập năm 1990,</strong> Nirvana Asia Group thấu hiểu sâu sắc tình cảm này bằng cách tự hào gìn giữ truyền thống và văn hóa, cung cấp trọn bộ dịch vụ tang lễ để tôn vinh và nâng cao cuộc sống.
            </p>
            
            <a 
              href="#about" 
              className="inline-flex items-center gap-3 text-[#5e636e] text-sm tracking-[0.15em] hover:text-[#4169e1] transition-colors group"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              XEM THÊM
              <span className="w-6 h-6 rounded-full border border-[#4169e1] flex items-center justify-center text-[#4169e1] group-hover:bg-[#4169e1] group-hover:text-white transition-all">
                <Plus className="w-3 h-3" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
