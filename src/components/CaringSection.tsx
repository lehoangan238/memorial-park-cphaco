import { motion } from 'framer-motion';
import familyHug from '@/assets/family-hug.jpg';

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
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: `url(${familyHug})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-white mb-8"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Chăm Sóc Cuộc Sống
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-sm md:text-base max-w-4xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Với cơ sở vật chất tích hợp và sản phẩm toàn diện, Nirvana cam kết mang đến trải nghiệm an ủi với dịch vụ tang lễ được quốc tế công nhận trong thời điểm cần thiết nhất. "Chăm Sóc Cuộc Sống" là triết lý của chúng tôi và chúng tôi coi mỗi cuộc sống đều có ý nghĩa và quý giá. Hãy yên tâm rằng đội ngũ của chúng tôi sẽ nỗ lực đảm bảo người thân của bạn được tôn vinh và kỷ niệm với sự chuyên nghiệp và tận tâm cao nhất.
          </motion.p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {infoCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h3 
                  className="text-[#2f3237] text-sm"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {card.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
