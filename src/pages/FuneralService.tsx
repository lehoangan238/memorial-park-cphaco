import { motion } from "framer-motion";
import { Play, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Import images
import heroTreesImage from "@/assets/hero-trees.jpg";
import familyHugImage from "@/assets/family-hug.jpg";
import family1Image from "@/assets/family-1.jpg";
import family2Image from "@/assets/family-2.jpg";
import family3Image from "@/assets/family-3.jpg";
import landscapeImage from "@/assets/landscape.jpg";
import columbariumImage from "@/assets/columbarium.jpg";
import heroParkImage from "@/assets/hero-park.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const howItWorksSteps = [
  {
    number: "01",
    title: "Tư Vấn Ban Đầu",
    description: "Đội ngũ chuyên gia của chúng tôi sẽ lắng nghe và tư vấn phương án phù hợp nhất cho gia đình."
  },
  {
    number: "02", 
    title: "Lập Kế Hoạch Chi Tiết",
    description: "Thiết kế chi tiết lễ tang theo nguyện vọng và truyền thống văn hóa của gia đình."
  },
  {
    number: "03",
    title: "Chuẩn Bị Chu Đáo",
    description: "Mọi công tác chuẩn bị được thực hiện chuyên nghiệp và tận tâm."
  },
  {
    number: "04",
    title: "Thực Hiện Lễ Tang",
    description: "Tổ chức lễ tang trang trọng, ấm cúng theo đúng kế hoạch đã thống nhất."
  }
];

const reasons = [
  {
    title: "Dịch Vụ Trọn Gói",
    description: "Chúng tôi cung cấp dịch vụ tang lễ trọn gói, từ khâu chuẩn bị đến hoàn tất lễ tang."
  },
  {
    title: "Đội Ngũ Chuyên Nghiệp",
    description: "Nhân viên được đào tạo bài bản, tận tâm và chuyên nghiệp trong mọi khâu."
  },
  {
    title: "Cơ Sở Vật Chất Hiện Đại",
    description: "Hệ thống nhà tang lễ được trang bị đầy đủ tiện nghi, không gian trang nghiêm."
  },
  {
    title: "Tôn Trọng Văn Hóa",
    description: "Hiểu và tôn trọng phong tục tập quán của mọi tôn giáo và vùng miền."
  },
  {
    title: "Hỗ Trợ 24/7",
    description: "Đường dây nóng hoạt động 24/7 để hỗ trợ gia đình trong mọi tình huống."
  },
  {
    title: "Chi Phí Minh Bạch",
    description: "Báo giá rõ ràng, không phát sinh chi phí ngoài dự kiến."
  }
];

const parlourImages = [
  { src: columbariumImage, alt: "Nhà tang lễ 1" },
  { src: landscapeImage, alt: "Nhà tang lễ 2" },
  { src: heroParkImage, alt: "Nhà tang lễ 3" }
];

const FuneralService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${heroTreesImage})` 
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            {...fadeInUp}
            className="font-display text-4xl md:text-6xl lg:text-7xl mb-4 italic"
          >
            Funeral Service
          </motion.h1>
          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Dịch vụ tang lễ trọn gói với sự tận tâm và chuyên nghiệp
          </motion.p>
        </div>
      </section>

      {/* Nirvana Life Plan Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">NIRVANA LIFE PLAN</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 text-foreground italic">
              Kế Hoạch Cuộc Sống Nirvana
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <p className="text-muted-foreground text-center leading-relaxed mb-10">
              Nirvana Life Plan là giải pháp toàn diện giúp bạn và gia đình yên tâm về tương lai. 
              Với kế hoạch được thiết kế linh hoạt, bạn có thể chuẩn bị từ sớm để giảm bớt gánh nặng 
              tài chính và tinh thần cho người thân trong những thời điểm khó khăn nhất.
            </p>

            {/* Video Placeholder */}
            <div className="relative aspect-video bg-muted overflow-hidden group cursor-pointer">
              <img 
                src={columbariumImage} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-primary ml-1" fill="currentColor" />
                </div>
              </div>
              <span className="absolute bottom-4 left-4 text-white text-xs tracking-[0.2em] uppercase">
                WATCH
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#f5f6f8]">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground italic">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Quy trình dịch vụ tang lễ được thiết kế đơn giản, minh bạch và chuyên nghiệp
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.number}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-display text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="font-display text-lg md:text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Process Images */}
          <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
            <img src={family1Image} alt="Process 1" className="w-full h-40 object-cover" />
            <img src={family2Image} alt="Process 2" className="w-full h-40 object-cover" />
            <img src={family3Image} alt="Process 3" className="w-full h-40 object-cover" />
            <img src={familyHugImage} alt="Process 4" className="w-full h-40 object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Grand Memorial Parlour Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={columbariumImage} 
                  alt="Grand Memorial Parlour" 
                  className="col-span-2 w-full h-64 object-cover"
                />
                <img 
                  src={landscapeImage} 
                  alt="Interior 1" 
                  className="w-full h-40 object-cover"
                />
                <img 
                  src={heroParkImage} 
                  alt="Interior 2" 
                  className="w-full h-40 object-cover"
                />
              </div>

              {/* Text Content */}
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground italic mb-6">
                  Grand Memorial Parlour
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nhà tang lễ Grand Memorial Parlour được thiết kế với không gian trang nghiêm, 
                  ấm cúng và đầy đủ tiện nghi. Chúng tôi mang đến môi trường phù hợp để gia đình 
                  và bạn bè tiễn đưa người thân trong sự bình an và tôn kính.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Với sức chứa linh hoạt từ 50 đến 500 người, nhà tang lễ có thể đáp ứng 
                  mọi quy mô lễ tang theo nguyện vọng của gia đình.
                </p>
                <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-white px-8 text-xs tracking-[0.15em]">
                  TÌM HIỂU THÊM
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Luxurious Casket & Urn Section */}
      <section className="py-20 bg-[#f5f6f8]">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground italic mb-6">
                  Luxurious Casket & Urn
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Bộ sưu tập quan tài và bình tro cao cấp được chế tác từ những chất liệu 
                  tốt nhất với thiết kế tinh xảo, thể hiện sự trang trọng và tôn kính 
                  dành cho người đã khuất.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Từ phong cách truyền thống đến hiện đại, chúng tôi cung cấp đa dạng 
                  lựa chọn phù hợp với mọi nghi thức văn hóa và tôn giáo.
                </p>

                {/* Product Icons */}
                <div className="flex gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                      <span className="text-2xl">⚱️</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Bình Tro</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                      <span className="text-2xl">🪦</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Quan Tài</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                      <span className="text-2xl">💐</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Hoa Tang</span>
                  </div>
                </div>
              </div>

              {/* Large Casket Image */}
              <div>
                <img 
                  src={landscapeImage} 
                  alt="Luxurious Casket" 
                  className="w-full h-80 object-cover shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Section - The Guardian */}
      <section className="relative py-0">
        <div className="relative h-[60vh] min-h-[400px]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroParkImage})` 
            }}
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <span className="text-xs tracking-[0.3em] uppercase mb-4 text-white/70">WATCH</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl italic mb-8 text-center">
              THE GUARDIAN
            </h2>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      {/* 6 Reasons Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-foreground italic mb-12">
              6 Reasons
            </h2>
            <p className="text-muted-foreground mb-12 max-w-2xl">
              Lý do khách hàng tin tưởng lựa chọn dịch vụ tang lễ của Nirvana
            </p>

            <div className="grid lg:grid-cols-2 gap-x-16 gap-y-8">
              <div className="space-y-6">
                {reasons.slice(0, 3).map((reason, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{reason.title}</h3>
                      <p className="text-sm text-muted-foreground">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                {reasons.slice(3).map((reason, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{reason.title}</h3>
                      <p className="text-sm text-muted-foreground">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              <img src={family1Image} alt="Reason 1" className="w-full h-48 object-cover" />
              <img src={family2Image} alt="Reason 2" className="w-full h-48 object-cover" />
              <img src={family3Image} alt="Reason 3" className="w-full h-48 object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <span className="text-white/70 text-xs tracking-[0.3em] uppercase block mb-4">
              NEW & LIMITED PERIOD PLAN
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-white italic mb-8">
              Ưu đãi đặc biệt cho gói dịch vụ tang lễ trọn gói
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 text-xs tracking-[0.15em]">
                FUNERAL SERVICE PLAN
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 text-xs tracking-[0.15em]">
                NIRVANA CARE PLAN
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Guide Card */}
              <div className="bg-primary-foreground/10 backdrop-blur-sm p-8 md:p-10">
                <h2 className="font-display text-2xl md:text-3xl text-white italic mb-6">
                  Guide to choosing a bereavement care provider
                </h2>
                <p className="text-white/80 leading-relaxed mb-8">
                  Hướng dẫn chi tiết giúp bạn lựa chọn nhà cung cấp dịch vụ chăm sóc tang lễ 
                  phù hợp với nhu cầu và ngân sách của gia đình.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-white/80">
                    <ChevronRight className="w-4 h-4 text-white" />
                    <span>Các tiêu chí đánh giá chất lượng dịch vụ</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <ChevronRight className="w-4 h-4 text-white" />
                    <span>So sánh các gói dịch vụ phổ biến</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <ChevronRight className="w-4 h-4 text-white" />
                    <span>Câu hỏi cần đặt ra khi tư vấn</span>
                  </li>
                </ul>
                <Button className="bg-white text-primary hover:bg-white/90 px-8 text-xs tracking-[0.15em]">
                  TẢI HƯỚNG DẪN
                </Button>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <img src={familyHugImage} alt="Guide 1" className="w-full h-40 object-cover" />
                <img src={family1Image} alt="Guide 2" className="w-full h-40 object-cover" />
                <img src={family2Image} alt="Guide 3" className="w-full h-40 object-cover" />
                <img src={family3Image} alt="Guide 4" className="w-full h-40 object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FuneralService;
