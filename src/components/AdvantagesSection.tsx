import { motion } from 'framer-motion';
import { Building2, DollarSign, Wind, Home, Landmark } from 'lucide-react';
import coupleBeach from '@/assets/couple-beach.jpg';

const easeOut = [0.22, 1, 0.36, 1] as const;

const advantages = [
  {
    icon: Building2,
    title: "Chủ động lựa chọn \"Vị trí Vàng\" hợp phong thủy",
    description:
      "Khi có thời gian thong thả để tìm hiểu, bạn có quyền ưu tiên lựa chọn những vị trí tốt nhất thay vì phải chấp nhận những vị trí còn lại trong tình huống khẩn cấp. Có thể chọn hướng, thế đất, khu vực yên tĩnh hoặc gần các công trình tâm linh phù hợp với tuổi, mệnh và mong muốn của cá nhân/gia tộc.",
  },
  {
    icon: DollarSign,
    title: "Tiết kiệm chi phí và tránh rủi ro lạm phát",
    description: "Giá bất động sản nói chung và đất nghĩa trang nói riêng có xu hướng tăng theo thời gian do quỹ đất ngày càng hạn hẹp. Mua trước giúp bạn \"khóa\" được mức giá ở thời điểm hiện tại, tránh việc giá đất tăng cao trong tương lai.",
  },
  {
    icon: Wind,
    title: "Giảm gánh nặng tâm lý và tài chính cho người thân",
    description: "Sự ra đi của người thân luôn mang lại nỗi đau buồn to lớn. Việc chuẩn bị trước là một món quà tinh thần, giúp con cháu không bị động, không nảy sinh mâu thuẫn trong lúc tang gia và có thể toàn tâm toàn ý lo cho tang lễ được trọn vẹn.",
  },
  {
    icon: Home,
    title: "Đảm bảo quy hoạch và dịch vụ chăm sóc lâu dài",
    description:
      "Hoa Viên Bình Dương nổi tiếng với mô hình công viên nghĩa trang hiện đại, xanh - sạch - đẹp và dịch vụ chăm sóc chuyên nghiệp. Được tư vấn kỹ về các gói dịch vụ chăm sóc mộ phần, đảm bảo \"ngôi nhà vĩnh hằng\" luôn ấm cúng, sạch đẹp.",
  },
  {
    icon: Landmark,
    title: "Pháp lý minh bạch, sở hữu ổn định",
    description:
      "Hoa Viên Bình Dương là dự án lớn, có pháp lý rõ ràng và tính ổn định lâu dài. Mua trước giúp bạn cầm chắc các giấy tờ chứng nhận quyền sử dụng, tránh được rủi ro mua phải đất không hợp pháp hoặc đất ở các nghĩa trang tự phát dễ bị di dời.",
  },
];

export const AdvantagesSection = () => {
  return (
    <section className="relative bg-[#F8FAFC]">
      {/* Main Content - Two Column Layout */}
      <div className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column - Heading & CTA */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="text-center lg:text-left"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-slate-800 leading-tight mb-4 md:mb-6">
                  5 lợi ích chính khi lập kế hoạch trước với Hoa Viên Bình Dương
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mb-6 md:mb-8 uppercase tracking-wider font-body font-medium">
                  Nhu cầu của bạn là mối quan tâm hàng đầu của chúng tôi
                </p>
                <button className="bg-[#3B82F6] text-white px-6 sm:px-8 py-3 min-h-[44px] text-sm tracking-wider hover:bg-[#2563EB] transition-colors duration-200 cursor-pointer uppercase font-semibold w-full sm:w-auto">
                  Đặt Lịch Hẹn
                </button>
              </motion.div>
            </div>

            {/* Right Column - 5 Advantages with proper grid layout */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
              className="lg:col-span-7"
            >
              {/* First Advantage - Full Width */}
              <motion.div 
                className="mb-8 md:mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-3 md:mb-4">
                  {(() => {
                    const Icon = advantages[0].icon;
                    return <Icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-slate-400" strokeWidth={1} />;
                  })()}
                </div>
                <h3 className="text-slate-800 text-sm sm:text-base font-semibold mb-2 md:mb-3 leading-tight font-body">
                  {advantages[0].title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-body">
                  {advantages[0].description}
                </p>
              </motion.div>

              {/* Remaining 4 Advantages - Responsive Grid: 1 col mobile, 2 cols tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-x-10 md:gap-y-10">
                {advantages.slice(1).map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1, ease: easeOut }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-3 md:mb-4">
                      <item.icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-slate-400" strokeWidth={1} />
                    </div>
                    <h3 className="text-slate-800 text-sm sm:text-base font-semibold mb-2 md:mb-3 leading-tight font-body">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-body">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Section with Blue Box Overlay */}
      <div className="relative">
        {/* Blue Quote Box - Static on mobile, overlapping on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="relative lg:absolute left-0 top-0 z-20 w-full lg:w-[40%] lg:-top-32"
        >
          <div className="bg-[#3B82F6] py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12">
            <blockquote className="text-white text-base sm:text-lg md:text-xl leading-relaxed font-serif font-normal italic">
              "Chúng ta kết hợp nhiều điều để làm phong phú cuộc sống bằng cách đón nhận những mục tiêu mới và sống theo cách lành mạnh. Chúng ta cũng có thể lập kế hoạch trước cho hành trình cuối cùng một cách không lo lắng bằng cách chịu trách nhiệm hoàn toàn cho cuộc sống và hạnh phúc của chính mình – bởi vì chúng ta xứng đáng có được sự an tâm – bây giờ và mãi mãi."
            </blockquote>
          </div>
        </motion.div>

        {/* Background Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
        >
          <div 
            className="w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-cover bg-center"
            style={{ backgroundImage: `url(${coupleBeach})` }}
          />
        </motion.div>
      </div>
    </section>
  );
};
