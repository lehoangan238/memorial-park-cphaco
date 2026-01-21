import { motion } from 'framer-motion';
import family1 from '@/assets/family-1.jpg';
import family2 from '@/assets/family-2.jpg';
import family3 from '@/assets/family-3.jpg';

const easeOut = [0.22, 1, 0.36, 1] as const;

const imageCards = [
  {
    image: family1,
    title: "5 lợi ích chính của việc lên kế hoạch trước với Hoa Viên Bình Dương",
  },
  {
    image: family2,
    title: "Khi nào là thời điểm tốt nhất để lên kế hoạch trước?",
  },
  {
    image: family3,
    title: "Ai nên lên kế hoạch trước?",
  },
];

export const ThreeImageSection = () => {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {imageCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-sm shadow-md mb-4">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="text-slate-800 text-center text-sm font-serif font-medium group-hover:text-slate-600 transition-colors">
                {card.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
