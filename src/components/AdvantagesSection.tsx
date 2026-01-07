import { motion } from 'framer-motion';
import { Shield, Percent, Compass, PawPrint, Building2 } from 'lucide-react';

const advantages = [
  {
    icon: Shield,
    title: "Quỹ bảo trì 100 triệu RM",
    description: "Các công viên tưởng niệm của Nirvana được hỗ trợ bởi quỹ bảo trì trên 100 triệu RM do một bên ủy thác độc lập quản lý để bảo dưỡng đường sá, cảnh quan vườn và cơ sở hạ tầng.",
  },
  {
    icon: Percent,
    title: "Lãi suất 0%",
    description: "Yên tâm với gói trả góp lãi suất 0% lên đến 36 tháng với số tiền đặt cọc thấp.",
    customIcon: true,
  },
  {
    icon: Compass,
    title: "Phong Thủy Tuyệt Vời",
    description: "Các công viên tưởng niệm của chúng tôi được các thầy Phong Thủy nổi tiếng chứng nhận có Phong Thủy tuyệt vời.",
  },
  {
    icon: PawPrint,
    title: "Tiện ích toàn diện",
    description: "Nhiều công viên tưởng niệm và trung tâm tích hợp của chúng tôi có tiện ích toàn diện với đội ngũ hỗ trợ chuyên nghiệp.",
  },
  {
    icon: Building2,
    title: "Kiến trúc tráng lệ",
    description: "Mỗi công viên tưởng niệm được thiết kế với kiến trúc thanh lịch và tráng lệ để đảm bảo sự bình yên và thoải mái.",
  },
];

export const AdvantagesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Title & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl md:text-5xl text-[#2f3237] leading-tight mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              5 lợi ích chính<br />
              khi lên kế hoạch<br />
              trước với<br />
              Nirvana
            </h2>
            <p 
              className="text-[#5e636e] text-sm mb-8"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Nhu cầu của bạn là ưu tiên hàng đầu của chúng tôi
            </p>
            <button 
              className="px-8 py-3 text-white text-sm tracking-wide"
              style={{
                backgroundColor: '#0693e3',
                fontFamily: "'Open Sans', sans-serif"
              }}
            >
              ĐẶT LỊCH HẸN
            </button>
          </motion.div>

          {/* Right - Advantages Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {advantages.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full border border-[#0693e3] flex items-center justify-center mb-4">
                  {item.customIcon ? (
                    <span 
                      className="text-[#0693e3] text-lg font-semibold"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      0%
                    </span>
                  ) : (
                    <item.icon className="w-6 h-6 text-[#0693e3]" strokeWidth={1.5} />
                  )}
                </div>
                
                <h3 
                  className="text-[#2f3237] text-sm font-semibold mb-2"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-[#5e636e] text-xs leading-relaxed"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
