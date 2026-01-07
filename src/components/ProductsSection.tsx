import { motion } from 'framer-motion';
import columbarium from '@/assets/columbarium.jpg';

const products = [
  "Lô Đất An Táng",
  "Nhà Lưu Trữ Tro Cốt",
  "Dịch Vụ Tang Lễ",
  "Bài Vị Tổ Tiên",
  "Đèn Phước Lành Vĩnh Cửu",
  "Vườn Tưởng Niệm Thú Cưng",
  "NV Seed",
];

export const ProductsSection = () => {
  return (
    <section id="products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Product List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="text-3xl text-[#2f3237] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Sản Phẩm Của Chúng Tôi
            </h2>
            
            <ul className="space-y-3 mb-10">
              {products.map((product, index) => (
                <motion.li
                  key={product}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0693e3]" />
                  <span 
                    className="text-[#5e636e] text-[15px]"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {product}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <button 
                className="self-start border border-[#5e636e] text-[#5e636e] px-8 py-2.5 text-xs tracking-[0.15em] hover:bg-[#5e636e] hover:text-white transition-all"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                XEM THÊM
              </button>
              <button 
                className="self-start px-8 py-2.5 text-white text-xs tracking-[0.1em]"
                style={{
                  backgroundColor: '#0693e3',
                  fontFamily: "'Open Sans', sans-serif"
                }}
              >
                THAM QUAN 360°
              </button>
            </div>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="overflow-hidden">
              <img
                src={columbarium}
                alt="Columbarium Interior"
                className="w-full h-[450px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
