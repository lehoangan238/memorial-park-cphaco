import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: easeOut }
  }
};

const testimonials = [
  {
    title: "Dịch vụ khách hàng xuất sắc và đặc biệt",
    text: "Chúng tôi xin bày tỏ lòng biết ơn về dịch vụ khách hàng xuất sắc và đặc biệt mà quý vị đã cung cấp trong tang lễ của cha chúng tôi, đặc biệt là ông Chai Teen. Dịch vụ khách hàng xuất sắc và đặc biệt. Thay mặt gia đình, chúng tôi...",
    link: "xem thêm",
    isItalic: false,
  },
  {
    title: '"Tuyệt vời" về sự chuyên nghiệp',
    text: 'Gia đình cố ông Lee Kai Wa xin gửi lời khen "tuyệt vời" về sự chuyên nghiệp của anh ấy. "Tuyệt vời" về sự chuyên nghiệp của họ. Cái chết để lại nỗi đau mà không ai có thể chữa lành. Tình yêu để lại ký ức mà không ai có thể đánh cắp! Thứ Tư ngày 14 tháng 7 năm 2021...',
    link: "xem thêm",
    isItalic: true,
  },
  {
    title: "Chất lượng công việc và kế hoạch tuyệt vời",
    text: "Chúng tôi, gia đình họ Ooi trân trọng dịch vụ tốt nhất được cung cấp, chất lượng công việc, kế hoạch tuyệt vời trong tang lễ của chồng tôi. Chất lượng công việc và kế hoạch tuyệt vời. Đây là lời cảm ơn đặc biệt dành cho ông ShanZhi, Dịch vụ...",
    link: "xem thêm",
    isItalic: true,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="text-center mb-12"
        >
          <h2 
            className="text-4xl text-[#2f3237] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Đánh Giá Của Khách Hàng
          </h2>
          <p 
            className="text-[#5e636e] text-sm max-w-2xl mx-auto mb-6"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Khách hàng chia sẻ những trải nghiệm tiếp tục thúc đẩy chúng tôi trên hành trình đầy cảm hứng của sự từ bi và chuyên nghiệp.
          </p>
          
          {/* Star Rating */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
            className="flex justify-center gap-1"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotate: -180 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              >
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 mb-10"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.title}
              variants={staggerItem}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-lg p-6 shadow-md transition-shadow"
            >
              <h3 
                className={`text-[#2f3237] text-sm font-semibold mb-4 ${testimonial.isItalic ? 'italic' : ''}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {testimonial.title}
              </h3>

              <p 
                className={`text-[#5e636e] text-sm leading-relaxed mb-4 ${testimonial.isItalic ? 'italic' : ''}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {testimonial.text}
              </p>
              
              <a 
                href="#"
                className="text-[#0693e3] text-sm hover:underline"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {testimonial.link}
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
          className="text-center"
        >
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="border border-[#5e636e] text-[#5e636e] px-8 py-2.5 text-sm hover:bg-[#5e636e] hover:text-white transition-all"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Xem Thêm
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
