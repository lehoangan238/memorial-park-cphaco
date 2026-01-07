import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Tan",
    role: "Customer since 2020",
    rating: 5,
    text: "The pre-planning service gave us peace of mind. The staff was incredibly professional and compassionate throughout the process.",
  },
  {
    name: "David Wong",
    role: "Customer since 2019",
    rating: 5,
    text: "Planning services at a reasonable cost. The team guided us through every step with patience and understanding.",
  },
  {
    name: "Michelle Lee",
    role: "Customer since 2021",
    rating: 5,
    text: "Dealing with and caring is something that I really like about Nirvana. They treat every family with genuine respect.",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
            Our Customers' Testimonials
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from families who have trusted Nirvana with their pre-planning needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 card-shadow border border-border relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <h3 className="font-display text-lg text-foreground mb-1">
                {testimonial.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {testimonial.role}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
