import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, MapPin, Users, TreePine, Building, Flower2, Mountain, Shield, Heart, Clock, Landmark } from "lucide-react";
import familyImage from "@/assets/family-generations.jpg";
import landscapeImage from "@/assets/landscape.jpg";
import columbariumImage from "@/assets/columbarium.jpg";
import heroParkImage from "@/assets/hero-park.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const plotTypes = [
  {
    id: 1,
    category: "KHU MỘ GIA ĐÌNH",
    title: "Lô Đất An Táng Gia Đình",
    description: "Không gian riêng tư và trang trọng dành cho cả gia đình, nơi nhiều thế hệ có thể an nghỉ cùng nhau. Lô đất gia đình được thiết kế với diện tích rộng rãi, có thể chứa từ 4-12 vị trí an táng.",
    features: [
      "Diện tích từ 20m² - 100m²",
      "Có thể chứa 4-12 vị trí",
      "Thiết kế theo yêu cầu gia đình",
      "Khu vực riêng biệt, yên tĩnh"
    ],
    image: familyImage,
    reverse: false
  },
  {
    id: 2,
    category: "KHU TƯỞNG NIỆM TÔN GIÁO",
    title: "Khu Tưởng Niệm Công Giáo",
    description: "Được thiết kế đặc biệt cho cộng đồng Công giáo, khu vực này mang đậm nét tâm linh với các biểu tượng tôn giáo và không gian cầu nguyện. Môi trường thanh tịnh giúp gia đình tưởng nhớ người thân.",
    features: [
      "Thiết kế theo phong cách Công giáo",
      "Khu vực cầu nguyện riêng",
      "Tượng và biểu tượng tôn giáo",
      "Lễ tang theo nghi thức tôn giáo"
    ],
    image: heroParkImage,
    reverse: true
  },
  {
    id: 3,
    category: "LÔ ĐẤT ĐƠN VÀ ĐÔI",
    title: "Lô Đất Đơn & Đôi",
    description: "Lựa chọn linh hoạt cho cá nhân hoặc cặp đôi muốn an nghỉ bên nhau. Các lô đất được quy hoạch trong môi trường xanh mát, thoáng đãng với cảnh quan thiên nhiên tuyệt đẹp.",
    features: [
      "Lô đơn: 4m² - 6m²",
      "Lô đôi: 8m² - 12m²",
      "Vị trí đẹp, view thoáng",
      "Giá cả hợp lý"
    ],
    image: landscapeImage,
    reverse: false
  }
];

const considerations = [
  { icon: MapPin, title: "Vị trí và khả năng tiếp cận", description: "Khoảng cách từ nhà và giao thông thuận tiện" },
  { icon: Building, title: "Cơ sở vật chất và tiện nghi", description: "Nhà tang lễ, nhà nguyện, khu vực đỗ xe" },
  { icon: TreePine, title: "Môi trường và cảnh quan", description: "Cây xanh, hồ nước, không gian yên tĩnh" },
  { icon: Shield, title: "An ninh và bảo trì", description: "Bảo vệ 24/7, chăm sóc mộ phần định kỳ" },
  { icon: Users, title: "Chính sách thăm viếng", description: "Giờ mở cửa linh hoạt cho gia đình" },
  { icon: Heart, title: "Dịch vụ hỗ trợ tang lễ", description: "Hỗ trợ toàn diện trong thời gian tang lễ" },
  { icon: Clock, title: "Kế hoạch thanh toán", description: "Trả góp linh hoạt, không lãi suất" },
  { icon: Landmark, title: "Uy tín và lịch sử", description: "Kinh nghiệm hơn 30 năm phục vụ" }
];

const BurialPlots = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${columbariumImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl mb-4"
          >
            Lô Đất An Táng
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            Nơi an nghỉ cuối cùng trong không gian thanh bình và trang trọng
          </motion.p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center max-w-4xl mx-auto">
            <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">Nơi An Nghỉ</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 mb-6 text-foreground">
              Không gian an nghỉ trang trọng với cảnh quan tuyệt đẹp
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Tại Nirvana, chúng tôi hiểu rằng việc lựa chọn nơi an nghỉ cuối cùng là một quyết định quan trọng. 
              Các khu vực an táng của chúng tôi được thiết kế với sự tôn trọng và chăm sóc tỉ mỉ, 
              mang đến không gian thanh bình cho người đã khuất và sự an ủi cho gia đình.
            </p>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            className="grid md:grid-cols-2 gap-8 mt-16 items-center"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={familyImage} 
                alt="Gia đình tưởng niệm" 
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="bg-primary text-white p-8 md:p-12 rounded-2xl">
              <h3 className="text-2xl font-display mb-6">Cam Kết Của Chúng Tôi</h3>
              <ul className="space-y-4">
                {[
                  "Chăm sóc mộ phần suốt đời",
                  "Bảo trì cảnh quan định kỳ",
                  "An ninh 24/7",
                  "Hỗ trợ gia đình tận tâm"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white/80 flex-shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-8 border-white text-white hover:bg-white hover:text-primary">
                Tìm Hiểu Thêm
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plot Types Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">Loại Hình</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 text-foreground">
              Các Loại Lô Đất An Táng
            </h2>
          </motion.div>

          <div className="space-y-20">
            {plotTypes.map((plot, index) => (
              <motion.div
                key={plot.id}
                {...fadeInUp}
                className={`grid md:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  plot.reverse ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={plot.reverse ? 'md:order-2' : ''}>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src={plot.image} 
                      alt={plot.title}
                      className="w-full h-[350px] lg:h-[450px] object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className={plot.reverse ? 'md:order-1' : ''}>
                  <span className="text-primary text-xs tracking-[0.2em] uppercase font-medium">
                    {plot.category}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl mt-3 mb-4 text-foreground">
                    {plot.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {plot.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plot.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="default" size="lg">
                    Xem Chi Tiết
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <Flower2 className="w-12 h-12 mx-auto mb-6 text-white/60" />
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl italic max-w-4xl mx-auto leading-relaxed">
              "Một nơi an nghỉ đẹp đẽ là món quà cuối cùng dành cho người thân yêu"
            </blockquote>
            <p className="mt-6 text-white/70">— Triết lý Nirvana</p>
          </motion.div>
        </div>
      </section>

      {/* 8 Considerations Section */}
      <section className="py-20 bg-[#e8eaf6]">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
              8 Điều Cần Cân Nhắc Khi
              <br />
              <span className="text-primary">Chọn Nơi An Táng</span>
            </h2>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {considerations.map((item, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Differences Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            {...fadeInUp}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={heroParkImage} 
                alt="Công viên tưởng niệm" 
                className="w-full h-[450px] object-cover"
              />
            </div>
            <div>
              <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">
                Sự Khác Biệt
              </span>
              <h3 className="font-display text-3xl md:text-4xl mt-4 mb-6 text-foreground">
                Điểm Khác Biệt Giữa Nghĩa Trang Công Viên Và Nghĩa Trang Truyền Thống
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nghĩa trang công viên như Nirvana mang đến một cách tiếp cận hiện đại trong việc tưởng niệm người đã khuất. 
                Thay vì không gian u ám và buồn bã, chúng tôi tạo nên một công viên xanh tươi, 
                nơi gia đình có thể đến thăm viếng và tìm thấy sự bình yên.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Cảnh quan được chăm sóc chuyên nghiệp",
                  "Không gian mở và thoáng đãng",
                  "Tiện nghi hiện đại cho khách thăm viếng",
                  "Quy hoạch bài bản và khoa học"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="default" size="lg">
                Đặt Lịch Tham Quan
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
              Sẵn Sàng Tìm Hiểu Thêm?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Liên hệ với chúng tôi để được tư vấn miễn phí và tham quan các khu vực an táng
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Đặt Lịch Tư Vấn
              </Button>
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                Gọi 1800-88-1818
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BurialPlots;
