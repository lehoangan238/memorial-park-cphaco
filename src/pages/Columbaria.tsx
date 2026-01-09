import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Import images
import columbariumImage from "@/assets/columbarium.jpg";
import landscapeImage from "@/assets/landscape.jpg";
import heroParkImage from "@/assets/hero-park.jpg";
import heroTreesImage from "@/assets/hero-trees.jpg";
import family1Image from "@/assets/family-1.jpg";
import family2Image from "@/assets/family-2.jpg";
import family3Image from "@/assets/family-3.jpg";
import familyHugImage from "@/assets/family-hug.jpg";

// Animation
const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: easeOut }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: easeOut }
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: easeOut }
};

const columbariaTypes = [
  {
    id: 1,
    title: "Luxury Columbarium",
    description: "A sanctuary of eternal peace, our Luxury Columbarium features exquisite marble finishes, ornate architectural details, and serene ambiance. Each niche is crafted with precision to honor your loved ones with the dignity they deserve.",
    layout: "images-left-blue-right",
    images: [columbariumImage, family1Image]
  },
  {
    id: 2,
    title: "Modern Columbarium",
    description: "Contemporary design meets timeless reverence. Our Modern Columbarium offers clean lines, natural lighting, and peaceful gardens that create a tranquil environment for remembrance and reflection.",
    layout: "blue-left-image-right",
    image: landscapeImage
  },
  {
    id: 3,
    title: "Ancient Chinese Architecture",
    description: "Inspired by traditional Chinese design principles, this columbarium combines feng shui elements with modern construction. The harmonious blend of water features, traditional pavilions, and lush greenery creates a sacred space.",
    layout: "image-left-white-right",
    image: heroParkImage
  },
  {
    id: 4,
    title: "Cherished Columbarium",
    description: "Designed with warmth and comfort in mind, the Cherished Columbarium provides an intimate setting for families to gather and remember. Soft lighting and thoughtful design elements create a welcoming atmosphere.",
    layout: "blue-left-image-right",
    image: columbariumImage
  },
  {
    id: 5,
    title: "Shrine of Elite",
    description: "The pinnacle of memorial architecture, the Shrine of Elite offers exclusive niches with premium finishes, private viewing areas, and personalized memorial services. A testament to lives lived with distinction.",
    layout: "image-left-blue-right",
    image: family2Image,
    hasButton: true
  },
  {
    id: 6,
    title: "Niches",
    description: "Our thoughtfully designed niches come in various sizes and configurations to accommodate different needs. Each niche is built with quality materials and can be personalized with engravings and memorial plaques.",
    layout: "navy-left-image-right",
    image: heroTreesImage
  }
];

const moreColumbaria = [
  { title: "Columbarium and Cremation Facilities", image: family1Image },
  { title: "Memorial Suites for Cremation", image: family2Image },
  { title: "The Difference Between Columbarium and Mausoleum", image: family3Image }
];

const Columbaria = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Navy Background */}
      <section className="relative bg-[#1e2a4a] h-[40vh] min-h-[300px] flex items-center justify-center">
        <div className="text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="font-display text-4xl md:text-5xl lg:text-6xl italic"
          >
            Columbaria
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
            className="text-white/70 text-sm md:text-base mt-4 max-w-md mx-auto"
          >
            A sacred space for eternal remembrance
          </motion.p>
        </div>
      </section>

      {/* Video Section with Marble Table */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            {/* Video/Image */}
            <div className="relative aspect-video bg-muted overflow-hidden group cursor-pointer mb-8">
              <img 
                src={columbariumImage} 
                alt="Columbarium showcase" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-primary ml-1" fill="currentColor" />
                </div>
              </div>
              <span className="absolute bottom-4 left-4 text-white text-[10px] tracking-[0.25em] uppercase font-medium">
                W A T C H
              </span>
            </div>

            {/* Intro Text */}
            <div className="text-center">
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground italic mb-6">
                Redefining reverence through architectural magnificence
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
                Our columbaria are designed with meticulous attention to detail, combining traditional values 
                with modern aesthetics. Each space is crafted to provide a dignified and peaceful environment 
                for families to honor and remember their loved ones.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Types Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center">
            <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-medium">D I S C O V E R</span>
            <h2 className="font-display text-3xl md:text-4xl mt-4 text-foreground italic">
              Columbaria types
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 1: Images Left + Blue Right */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          {/* Left - Two Stacked Images */}
          <motion.div {...fadeInLeft} className="flex flex-col">
            <img 
              src={columbariumImage} 
              alt="Luxury Columbarium" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <img 
              src={family1Image} 
              alt="Interior" 
              className="w-full h-48 object-cover"
            />
          </motion.div>
          
          {/* Right - Blue Box */}
          <motion.div {...fadeInRight} className="bg-primary p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
              Luxury Columbarium
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              A sanctuary of eternal peace, our Luxury Columbarium features exquisite marble finishes, 
              ornate architectural details, and serene ambiance. Each niche is crafted with precision 
              to honor your loved ones with the dignity they deserve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 2: Blue Left + Image Right */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          {/* Left - Blue Box */}
          <motion.div {...fadeInLeft} className="bg-primary p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
            <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
              Modern Columbarium
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Contemporary design meets timeless reverence. Our Modern Columbarium offers clean lines, 
              natural lighting, and peaceful gardens that create a tranquil environment for remembrance 
              and reflection.
            </p>
          </motion.div>
          
          {/* Right - Image */}
          <motion.div {...fadeInRight} className="order-1 lg:order-2">
            <img 
              src={landscapeImage} 
              alt="Modern Columbarium" 
              className="w-full h-64 md:h-80 lg:h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 3: Image Left + White with Pattern Right */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          {/* Left - Image */}
          <motion.div {...fadeInLeft}>
            <img 
              src={heroParkImage} 
              alt="Ancient Chinese Architecture" 
              className="w-full h-64 md:h-80 lg:h-full object-cover"
            />
          </motion.div>
          
          {/* Right - White Box with Dotted Pattern */}
          <motion.div 
            {...fadeInRight} 
            className="bg-[#f5f6f8] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden"
          >
            {/* Dotted Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />
            <div className="relative z-10">
              <h3 className="font-display text-2xl md:text-3xl text-foreground italic mb-6">
                Ancient Chinese Architecture
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Inspired by traditional Chinese design principles, this columbarium combines feng shui 
                elements with modern construction. The harmonious blend of water features, traditional 
                pavilions, and lush greenery creates a sacred space.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 4: Blue Left + Image Right */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          {/* Left - Blue Box */}
          <motion.div {...fadeInLeft} className="bg-primary p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
            <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
              Cherished Columbarium
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Designed with warmth and comfort in mind, the Cherished Columbarium provides an intimate 
              setting for families to gather and remember. Soft lighting and thoughtful design elements 
              create a welcoming atmosphere.
            </p>
          </motion.div>
          
          {/* Right - Image */}
          <motion.div {...fadeInRight} className="order-1 lg:order-2">
            <img 
              src={columbariumImage} 
              alt="Cherished Columbarium" 
              className="w-full h-64 md:h-80 lg:h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 5: Image Left + Blue Right with Button */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          {/* Left - Image */}
          <motion.div {...fadeInLeft}>
            <img 
              src={family2Image} 
              alt="Shrine of Elite" 
              className="w-full h-64 md:h-80 lg:h-full object-cover"
            />
          </motion.div>
          
          {/* Right - Blue Box with Button */}
          <motion.div {...fadeInRight} className="bg-primary p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
              Shrine of Elite
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-8">
              The pinnacle of memorial architecture, the Shrine of Elite offers exclusive niches with 
              premium finishes, private viewing areas, and personalized memorial services. A testament 
              to lives lived with distinction.
            </p>
            <div>
              <Button className="bg-white text-primary hover:bg-white/90 px-8 text-[10px] tracking-[0.15em] h-10">
                ENQUIRE NOW
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 6: Navy Left + Image Right */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          {/* Left - Navy Box */}
          <motion.div {...fadeInLeft} className="bg-[#1e2a4a] p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
            <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
              Niches
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Our thoughtfully designed niches come in various sizes and configurations to accommodate 
              different needs. Each niche is built with quality materials and can be personalized with 
              engravings and memorial plaques.
            </p>
          </motion.div>
          
          {/* Right - Image */}
          <motion.div {...fadeInRight} className="order-1 lg:order-2">
            <img 
              src={heroTreesImage} 
              alt="Niches" 
              className="w-full h-64 md:h-80 lg:h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Full-width Video Section */}
      <section className="relative">
        <div className="relative h-[50vh] min-h-[350px]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${landscapeImage})` 
            }}
          />
          {/* Decorative Pattern Overlay */}
          <div 
            className="absolute inset-0 bg-black/30"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="relative z-10 h-full flex items-center justify-center">
            <motion.div 
              {...fadeInUp}
              className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* More Columbaria CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 text-[10px] tracking-[0.2em] h-10">
              MORE COLUMBARIA
            </Button>
          </motion.div>

          {/* Three Cards */}
          <motion.div {...fadeInUp} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {moreColumbaria.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="overflow-hidden mb-4">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-white text-sm font-medium text-center leading-tight">
                  {item.title}
                </h4>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Columbaria;
