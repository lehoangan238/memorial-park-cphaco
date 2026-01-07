import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    title: "Outstanding and exceptional customer service",
    text: "We would like to express our gratitude on the outstanding and exceptional customer service that you provided on our late father's funeral especially Mr. Chai Teen. Outstanding and exceptional customer service On behalf of my family, we would...",
    link: "read more",
    isItalic: false,
  },
  {
    title: "\"Thumbs up\" for their professionalism",
    text: "The family of the late Mr Lee Kai Wa would like to give him the \"thumbs up\" for his professionalism. \"Thumbs up\" for their professionalism. Death leaves a heartache no one can heal. Love leaves a memory no one can steal! Wednesday 14 July, 2021...",
    link: "read more",
    isItalic: true,
  },
  {
    title: "Quality of work and excellent planning",
    text: "We, Ooi family are appreciated for his best service provided, quality of work, excellent planning during my late husband's funeral. Quality of work and excellent planning This is to express our special appreciation to Mr ShanZhi, Service...",
    link: "read more",
    isItalic: true,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-4xl text-[#2f3237] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Customers' Testimonials
          </h2>
          <p 
            className="text-[#5e636e] text-sm max-w-2xl mx-auto mb-6"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Our customers share their experiences that continue to motivate us on this inspirational journey of compassion and professionalism.
          </p>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md"
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
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button 
            className="border border-[#5e636e] text-[#5e636e] px-8 py-2.5 text-sm hover:bg-[#5e636e] hover:text-white transition-all"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Read More
          </button>
        </motion.div>
      </div>
    </section>
  );
};
