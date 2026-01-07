import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: "Choosing is very easy and secure",
    role: "Satisfied Customer",
    rating: 5,
    text: "The pre-planning service gave us peace of mind. The staff was incredibly professional and compassionate throughout the entire process.",
  },
  {
    name: "Planning service at a reasonable cost",
    role: "Happy Family",
    rating: 5,
    text: "The team guided us through every step with patience and understanding. Highly recommended for everyone.",
  },
  {
    name: "Dealing with them is very caring",
    role: "Loyal Customer",
    rating: 5,
    text: "They treat every family with genuine respect and care. A truly exceptional service provider in the industry.",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-display text-foreground mb-3">
            Our Customers' Testimonials
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Hear from families who have trusted Nirvana with their pre-planning needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-md border border-border relative"
            >
              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <h3 className="font-semibold text-foreground text-sm mb-1">
                {testimonial.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {testimonial.role}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button variant="link" className="text-primary text-sm">
            View More
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
