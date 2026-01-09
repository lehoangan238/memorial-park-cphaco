import { motion } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";

// Import images (placeholder - will use existing images)
import columbariumImage from "@/assets/columbarium.jpg";
import landscapeImage from "@/assets/landscape.jpg";
import heroParkImage from "@/assets/hero-park.jpg";
import heroTreesImage from "@/assets/hero-trees.jpg";
import family1Image from "@/assets/family-1.jpg";
import family2Image from "@/assets/family-2.jpg";
import family3Image from "@/assets/family-3.jpg";
import familyHugImage from "@/assets/family-hug.jpg";
import heroBgImage from "@/assets/hero-bg.jpg";

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

const benefits = [
  "Blessing Longevity",
  "Warding off hidden enemies",
  "Chance to recover",
  "Spurring career growth",
  "Improving health and wealth",
  "Improving human relationship luck",
  "Encouraging precious birth",
];

const readMoreArticles = [
  { 
    title: "The significance of ancestral tablets", 
    image: columbariumImage 
  },
  { 
    title: "The Feng Shui principles behind Sheng Ji", 
    image: family1Image 
  },
  { 
    title: "Why make offerings of light?", 
    image: family2Image 
  },
];

const Others = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Purple/Sunset Gradient Background */}
      <section 
        className="relative h-[35vh] min-h-[280px] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(234, 88, 12, 0.7) 50%, rgba(251, 191, 36, 0.8) 100%)'
        }}
      >
        {/* Background image overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${heroBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="font-display text-4xl md:text-5xl lg:text-6xl italic"
          >
            Other Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
            className="text-white/90 text-sm md:text-base mt-4"
          >
            Ancestral Tablets, Eternal Blessing Lights, NV Seed
          </motion.p>
        </div>
      </section>

      {/* Section 1: Ancestral Tablet - White Background */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            {/* Left: Static Image with caption */}
            <motion.div {...fadeInLeft}>
              <div className="border border-gray-200 p-1">
                <img 
                  src={columbariumImage} 
                  alt="Ancestral Tablet" 
                  className="w-full aspect-square object-cover"
                />
              </div>
              <p className="text-center font-display text-xl italic text-foreground mt-4">
                Ancestral Tablet
              </p>
            </motion.div>

            {/* Right: Text Content + Carousel at bottom */}
            <motion.div {...fadeInRight} className="flex flex-col justify-start">
              <h2 className="font-display text-3xl md:text-4xl text-[#c9a227] mb-6">
                Ancestral Tablet
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Ancestral worship in the form of ancestral tablets is a Chinese tradition 
                that dates back to the ancient times. Ancestral tablets in the past 
                usually take central position at the altar of traditional Chinese homes. 
                It is a sacred item that is synonymous with the virtue of filial piety.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                The passage of time is changing the way we pay homage to our 
                ancestors and families may not have time or space to honour their ancestors 
                at home. Nirvana offers the option of installing ancestral tablets at 
                various memorial centres to preserve and promote the virtuous 
                tradition of honouring our ancestors while accommodating modern 
                lifestyles. At the same time, we offer thoughtfully-designed ancestral 
                tablets that are installed in elegant and air-conditioned settings – 
                surrounding sanctified altars dedicated to divinities and enlightened 
                beings.
              </p>
              
              {/* Image Carousel at bottom */}
              <div className="group">
                <ImageCarousel 
                  images={[columbariumImage, landscapeImage, heroParkImage]}
                  className="w-full aspect-[16/10]"
                  showDots={true}
                  showArrows={true}
                  dotsPosition="outside"
                  dotsColor="primary"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: NV Seed - Gray Background */}
      <section className="py-16 md:py-24 bg-[#e8ecf1]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Text Content */}
            <motion.div {...fadeInLeft}>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                NV Seed
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                The principles of Sheng Ji or "Living Tomb" involves the creation of a 
                tomb for a living person in order to harness auspicious energies of an 
                environment with excellent Feng Shui to remedy imperfections 
                contained within the subject's destiny or Ba Zi.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                NV Seed takes advantage of the powerful Feng Shui dynamics found at 
                Nirvana's various memorial parks which are endorsed by renowned 
                masters for the purpose of installing Sheng Ji. By deploying this Feng 
                Shui remedy, a person's life can be improved in various ways such as 
                enhanced fortune, career, health, family relations and overall luck.
              </p>
            </motion.div>

            {/* Right: Blue Box with Image + Caption */}
            <motion.div {...fadeInRight}>
              <div className="bg-primary p-6 md:p-8">
                <img 
                  src={landscapeImage} 
                  alt="NV Seed" 
                  className="w-full aspect-[4/3] object-cover"
                />
                <p className="text-center font-display text-xl italic text-white mt-4">
                  NV Seed
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: 7 Benefits - Gray Background continues */}
      <section className="py-10 md:py-16 bg-[#e8ecf1]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Image */}
            <motion.div {...fadeInLeft}>
              <img 
                src={heroParkImage} 
                alt="Sheng Ji memorial" 
                className="w-full aspect-[4/3] object-cover"
              />
            </motion.div>

            {/* Right: Blue Box with Title + Benefits List */}
            <motion.div {...fadeInRight}>
              <div className="bg-primary p-6 md:p-8">
                <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
                  7 benefits of installing Sheng Ji
                </h2>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  The installation of Sheng Ji or "Living Tomb" has many benefits if done 
                  with proper care and consultation. The seven key benefits for installing 
                  Sheng Ji are:
                </p>
                
                {/* Benefits List */}
                <div className="space-y-0">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0"
                    >
                      <span className="text-white text-sm">{benefit}</span>
                      <div className="w-6 h-6 bg-white/20 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Eternal Blessing Lights - Blue Background */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Image Carousel with caption */}
            <motion.div {...fadeInLeft} className="group">
              <ImageCarousel 
                images={[columbariumImage, family1Image, landscapeImage]}
                className="w-full aspect-[4/3] shadow-xl"
                showDots={true}
                showArrows={true}
                dotsPosition="outside"
                dotsColor="white"
              />
              <p className="text-center font-display text-xl italic text-white mt-4">
                Eternal Blessing Lights
              </p>
            </motion.div>

            {/* Right: Text Content with small images */}
            <motion.div {...fadeInRight}>
              <h2 className="font-display text-3xl md:text-4xl text-white italic mb-6">
                Eternal Blessing Lights
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Since ancient times, the practice of offering a oil or candle fire, a lamp or other 
                light before Buddha has been part of Buddhism, although originally candles 
                and oil were the more common sources of light. These lights are seen as great 
                positive karma for the donor.
              </p>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Described by practitioners as profound yet effortless, lighting a 'Brightness Light' 
                is a way of making an offering which can then bring blessings upon 
                whoever it is offered to. The offering of light symbolizes illuminating ignorance 
                of the Buddha, not the physical offerings of light.
              </p>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                As practitioners offer these ritual offerings, prayer services, free temple fittings 
                the practitioner hopes that peace is experienced both by their loved ones 
                and by those that the offerings are made in dedication to. The ritual offerings are 
                for purposes meant to honor, show love. They also allow visitors to enjoy the 
                temple's peaceful temple canopy of blessing lights whenever possible.
              </p>
              
              {/* Small gallery of 2 images */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <img 
                  src={family1Image} 
                  alt="Blessing lights detail 1" 
                  className="w-full aspect-[4/3] object-cover"
                />
                <img 
                  src={family2Image} 
                  alt="Blessing lights detail 2" 
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5: Read More - Light Gray Background */}
      <section className="py-16 md:py-20 bg-[#f5f5f5]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          {/* READ MORE Button */}
          <motion.div {...fadeInUp} className="flex justify-center mb-12">
            <button className="bg-primary text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors">
              READ MORE
            </button>
          </motion.div>

          {/* 3 Article Cards */}
          <motion.div 
            {...fadeInUp}
            className="grid md:grid-cols-3 gap-6"
          >
            {readMoreArticles.map((article, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-foreground text-sm mt-4 group-hover:text-primary transition-colors">
                  {article.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Others;
