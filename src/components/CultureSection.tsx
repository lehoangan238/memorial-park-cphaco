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
            <div className="absolute -top-6 -left-6 z-10">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <line x1="5" y1="15" x2="35" y2="45" stroke="#c2c9d6" strokeWidth="2" />
                <line x1="5" y1="25" x2="25" y2="45" stroke="#c2c9d6" strokeWidth="2" />
                <line x1="5" y1="35" x2="15" y2="45" stroke="#c2c9d6" strokeWidth="2" />
              </svg>
            </div>
            
            <div className="relative overflow-hidden shadow-lg bg-gray-100">
              <img
                src={columbarium}
                alt="Rhyme of Life Columbarium"
                className="w-full h-[480px] object-cover"
              />
              
              {/* Overlay content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                <h3 
                  className="text-4xl text-white mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  Nhịp Điệu Cuộc Sống
                </h3>
                <p 
                  className="text-white text-sm tracking-[0.2em] mb-4 font-light"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Ra Mắt Mới
                </p>
                <p 
                  className="text-white/90 text-sm leading-relaxed mb-6 max-w-sm"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  "Nhịp Điệu Cuộc Sống" – là một nhà lưu trữ tro cốt sang trọng và thanh lịch, kết hợp văn hóa, phong cách và tiện ích 6 sao.
                </p>
                <button 
                  className="self-start border border-white text-white px-8 py-3 text-sm tracking-wider hover:bg-white hover:text-black transition-all"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Xem Thêm
                </button>
              </div>
              
              {/* Slider dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <button 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === 4 ? 'bg-white' : 'bg-white/40'}`}
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
              className="text-[#5e636e] text-sm tracking-[0.4em]"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              N I R V A N A
            </span>
            
            <h2 
              className="text-5xl lg:text-6xl mt-4 mb-8"
              style={{ 
                fontFamily: "'Great Vibes', cursive",
                color: '#0693e3'
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
              className="inline-flex items-center gap-3 text-[#5e636e] text-sm tracking-[0.15em] hover:text-[#0693e3] transition-colors group"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              XEM THÊM
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
