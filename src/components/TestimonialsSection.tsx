import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Choosing is very easy and secure",
    role: "Mr. Tan",
    rating: 5,
    text: "The pre-planning service gave us peace of mind. The staff was incredibly professional and compassionate throughout the entire process.",
    avatar: "T",
  },
  {
    name: "Planning service at a reasonable cost",
    role: "Mrs. Lee",
    rating: 5,
    text: "The team guided us through every step with patience and understanding. The pricing was transparent and fair. Highly recommended.",
    avatar: "L",
  },
  {
    name: "Dealing with them is very caring",
    role: "Mr. Wong",
    rating: 5,
    text: "They treat every family with genuine respect and care. A truly exceptional service provider in the industry.",
    avatar: "W",
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
            className="text-[#5e636e] text-sm max-w-xl mx-auto mb-6"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Hear from families who have trusted Nirvana with their pre-planning needs.
          </p>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm"
            >
              {/* Avatar and Name */}
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: '#0693e3' }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 
                    className="text-[#2f3237] text-sm font-semibold"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {testimonial.name}
                  </h3>
                  <p 
                    className="text-[#5e636e] text-xs"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p 
                className="text-[#5e636e] text-sm leading-relaxed"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <button 
            className="text-[#0693e3] text-sm hover:underline"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            View More
          </button>
        </motion.div>
      </div>
    </section>
  );
};
