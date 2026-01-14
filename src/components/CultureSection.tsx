import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import image1 from "@/assets/khu-gia-toc .jpg"
import image2 from "@/assets/linh-hoa-tue-dan-1.jpg"
import image3 from "@/assets/vinh-hang-dai.jpg"
const easeOut = [0.22, 1, 0.36, 1] as const;

export const CultureSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-10 sm:py-12 md:py-16 pt-14 sm:pt-16 md:pt-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left - Stacked Images Layout */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="lg:col-span-2 relative order-2 lg:order-1"
          >
            {/* Mobile: Simple grid layout | Desktop: Stacked pyramid */}
            {/* Mobile Grid */}
            <div className="grid grid-cols-2 gap-3 sm:hidden">
              <div className="col-span-2">
                <img src={image3} alt="Vĩnh Hằng Đài" className="w-full h-auto object-cover aspect-[16/10] rounded-sm shadow-md" />
              </div>
              <div>
                <img src={image2} alt="Linh Hoa Tuệ Đàn" className="w-full h-auto object-cover aspect-[4/3] rounded-sm shadow-md" />
              </div>
              <div>
                <img src={image1} alt="Khu Gia Tộc" className="w-full h-auto object-cover aspect-[4/3] rounded-sm shadow-md" />
              </div>
            </div>

            {/* Desktop: Stacked pyramid style */}
            <div className="relative w-full hidden sm:block" style={{ paddingBottom: '130%' }}>
              {/* Top image */}
              <div 
                className="absolute overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{ 
                  top: '0',
                  left: '35%',
                  transform: 'translateX(-50%)',
                  width: '75%',
                  zIndex: 0,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }}
              >
                <img src={image3} alt="Vĩnh Hằng Đài" className="w-full h-full object-cover aspect-[4/3] transition-all duration-300 group-hover:brightness-105" />
              </div>
              
              {/* Bottom left image */}
              <div 
                className="absolute overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-40"
                style={{ 
                  bottom: '0',
                  left: '-35%',
                  width: '75%',
                  zIndex: 20,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  transform: 'translateY(-50%)'
                }}
              >
                <img src={image2} alt="Linh Hoa Tuệ Đàn" className="w-full h-full object-cover aspect-[4/3] transition-all duration-300 group-hover:brightness-105" />
              </div>
              
              {/* Bottom right image */}
              <div 
                className="absolute overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-40"
                style={{ 
                  bottom: '-5%',
                  right: '-10%',
                  width: '75%',
                  zIndex: 10,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  transform: 'translateY(-50%)'
                }}
              >
                <img src={image1} alt="Khu Gia Tộc" className="w-full h-full object-cover aspect-[4/3] transition-all duration-300 group-hover:brightness-105" />
              </div>
            </div>
          </motion.div>

          {/* Right - Content (larger - 3 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
            className="lg:col-span-3 space-y-4 sm:space-y-6 pt-0 lg:pt-4 lg:pl-8 order-1 lg:order-2"
          >
            <div className="text-center lg:text-left">
              <p className="text-slate-400 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3">HOA VIÊN BÌNH DƯƠNG</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate-800 italic leading-tight font-medium">
                Văn Hóa Của Chúng Tôi<br />Tương Lai Của Chúng Ta
              </h2>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-body text-center lg:text-left">
              <strong className="font-semibold">Hoa Viên Nghĩa Trang Bình Dương</strong> là công viên nghĩa trang hiện đại và quy mô hàng đầu Việt Nam, toạ lạc tại phường Chánh Phú Hoà, thành phố Hồ Chí Minh. Với thiết kế hài hoà giữa cảnh quan thiên nhiên và kiến trúc tâm linh, nơi đây mang đến không gian an yên, trang trọng cho người đã khuất.
            </p>
            
            {/* Expandable content */}
            <motion.div
              initial={false}
              animate={{ 
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-3 sm:pt-4 font-body text-center lg:text-left">
                Được quy hoạch bài bản, pháp lý minh bạch, dịch vụ chu đáo từ hoả táng, an táng, lưu tro cốt đến xây dựng mộ phần theo phong thuỷ. Đặc biệt, Hoa Viên chuyên tư vấn thiết kế và thi công khu mộ gia tộc, đảm bảo yếu tố thẩm mỹ, phong thủy, công năng sử dụng và giá trị truyền đời, Hoa Viên là lựa chọn lý tưởng cho gia đình gửi gắm sự tri ân và yêu thương bền lâu.
              </p>
            </motion.div>

            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group pt-2 sm:pt-4 justify-center lg:justify-end min-h-[44px]"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="text-slate-500 text-[10px] sm:text-xs tracking-wider uppercase">
                {isExpanded ? 'THU GỌN' : 'XEM THÊM'}
              </span>
              <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-[#5b7cfa] flex items-center justify-center transition-transform duration-300">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-white rotate-180" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
