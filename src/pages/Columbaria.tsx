import { motion } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";
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

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: easeOut }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easeOut }
  }
};

const moreColumbaria = [
  { title: "Columbarium and Cremation Facilities", image: family1Image },
  { title: "Memorial Suites for Cremation", image: family2Image },
  { title: "The Difference Between Columbarium and Mausoleum", image: family3Image }
];

const Columbaria = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Navy Background */}
      <section className="relative bg-[#1e2a4a] h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: easeOut }}
          className="absolute inset-0 bg-[#1e2a4a]"
        />
        <div className="relative z-10 text-center text-white px-4">
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
            <motion.div 
              {...scaleIn}
              className="relative aspect-video bg-muted overflow-hidden group cursor-pointer mb-10"
            >
              <img 
                src={columbariumImage} 
                alt="Columbarium showcase" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 md:w-16 md:h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-primary ml-1" fill="currentColor" />
                </motion.div>
              </div>
              <span className="absolute bottom-4 left-4 text-white text-[10px] tracking-[0.25em] uppercase font-medium">
                W A T C H
              </span>
            </motion.div>

            {/* Intro Text */}
            <motion.div {...fadeInUp} className="text-center">
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground italic mb-6">
                Redefining reverence through architectural magnificence
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
                Our columbaria are designed with meticulous attention to detail, combining traditional values 
                with modern aesthetics. Each space is crafted to provide a dignified and peaceful environment 
                for families to honor and remember their loved ones.
              </p>
            </motion.div>
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

      {/* Columbaria Type 1: Blue Box with Image Left Overflow */}
      <section className="py-10 md:py-16 bg-[#e8ecf1]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div 
            {...fadeInUp}
            className="relative bg-primary"
          >
            {/* Inner container with padding */}
            <div className="relative py-10 md:py-14 pr-6 md:pr-12 lg:pr-16 pl-6 md:pl-[45%] lg:pl-[50%] min-h-[350px] md:min-h-[400px] flex flex-col justify-center">
              {/* Text Content */}
              <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
                Luxury Columbarium
              </h3>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">
                A sanctuary of eternal peace, our Luxury Columbarium features exquisite marble finishes, 
                ornate architectural details, and serene ambiance. Each niche is crafted with precision 
                to honor your loved ones with the dignity they deserve.
              </p>
            </div>
            
            {/* Image - Positioned to overflow the blue box on LEFT */}
            <div className="lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[55%] lg:-translate-x-4 p-4 lg:p-0">
              <div className="flex flex-col gap-2">
                <img 
                  src={columbariumImage} 
                  alt="Luxury Columbarium" 
                  className="w-full h-48 md:h-[220px] object-cover shadow-2xl"
                />
                <img 
                  src={family1Image} 
                  alt="Interior" 
                  className="w-full h-32 md:h-[140px] object-cover shadow-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 2: Blue Box with Image Right Overflow */}
      <section className="py-10 md:py-16 bg-[#e8ecf1]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div 
            {...fadeInUp}
            className="relative bg-primary"
          >
            {/* Inner container with padding */}
            <div className="relative py-10 md:py-14 pl-6 md:pl-12 lg:pl-16 pr-6 md:pr-[45%] lg:pr-[50%] min-h-[350px] md:min-h-[400px] flex flex-col justify-center">
              {/* Text Content */}
              <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-3 block">
                SPIRITUAL COMFORT MEETS CONTEMPORARY SENSIBILITIES
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
                Christian Columbarium
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-md">
                The artistic Christian Columbarium is a masterpiece of bereavement architecture 
                that is unlike any other. While its unique style exudes a distinctive Christian 
                character, the Christian Columbarium presents the best of both worlds: spiritual 
                comfort and contemporary sensibilities.
              </p>
              <button className="text-white text-xs flex items-center gap-2 hover:text-white/80 transition-colors tracking-[0.1em] uppercase font-medium">
                READ MORE <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><ChevronRight className="w-3 h-3" /></span>
              </button>
            </div>
            
            {/* Image - Positioned to overflow the blue box on RIGHT */}
            <div className="lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[55%] lg:translate-x-4 p-4 lg:p-0">
              <div className="relative">
                <img 
                  src={columbariumImage} 
                  alt="Christian Columbarium" 
                  className="w-full h-64 md:h-[340px] object-cover shadow-2xl"
                />
                {/* Carousel Dots */}
                <div className="flex justify-center gap-1.5 mt-4 lg:absolute lg:-bottom-8 lg:left-1/2 lg:-translate-x-1/2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 3: White Box with Image Left Overflow + Dotted Pattern */}
      <section className="py-10 md:py-16 bg-[#e8ecf1]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div 
            {...fadeInUp}
            className="relative bg-white overflow-visible"
          >
            {/* Dotted Pattern on right side */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 hidden lg:block"
              style={{
                backgroundImage: `radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)`,
                backgroundSize: '12px 12px'
              }}
            />
            
            {/* Inner container with padding */}
            <div className="relative py-10 md:py-14 pr-6 md:pr-12 lg:pr-16 pl-6 md:pl-[45%] lg:pl-[50%] min-h-[350px] md:min-h-[400px] flex flex-col justify-center z-10">
              {/* Text Content */}
              <span className="text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-3 block">
                AN OPULENT DESIGN REMINISCENT OF ANCIENT TIMES
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-foreground italic mb-6">
                Ancient Chinese Architecture Columbarium
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                The multi-million ringgit Oriental Villa is a signature masterpiece of Nirvana Memorial Garden. 
                Built to house the urns of the departed, its elegant and spacious interiors are designed to 
                convey a sense of traditional ancient Chinese opulence.
              </p>
              <button className="text-foreground text-xs flex items-center gap-2 hover:text-primary transition-colors tracking-[0.1em] uppercase font-medium">
                READ MORE <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>
            
            {/* Image - Positioned to overflow on LEFT with decorative frame */}
            <div className="lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[50%] lg:-translate-x-4 p-4 lg:p-0">
              <div className="relative p-3 bg-[#f0f4f8]">
                {/* Decorative corner borders */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/30" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30" />
                <img 
                  src={heroParkImage} 
                  alt="Ancient Chinese Architecture" 
                  className="w-full h-64 md:h-[320px] object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 4: Blue Box with Image Right Overflow */}
      <section className="py-10 md:py-16 bg-[#e8ecf1]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div 
            {...fadeInUp}
            className="relative bg-primary"
          >
            {/* Inner container with padding */}
            <div className="relative py-10 md:py-14 pl-6 md:pl-12 lg:pl-16 pr-6 md:pr-[45%] lg:pr-[50%] min-h-[350px] md:min-h-[400px] flex flex-col justify-center">
              {/* Text Content */}
              <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-3 block">
                A PLACE TO CHERISH MEMORIES
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
                Cherished Columbarium
              </h3>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">
                Designed with warmth and comfort in mind, the Cherished Columbarium provides an intimate 
                setting for families to gather and remember. Soft lighting and thoughtful design elements 
                create a welcoming atmosphere for reflection and peace.
              </p>
            </div>
            
            {/* Image - Positioned to overflow on RIGHT */}
            <div className="lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[55%] lg:translate-x-4 p-4 lg:p-0">
              <img 
                src={columbariumImage} 
                alt="Cherished Columbarium" 
                className="w-full h-64 md:h-[340px] object-cover shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 5: Blue Box with Image Left Overflow + Button */}
      <section className="py-10 md:py-16 bg-[#e8ecf1]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div 
            {...fadeInUp}
            className="relative bg-primary"
          >
            {/* Inner container with padding */}
            <div className="relative py-10 md:py-14 pr-6 md:pr-12 lg:pr-16 pl-6 md:pl-[45%] lg:pl-[50%] min-h-[350px] md:min-h-[400px] flex flex-col justify-center">
              {/* Text Content */}
              <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
                Shrine of Elite
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-md">
                The pinnacle of memorial architecture, the Shrine of Elite offers exclusive niches with 
                premium finishes, private viewing areas, and personalized memorial services. A testament 
                to lives lived with distinction.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-white text-primary hover:bg-white/90 px-8 text-[10px] tracking-[0.15em] h-10 w-fit">
                  ENQUIRE NOW
                </Button>
              </motion.div>
            </div>
            
            {/* Image - Positioned to overflow on LEFT */}
            <div className="lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[55%] lg:-translate-x-4 p-4 lg:p-0">
              <img 
                src={family2Image} 
                alt="Shrine of Elite" 
                className="w-full h-64 md:h-[340px] object-cover shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Columbaria Type 6: Navy Box with Image Right Overflow */}
      <section className="py-10 md:py-16 bg-[#e8ecf1]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div 
            {...fadeInUp}
            className="relative bg-[#1e2a4a]"
          >
            {/* Inner container with padding */}
            <div className="relative py-10 md:py-14 pl-6 md:pl-12 lg:pl-16 pr-6 md:pr-[45%] lg:pr-[50%] min-h-[350px] md:min-h-[400px] flex flex-col justify-center">
              {/* Text Content */}
              <h3 className="font-display text-2xl md:text-3xl text-white italic mb-6">
                Niches
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-md">
                Our thoughtfully designed niches come in various sizes and configurations to accommodate 
                different needs. Each niche is built with quality materials and can be personalized with 
                engravings and memorial plaques to create a lasting tribute.
              </p>
            </div>
            
            {/* Image - Positioned to overflow on RIGHT */}
            <div className="lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[55%] lg:translate-x-4 p-4 lg:p-0">
              <img 
                src={heroTreesImage} 
                alt="Niches" 
                className="w-full h-64 md:h-[340px] object-cover shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full-width Video Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...scaleIn} className="max-w-5xl mx-auto relative">
            <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${landscapeImage})` 
                }}
              />
              {/* Decorative Pattern Overlay */}
              <div 
                className="absolute inset-0 bg-black/20"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                  backgroundSize: '25px 25px'
                }}
              />
              <div className="relative z-10 h-full flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" fill="currentColor" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* More Columbaria CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase block mb-4">MORE</span>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-10 text-[10px] tracking-[0.2em] h-11">
              COLUMBARIA
            </Button>
          </motion.div>

          {/* Three Cards */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {moreColumbaria.map((item, index) => (
              <motion.div 
                key={index} 
                variants={staggerItem}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden mb-4">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-white text-sm font-medium text-center leading-tight px-2">
                  {item.title}
                </h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Columbaria;
