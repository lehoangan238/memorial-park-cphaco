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
import coupleBeachImage from "@/assets/couple-beach.jpg";

// Animation variants
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
  initial: { opacity: 0, scale: 0.9 },
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

const howItWorksSteps = [
  {
    number: "01",
    title: "Initial Consultation",
    description: "Our team will listen and advise the most suitable plan for your family."
  },
  {
    number: "02", 
    title: "Detailed Planning",
    description: "Design the funeral in detail according to the wishes and cultural traditions."
  },
  {
    number: "03",
    title: "Careful Preparation",
    description: "All preparations are carried out professionally and wholeheartedly."
  },
  {
    number: "04",
    title: "Funeral Execution",
    description: "Organize a solemn and warm funeral according to the agreed plan."
  }
];

const reasons = [
  "We offer affordable packages for different family budgets and requirements.",
  "Professional staff trained to handle every aspect with care.",
  "Modern facilities with comfortable and dignified spaces."
];

const FuneralService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: easeOut }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${heroTreesImage})` 
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 italic"
          >
            Funeral Service
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: easeOut }}
            className="text-base md:text-lg text-white/80 max-w-xl mx-auto"
          >
            A dignified farewell with professional and caring service
          </motion.p>
        </div>
      </section>

      {/* Gold Decorative Bar */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 origin-left" 
      />

      {/* Nirvana Life Plan Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase">N I R V A N A &nbsp; L I F E &nbsp; P L A N</span>
            <h2 className="font-display text-3xl md:text-4xl mt-4 text-foreground italic">
              Nirvana Life Plan
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <p className="text-muted-foreground text-center text-sm leading-relaxed mb-10">
              The Nirvana Life Plan is a comprehensive solution that gives you and your family peace of mind about the future. 
              With a flexible plan, you can prepare early to reduce the financial and emotional burden on your loved ones 
              during the most difficult times. Our experienced team will guide you through every step of the planning process.
            </p>

            {/* Video Placeholder */}
            <motion.div 
              {...scaleIn}
              className="relative aspect-video bg-muted overflow-hidden group cursor-pointer shadow-lg"
            >
              <img 
                src={columbariumImage} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-primary ml-1" fill="currentColor" />
                </motion.div>
              </div>
              <span className="absolute bottom-4 left-4 text-white text-[10px] tracking-[0.25em] uppercase font-medium">
                W A T C H
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-[#f5f6f8]">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-foreground italic">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-3 text-sm max-w-xl mx-auto">
              Our funeral service process is designed to be simple, transparent and professional
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-12"
          >
            {howItWorksSteps.map((step) => (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display text-primary/30 mb-3">
                  {step.number}
                </div>
                <h3 className="font-medium text-sm md:text-base text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Process Images Row */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto"
          >
            {[family1Image, family2Image, family3Image, familyHugImage].map((img, i) => (
              <motion.img 
                key={i}
                variants={staggerItem}
                src={img} 
                alt={`Process ${i + 1}`} 
                className="w-full h-24 md:h-32 object-cover hover:scale-105 transition-transform duration-500" 
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grand Memorial Parlour Section - Two Column */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left - Images Grid */}
              <motion.div {...fadeInLeft} className="space-y-3">
                <motion.img 
                  {...scaleIn}
                  src={columbariumImage} 
                  alt="Grand Memorial Parlour" 
                  className="w-full h-48 md:h-56 object-cover hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6, ease: easeOut }}
                    src={landscapeImage} 
                    alt="Interior 1" 
                    className="w-full h-32 md:h-36 object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
                    src={heroParkImage} 
                    alt="Interior 2" 
                    className="w-full h-32 md:h-36 object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </motion.div>

              {/* Right - Text Content */}
              <motion.div {...fadeInRight} className="flex flex-col justify-center">
                <h2 className="font-display text-2xl md:text-3xl text-foreground italic mb-5">
                  Grand Memorial Parlour
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  The Grand Memorial Parlour is designed with a dignified, warm and fully equipped space. 
                  We provide a suitable environment for family and friends to farewell their loved ones 
                  in peace and respect. With flexible capacity from 50 to 500 people, the funeral home 
                  can accommodate any scale of funeral according to the family's wishes.
                </p>

                {/* Product Icons Row */}
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex gap-6 md:gap-10"
                >
                  {[
                    { icon: "🏺", label: "Urn", bg: "bg-amber-50" },
                    { icon: "🪻", label: "Flowers", bg: "bg-green-50" },
                    { icon: "🕯️", label: "Candles", bg: "bg-blue-50" },
                    { icon: "💐", label: "Bouquet", bg: "bg-pink-50" }
                  ].map((item, i) => (
                    <motion.div key={i} variants={staggerItem} className="text-center">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-14 h-14 md:w-16 md:h-16 ${item.bg} rounded-full flex items-center justify-center mb-2`}
                      >
                        <span className="text-xl md:text-2xl">{item.icon}</span>
                      </motion.div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxurious Casket & Urn Section */}
      <section className="py-16 md:py-20 bg-[#f5f6f8] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left - Text */}
              <motion.div {...fadeInLeft}>
                <h2 className="font-display text-2xl md:text-3xl text-foreground italic mb-5">
                  Luxurious Casket & Urn
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  The premium casket and urn collection is crafted from the finest materials 
                  with exquisite design, demonstrating elegance and respect for the deceased. 
                  From traditional to modern styles, we offer a variety of options suitable 
                  for all cultural and religious ceremonies.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Each piece is carefully selected and presented with dignity, ensuring 
                  your loved one is honored in the most respectful manner.
                </p>
              </motion.div>

              {/* Right - Large Casket Image */}
              <motion.div {...fadeInRight}>
                <motion.img 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  src={landscapeImage} 
                  alt="Luxurious Casket" 
                  className="w-full h-64 md:h-80 object-cover shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - The Guardian */}
      <section className="relative overflow-hidden">
        <div className="relative h-[50vh] min-h-[350px]">
          <motion.div 
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: easeOut }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${heroParkImage})` 
            }}
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <motion.span 
              {...fadeInUp}
              className="text-[10px] tracking-[0.3em] uppercase mb-3 text-white/70"
            >
              W A T C H
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="font-display text-3xl md:text-4xl lg:text-5xl italic mb-6 text-center"
            >
              THE GUARDIAN
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6 Reasons Section */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left - Reasons List */}
              <motion.div {...fadeInLeft}>
                <h2 className="font-display text-2xl md:text-3xl text-foreground italic mb-4">
                  6 Reasons
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Why customers trust and choose Nirvana's funeral services
                </p>

                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4 mb-10"
                >
                  {reasons.map((reason, index) => (
                    <motion.div key={index} variants={staggerItem} className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{reason}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* While Endless Sub-section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6, ease: easeOut }}
                  className="border-t pt-8"
                >
                  <h3 className="font-display text-xl md:text-2xl text-foreground italic mb-3">
                    While Endless
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Creating lasting memories and honoring lives with dignity and grace. 
                    Our commitment extends beyond the service to support families in their journey of remembrance.
                  </p>
                </motion.div>
              </motion.div>

              {/* Right - Images */}
              <motion.div {...fadeInRight} className="space-y-4">
                <motion.img 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  src={coupleBeachImage} 
                  alt="Reason 1" 
                  className="w-full h-48 md:h-56 object-cover" 
                />
                <motion.img 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  src={family1Image} 
                  alt="Reason 2" 
                  className="w-full h-48 md:h-56 object-cover" 
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Blue CTA Banner */}
      <section className="py-12 md:py-16 bg-primary overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <span className="text-white/70 text-[10px] tracking-[0.25em] uppercase block mb-3">
              N E W &nbsp; & &nbsp; L I M I T E D &nbsp; P E R I O D &nbsp; P L A N
            </span>
            <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
              Special offers for comprehensive funeral service packages
            </p>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <motion.div variants={staggerItem}>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-6 text-[10px] tracking-[0.15em] h-10">
                  FUNERAL SERVICE PLAN
                </Button>
              </motion.div>
              <motion.div variants={staggerItem}>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-6 text-[10px] tracking-[0.15em] h-10">
                  NIRVANA LIFE PLAN
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Guide Section - Blue Background */}
      <section className="py-16 md:py-20 bg-primary overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left - Guide Card */}
              <motion.div {...fadeInLeft} className="bg-white/10 backdrop-blur-sm p-6 md:p-8">
                <h2 className="font-display text-xl md:text-2xl text-white italic mb-5">
                  Guide to choosing a bereavement care provider
                </h2>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  A detailed guide to help you choose the right bereavement care provider 
                  that suits your family's needs and budget.
                </p>
                <motion.ul 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-3 mb-6"
                >
                  {[
                    "Criteria for evaluating service quality",
                    "Comparison of popular service packages",
                    "Questions to ask during consultation"
                  ].map((item, i) => (
                    <motion.li key={i} variants={staggerItem} className="flex items-start gap-2 text-white/80 text-sm">
                      <ChevronRight className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-white text-primary hover:bg-white/90 px-6 text-[10px] tracking-[0.15em] h-10">
                    DOWNLOAD GUIDE
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right - Images Grid */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-3"
              >
                {[familyHugImage, family1Image, family2Image, family3Image].map((img, i) => (
                  <motion.img 
                    key={i}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05 }}
                    src={img} 
                    alt={`Guide ${i + 1}`} 
                    className="w-full h-32 md:h-40 object-cover" 
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FuneralService;
