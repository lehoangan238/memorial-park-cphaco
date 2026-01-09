import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, ChevronRight, Plus, ChevronLeft } from "lucide-react";
import familyImage from "@/assets/family-generations.jpg";
import landscapeImage from "@/assets/landscape.jpg";
import columbariumImage from "@/assets/columbarium.jpg";
import heroParkImage from "@/assets/hero-park.jpg";
import heroTreesImage from "@/assets/hero-trees.jpg";
import coupleBeachImage from "@/assets/couple-beach.jpg";
import family1Image from "@/assets/family-1.jpg";
import family2Image from "@/assets/family-2.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

// Plot types data for the staggered card layout
const plotTypesLeft = [
  {
    id: 1,
    category: "NƠI GỌI LÀ NHÀ",
    title: "Lô Đất Gia Đình Hoàng Gia",
    description: "Lá rụng sẽ luôn rơi gần gốc cây. Trong tư tưởng truyền thống Việt Nam, dù ở đâu, nhà luôn là nơi ấm áp nhất. Sâu trong tâm hồn, trái tim của người lữ khách sẽ luôn khao khát về nhà. Dù đi xa đến đâu, chúng ta sẽ luôn mong chờ ngày sum họp với người thân yêu.",
    images: [heroParkImage, landscapeImage, columbariumImage],
    buttonText: "XEM THÊM"
  },
  {
    id: 2,
    category: "CON NGƯỜI VÀ THIÊN NHIÊN HÒA QUYỆN",
    title: "Lô Đất Đơn và Đôi",
    description: "Công viên tưởng niệm Nirvana được thiết kế hài hòa với cảnh quan thiên nhiên. Thanh bình và thơ mộng, nơi đây xoa dịu tâm hồn và làm dịu trái tim. Với những ai tìm được nơi an nghỉ ở đây, đó đơn giản là một chốn bình yên.",
    images: [landscapeImage, heroParkImage],
    buttonText: "XEM THÊM"
  }
];

const plotTypesRight = [
  {
    id: 3,
    category: "VINH QUANG VỚI NGHỆ THUẬT TINH XẢO",
    title: "Lô Đất Gia Đình",
    description: "Mỗi thiết kế cá nhân hóa kể một câu chuyện xứng đáng được tưởng niệm. Có thể ví như một bài thơ đẹp với sự huy hoàng bền vững. Tại đây, bạn được chào đón bởi những kỷ niệm quý giá gợi nhớ sở thích, tính cách và đặc điểm của người thân yêu.",
    images: [columbariumImage, heroParkImage],
    buttonText: "NHẬN BÁO GIÁ"
  },
  {
    id: 4,
    category: "NƠI AN NGHỈ VĨNH HẰNG THIÊN ĐƯỜNG",
    title: "Khu Tưởng Niệm Công Giáo",
    description: "Lấy cảm hứng từ \"Vương quốc Thiên đường\", Khu Tưởng Niệm Công Giáo là nơi an nghỉ vĩnh hằng trang nghiêm và tao nhã dành cho người Công giáo. Thiết kế trật tự và thanh bình bao gồm các lô đất đa dạng và nhà lưu trữ tro cốt.",
    images: [heroTreesImage, landscapeImage],
    buttonText: "NHẬN BÁO GIÁ"
  }
];

const considerations = [
  "Giá cả và khả năng phát sinh phí",
  "Vị trí chính xác của lô đất",
  "Bảo trì, tiện ích và tiện nghi",
  "Cân nhắc cá nhân và gia đình lâu dài",
  "Mối quan hệ với đơn vị chăm sóc tang lễ",
  "Các tùy chọn lô đất an táng",
  "Lắp đặt bia mộ hoặc tượng đài",
  "Kế hoạch phát triển tương lai"
];

// Image carousel component
const ImageCarousel = ({ images, className = "" }: { images: string[], className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative group ${className}`}>
      <img 
        src={images[currentIndex]} 
        alt="Gallery" 
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-primary' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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

      {/* Intro Section with Gray Background */}
      <section className="py-16 bg-[#f5f5f5]">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center max-w-4xl mx-auto mb-12">
            <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">NƠI AN NGHỈ</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 mb-6 text-foreground">
              Không gian an nghỉ vượt trội với sự khác biệt độc đáo
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tại Nirvana, chúng tôi hiểu rằng việc lựa chọn nơi an nghỉ cuối cùng là một quyết định quan trọng. 
              Các khu vực an táng của chúng tôi được thiết kế với sự tôn trọng và chăm sóc tỉ mỉ.
            </p>
            <button className="text-primary text-sm mt-4 flex items-center gap-1 mx-auto hover:gap-2 transition-all">
              Xem thêm <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Video & Commitment Section */}
      <section className="py-16 bg-[#e8eaed]">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="flex flex-col lg:flex-row gap-0 items-stretch">
            {/* Video Thumbnail - Left side, larger */}
            <div className="lg:w-[65%] relative overflow-hidden shadow-xl">
              <div className="aspect-[16/10]">
                <img 
                  src={coupleBeachImage} 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-transparent hover:bg-white/10 transition-colors">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </button>
              </div>
            </div>

            {/* Commitment Card - Right side */}
            <div className="lg:w-[35%] flex flex-col items-end lg:pl-8">
              <span className="text-[#4a5aef] text-sm tracking-[0.3em] uppercase font-medium mb-4">W A T C H</span>
              <div className="bg-[#4a5aef] text-white p-8 lg:p-10 flex-1 flex flex-col justify-center text-center w-full max-w-sm">
                <h3 className="font-display text-3xl lg:text-4xl italic mb-6">
                  The<br />Commitment
                </h3>
                <p className="text-white/90 leading-relaxed mb-4 text-sm lg:text-base">
                  A commitment that transcends boundaries is bound by true love.
                </p>
                <p className="text-white/80 leading-relaxed text-sm lg:text-base">
                  At Nirvana, rest assured the fulfillment of that commitment is our promise.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Burial Plot Types Section - White Background */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">KHÁM PHÁ</span>
            <h2 className="font-display text-4xl md:text-5xl mt-4 text-foreground">
              Các Loại Lô Đất An Táng
            </h2>
          </motion.div>

          {/* Staggered Cards Layout */}
          <motion.div {...fadeInUp} className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              {plotTypesLeft.map((plot, index) => (
                <div key={plot.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <ImageCarousel images={plot.images} className="h-64 md:h-80" />
                  <div className="p-6 md:p-8">
                    <span className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
                      {plot.category}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-primary mt-2 mb-4">
                      {plot.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {plot.description}
                    </p>
                    <button className="text-foreground text-sm flex items-center gap-2 mb-4 hover:text-primary transition-colors">
                      {plot.buttonText} <ChevronRight className="w-4 h-4 text-primary" />
                    </button>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      NHẬN BÁO GIÁ
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Offset */}
            <div className="space-y-8 lg:mt-32">
              {plotTypesRight.map((plot) => (
                <div key={plot.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-6 md:p-8">
                    <span className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
                      {plot.category}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-primary mt-2 mb-4">
                      {plot.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {plot.description}
                    </p>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      {plot.buttonText}
                    </Button>
                  </div>
                  <ImageCarousel images={plot.images} className="h-64 md:h-80" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blue Background Plot Types Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Card - Image Top */}
            <div className="bg-primary border border-white/20 rounded-lg overflow-hidden">
              <ImageCarousel images={[landscapeImage, heroParkImage]} className="h-64 md:h-72" />
              <div className="p-6 md:p-8">
                <span className="text-white/60 text-xs tracking-[0.15em] uppercase">
                  CON NGƯỜI VÀ THIÊN NHIÊN HÒA QUYỆN
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-white mt-2 mb-4">
                  Lô Đất Đơn và Đôi
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Công viên tưởng niệm Nirvana được thiết kế hài hòa với cảnh quan thiên nhiên. 
                  Thanh bình và thơ mộng, nơi đây xoa dịu tâm hồn. Phong thủy tuyệt vời mang lại 
                  sự thịnh vượng cho các thế hệ.
                </p>
                <button className="text-white text-sm flex items-center gap-2 mb-4 hover:text-white/80 transition-colors">
                  XEM THÊM <ChevronRight className="w-4 h-4" />
                </button>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  NHẬN BÁO GIÁ
                </Button>
              </div>
            </div>

            {/* Right Card - Text Top */}
            <div className="bg-primary border border-white/20 rounded-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <span className="text-white/60 text-xs tracking-[0.15em] uppercase">
                  NƠI AN NGHỈ VĨNH HẰNG THIÊN ĐƯỜNG
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-white mt-2 mb-4">
                  Khu Tưởng Niệm Công Giáo
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Lấy cảm hứng từ "Vương quốc Thiên đường", Khu Tưởng Niệm Công Giáo là nơi 
                  an nghỉ vĩnh hằng trang nghiêm và tao nhã dành cho người Công giáo. 
                  Thiết kế thanh bình bao gồm các lô đất đa dạng và nhà lưu trữ tro cốt.
                </p>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  NHẬN BÁO GIÁ
                </Button>
              </div>
              <ImageCarousel images={[heroTreesImage, columbariumImage]} className="h-64 md:h-72" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 360 View Section */}
      <section className="py-20 bg-[#8b9dc3]">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center">
            <span className="text-white/80 text-sm tracking-[0.3em] uppercase font-medium">XEM</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-3 mb-6 tracking-wider">
              CÔNG VIÊN TƯỞNG NIỆM NIRVANA
            </h2>
            <Button 
              variant="outline" 
              className="border-white/50 text-white hover:bg-white/10 mb-10"
            >
              Tham Quan 360°
            </Button>
            
            {/* Video Section */}
            <div className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl aspect-video">
              <img 
                src={heroParkImage} 
                alt="Nirvana Memorial Park" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                  <Play className="w-8 h-8 text-white fill-white/80 ml-1" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8 Considerations Section */}
      <section className="py-0">
        {/* Top Half - Blue with Title and Image */}
        <div className="bg-primary">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="grid lg:grid-cols-2 gap-8 items-center py-16">
              <div className="text-white">
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                  8 điều cần cân nhắc khi<br />
                  <span className="text-white/90">chọn nơi an táng</span>
                </h2>
              </div>
              <div className="relative">
                <img 
                  src={family1Image} 
                  alt="Happy family" 
                  className="w-full h-80 object-cover rounded-lg shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Half - White with Considerations List */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-16">
            <motion.div {...fadeInUp} className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {considerations.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-4 border-l-4 border-primary pl-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground">{item}</span>
                  <Plus className="w-5 h-5 text-primary group-hover:rotate-45 transition-transform" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image with Border */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary rounded-full" />
              <img 
                src={family2Image} 
                alt="Family in park" 
                className="w-full h-[400px] object-cover ml-6 rounded-lg shadow-lg"
              />
            </div>

            {/* Content */}
            <div>
              <h3 className="font-display text-3xl md:text-4xl text-primary mb-6">
                Sự khác biệt giữa công viên tưởng niệm và nghĩa trang truyền thống
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Khi lên kế hoạch trước hoặc tìm kiếm nơi an nghỉ cho người thân, bạn có thể gặp 
                các thuật ngữ "công viên tưởng niệm" và "nghĩa trang". Đôi khi bạn có thể nghe 
                hai thuật ngữ này được sử dụng thay thế cho nhau. Hai thuật ngữ này có cùng ý nghĩa không?
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Mặc dù mục đích có thể giống nhau, công viên tưởng niệm và nghĩa trang thực sự 
                có sự khác biệt rõ ràng về cảnh quan, tiện nghi và trải nghiệm thăm viếng.
              </p>
              <button className="text-foreground text-sm flex items-center gap-2 hover:text-primary transition-colors font-medium tracking-wide">
                XEM THÊM <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BurialPlots;
