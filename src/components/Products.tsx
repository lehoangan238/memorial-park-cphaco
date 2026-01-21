import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const products = [
  {
    title: 'Phần Mộ Gia Đình',
    subtitle: 'Burial Plots',
    description: 'Khuôn viên nghĩa trang được thiết kế theo phong cách công viên với cảnh quan xanh mát và điêu khắc nghệ thuật.',
    image: 'https://images.unsplash.com/photo-1515191107209-c28698631303?w=600&h=400&fit=crop',
  },
  {
    title: 'Nhà Tro Cốt',
    subtitle: 'Columbarium',
    description: 'Không gian yên tĩnh và trang nghiêm để lưu giữ tro cốt người thân với nhiều lựa chọn từ cổ điển đến hiện đại.',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop',
  },
  {
    title: 'Dịch Vụ Tang Lễ',
    subtitle: 'Funeral Service',
    description: 'Dịch vụ tang lễ toàn diện phù hợp với mọi tôn giáo: Phật giáo, Đạo giáo, Thiên Chúa giáo và nhiều hơn nữa.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
  },
  {
    title: 'Bài Vị Thờ Cúng',
    subtitle: 'Ancestral Tablet',
    description: 'Nơi thờ cúng trang trọng để tưởng nhớ và duy trì mối liên kết tinh thần với người đã khuất.',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&h=400&fit=crop',
  },
];

export const Products = () => {
  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium uppercase tracking-wider">Sản phẩm & Dịch vụ</span>
          <h2 className="text-3xl md:text-4xl font-display text-foreground mt-3 mb-4">
            Các Sản Phẩm Của Chúng Tôi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Đa dạng lựa chọn phù hợp với nhu cầu và ngân sách của mỗi gia đình.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl elegant-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-gold text-sm font-medium">{product.subtitle}</span>
                <h3 className="text-2xl font-display text-primary-foreground mt-1 mb-3">
                  {product.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <Button variant="ghost" className="text-gold hover:text-gold-light hover:bg-gold/10 p-0 h-auto gap-2 group/btn">
                  Tìm hiểu thêm 
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
