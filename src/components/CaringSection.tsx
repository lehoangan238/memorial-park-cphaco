import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

const easeOut = [0.22, 1, 0.36, 1] as const;

// Optimized stagger - faster timing for mobile
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: easeOut }
  }
};

const infoCards = [
  {
    title: "5 lợi ích chính của việc lên kế hoạch trước",
    image: familyHug,
  },
  {
    title: "Khi nào là thời điểm tốt nhất để lên kế hoạch trước?",
    image: familyHug,
  },
  {
    title: "Ai nên lên kế hoạch trước?",
    image: familyHug,
  },
];

export const CaringSection = () => {
  return (
    <section className="relative">
      {/* Background with family image */}
      <div 
        className="relative bg-cover bg-center py-32 md:py-40"
        style={{ backgroundImage: `url(${familyHug})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-serif font-medium tracking-wide"
          >
            Trân Quý Cuộc Sống
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.5, ease: easeOut }}
            className="text-white/90 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-body"
          >
            Với cơ sở vật chất và sản phẩm toàn diện, Hoa Viên Bình Dương cam kết mang đến sự an ủi 
            và bình yên thông qua các dịch vụ tưởng niệm đạt chuẩn quốc tế trong những khoảnh khắc 
            quan trọng nhất của cuộc đời. "Trân Quý Cuộc Sống" là triết lý của chúng tôi và chúng tôi 
            tin rằng mỗi cuộc sống đều có ý nghĩa và giá trị riêng.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
