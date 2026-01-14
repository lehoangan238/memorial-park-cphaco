import { motion } from 'framer-motion';
import columbarium from '@/assets/columbarium.jpg';

const products = [
  "Dịch Vụ Tang Lễ",
  "Dịch Vụ Hoả Táng",
  "Dịch vụ Lưu Trũ Tro Cốt",
  "Chăm sóc mộ phần"
];

export const ProductsSection = () => {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Product List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl text-slate-800 mb-10 font-serif font-medium">
              Dịch Vụ Của Chúng Tôi
            </h2>
            
            <ul className="space-y-4 mb-12">
              {products.map((product, index) => (
                <motion.li
                  key={product}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0891B2]" />
                  <span className="text-slate-600 text-base font-body">
                    {product}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-4">
              <button className="self-start bg-[#3B82F6] text-white px-10 py-3 text-sm tracking-wide hover:bg-[#2563EB] transition-all rounded cursor-pointer">
                XEM THÊM
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
            <div className="overflow-hidden rounded-sm shadow-lg">
              <img
                src={columbarium}
                alt="Columbarium Interior"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
