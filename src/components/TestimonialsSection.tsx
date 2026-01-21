import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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

const testimonials = [
  {
    title: "Dịch vụ khách hàng xuất sắc và đặc biệt",
    text: "Chúng tôi muốn bày tỏ lòng biết ơn về dịch vụ khách hàng xuất sắc và đặc biệt mà bạn đã cung cấp trong tang lễ của cha tôi, đặc biệt là anh Chai Teen. Dịch vụ khách hàng xuất sắc và đặc biệt. Thay mặt gia đình, chúng tôi đánh giá cao tất cả những nỗ lực và sự tận tâm được thể hiện trong thời gian khó khăn này.",
  },
  {
    title: "Tính chuyên nghiệp \"xuất sắc\"",
    text: "Gia đình cố ông Lee Kai Wa muốn gửi lời khen ngợi \"xuất sắc\" về tính chuyên nghiệp của họ. Cái chết để lại nỗi đau lòng mà không ai có thể chữa lành. Tình yêu để lại ký ức mà không ai có thể đánh cắp! Chúng tôi vô cùng biết ơn về dịch vụ đầy lòng trắc ẩn và chuyên nghiệp được cung cấp.",
  },
  {
    title: "Chất lượng công việc và kế hoạch tuyệt vời",
    text: "Chúng tôi, gia đình Ooi, trân trọng dịch vụ tốt nhất được cung cấp, chất lượng công việc tuyệt vời, kế hoạch xuất sắc trong tang lễ của chồng tôi. Đây là lời cảm ơn đặc biệt dành cho anh ShanZhi về dịch vụ xuất sắc và sự chú ý đến từng chi tiết đã làm cho thời gian khó khăn này trở nên dễ chịu hơn.",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl text-slate-800 mb-6 font-serif font-medium">
            Lời Chứng Thực Của Khách Hàng
          </h2>
          
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8 mb-10"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.title}
              variants={staggerItem}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-slate-800 text-lg font-serif font-medium mb-4">
                {testimonial.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed font-body">
                {testimonial.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
          className="text-center"
        >
          <button className="bg-[#3B82F6] text-white px-10 py-3 text-sm tracking-wide hover:bg-[#2563EB] transition-all rounded cursor-pointer">
            XEM THÊM
          </button>
        </motion.div>
      </div>
    </section>
  );
};
