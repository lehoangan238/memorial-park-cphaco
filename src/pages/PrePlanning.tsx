import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Import images
import familyHugImage from "@/assets/family-hug.jpg";
import family1Image from "@/assets/family-1.jpg";
import family2Image from "@/assets/family-2.jpg";
import family3Image from "@/assets/family-3.jpg";
import familyGenerationsImage from "@/assets/family-generations.jpg";
import coupleBeachImage from "@/assets/couple-beach.jpg";
import columbariumImage from "@/assets/columbarium.jpg";
import landscapeImage from "@/assets/landscape.jpg";
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

const forYourselfBenefits = [
  "You assume financial responsibility of your own funeral",
  "You will have time and space to consider all factors and concerns",
  "You can be self-reliant and choose the way you wish to be celebrated and remembered",
  "You get the option of paying over time through an installment plan",
  "You will be able to enjoy greater peace of mind and complete financial planning"
];

const forFamilyBenefits = [
  "Your family will know who to contact in the event of an emergency",
  "Your family will not be pressured into making hasty decisions",
  "Your family can focus on remembering and healing",
  "Your family can avoid being suddenly forced to spend a huge amount to finance a funeral",
  "Your family is protected from rising funeral costs due to inflation"
];

const linkCards = [
  { title: "How does pre-planning work?", image: family1Image },
  { title: "Why is pre-planning important?", image: family2Image },
  { title: "What is Nirvana Life Plan?", image: family3Image }
];

const guideSteps = [
  "Research and compare bereavement care providers",
  "Assess your budget and payment options",
  "Consider key options for different methods for memorialisation",
  "Decide on how you would like to be laid to rest",
  "Consider appointing an Executor even",
  "Ensure you have made arrangements for your other arrangements"
];

const resources = [
  { title: "Nirvana Life Plan comparison", image: columbariumImage },
  { title: "Nirvana Memorial Park Burial Plot", image: landscapeImage },
  { title: "Know more about Columbaria", image: family1Image }
];

const PrePlanning = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Sky/Cloud Background */}
      <section className="relative h-[35vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="absolute inset-0 bg-[#1e2a4a]/40" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="font-display text-4xl md:text-5xl lg:text-6xl italic"
          >
            Pre-Planning
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
            className="text-white/80 text-sm md:text-base mt-4 italic"
          >
            I believe in people and loves
          </motion.p>
        </div>
      </section>

      {/* Section 2: Pre-planning Intro */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Text Content */}
            <motion.div {...fadeInLeft}>
              <h2 className="text-3xl md:text-4xl text-foreground font-light mb-6">
                Pre-planning
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                We prepare for almost everything in life. To cover for the possibility of 
                accidents and sickness, we have insurance. To get married, couples 
                spend months to years to ensure everything goes right. To safeguard our 
                children&apos;s future education, we start an education fund. To live life to the 
                fullest, we have bucket lists. But hold up, are we forgetting something 
                here?
              </p>
              <a href="#" className="text-muted-foreground text-xs flex items-center gap-1 hover:text-primary uppercase tracking-wider">
                READ MORE
              </a>
            </motion.div>

            {/* Right: Image */}
            <motion.div {...fadeInRight}>
              <img 
                src={coupleBeachImage} 
                alt="Person with balloons" 
                className="w-full aspect-[4/3] object-cover"
              />
            </motion.div>
          </div>

          {/* What is Pre-planning? - Right aligned */}
          <motion.div {...fadeInUp} className="mt-20 lg:ml-auto lg:w-1/2 lg:pl-8">
            <h3 className="text-2xl md:text-3xl text-foreground font-light mb-4">
              What is Pre-planning ?
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              To put it simply, pre-planning (sometimes also called &quot;pre-arrangement&quot;, 
              &quot;pre-arrangement planning&quot; or &quot;pre-need planning&quot;) means setting up 
              your funeral arrangements in advance before the need for these services 
              occurs, either as a funeral insurance or pre-need funeral contract. The 
              concept may seem novel and even morbid. However, pre-planning is not 
              actually something new.
            </p>
            <a href="#" className="text-muted-foreground text-xs flex items-center gap-1 hover:text-primary uppercase tracking-wider">
              READ MORE <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Section 3: 5 main advantages - Blue Header + Stacked Layout */}
      <section className="relative bg-background">
        <div className="absolute inset-x-0 top-0 h-[240px] bg-primary" />

        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative pt-12 pb-16">
          {/* Title (left) + Image (right spans into For Yourself) */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <motion.div {...fadeInLeft}>
              <h2 className="font-display text-3xl md:text-4xl text-primary-foreground">
                5 main advantages<br />
                of pre-planning
              </h2>
            </motion.div>

            <motion.div {...fadeInRight} className="lg:row-span-2">
              <div className="bg-background p-2 shadow-lg">
                <img
                  src={familyHugImage}
                  alt="Family support"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </motion.div>

            <motion.div {...fadeInLeft} className="pt-2">
              <h3 className="text-foreground text-xl font-light mb-6">For Yourself</h3>

              <div className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />

                <div className="space-y-4">
                  {forYourselfBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start justify-between gap-6">
                      <p className="text-primary text-sm leading-relaxed">{benefit}</p>
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* For Your Family row */}
          <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <motion.div {...fadeInLeft}>
              <div className="bg-background p-2 shadow-lg">
                <img
                  src={family1Image}
                  alt="Family together"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </motion.div>

            <motion.div {...fadeInRight} className="pt-2">
              <h3 className="text-foreground text-xl font-light mb-6">For Your Family</h3>

              <div className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />

                <div className="space-y-4">
                  {forFamilyBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start justify-between gap-6">
                      <p className="text-primary text-sm leading-relaxed">{benefit}</p>
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Small blue divider like the reference */}
          <div className="mt-12 flex justify-center">
            <div className="h-3 w-28 bg-primary" />
          </div>
        </div>
      </section>

      {/* Section 5: Three Link Cards - Dark Background with Center Badge */}
      <section className="relative overflow-hidden">
        {/* Mountain/photo background + dark overlay (like reference) */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(to bottom, hsl(var(--dark-bg) / 0.55), hsl(var(--dark-bg) / 0.9)), url(${landscapeImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative py-16 md:py-20">
          {/* Center badge - inline flow so it stays centered */}
          <div className="flex justify-center mb-16 md:mb-20">
            <motion.div
              {...fadeInUp}
              className="w-52 h-52 md:w-56 md:h-56 bg-primary text-primary-foreground flex flex-col items-center justify-center text-center"
            >
              <p className="text-[11px] tracking-[0.5em] uppercase font-medium mb-3">R E A D</p>
              <p className="text-base md:text-lg tracking-[0.15em] font-light">Pre-Planning</p>
            </motion.div>
          </div>

          {/* Cards */}
          <motion.div
            {...fadeInUp}
            className="mx-auto max-w-5xl grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {linkCards.map((card, index) => (
              <div key={index} className="group cursor-pointer flex flex-col items-start">
                <div className="bg-background p-1 shadow-2xl w-full">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                <p className="mt-5 text-primary-foreground text-sm md:text-[15px] font-normal leading-relaxed">
                  {card.title}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 6: 6 Steps Guide */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          {/* Small top divider */}
          <div className="flex justify-center mb-12">
            <div className="h-2 w-24 bg-primary" />
          </div>

          <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-10 lg:gap-16 items-start">
            {/* Left: Text + Image */}
            <motion.div {...fadeInLeft}>
              <h2 className="text-2xl md:text-3xl text-foreground font-light mb-6">
                6 steps guide to pre-planning
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Pre-planning involves thinking about your preferences in case of
                death and what happens after. This guide will take you through the
                steps of pre-planning and help you understand the key decisions
                involved. A good place to start is to research and compare
                bereavement care providers.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Having a pre-plan in place. This gives you and family peace, and
                eases the emotional stress that often accompanies making
                decisions about a loved one. Decide on the type of services you
                prefer. Customise, Who to invite, what theyll wear, how you want
                to be remembered.
              </p>
              <img
                src={family2Image}
                alt="Family planning"
                loading="lazy"
                className="w-full aspect-[16/10] object-cover"
              />
            </motion.div>

            {/* Vertical divider */}
            <div className="hidden lg:block w-px bg-border self-stretch" aria-hidden="true" />

            {/* Right: Steps list (+) */}
            <motion.div {...fadeInRight}>
              <div className="space-y-0">
                {guideSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-border"
                  >
                    <span className="text-foreground text-sm pr-6">{step}</span>
                    <div className="w-7 h-7 rounded-full border border-primary flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 7: Additional Resources - Dark Background */}
      <section className="relative py-20 md:py-28 bg-[hsl(var(--dark-bg))] overflow-hidden">
        {/* Subtle decorative texture */}
        <div className="absolute inset-0 swirl-pattern opacity-30" aria-hidden="true" />

        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative">
          {/* Center heading */}
          <motion.div {...fadeInUp} className="text-center mb-14">
            <span className="text-primary text-[10px] tracking-[0.5em] uppercase font-medium">
              R E A D &nbsp; M O R E
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-4">
              Additional Resources
            </h2>
          </motion.div>

          {/* Cards with white frames */}
          <motion.div
            {...fadeInUp}
            className="grid md:grid-cols-3 gap-8 lg:gap-10"
          >
            {resources.map((resource, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white p-2 shadow-xl">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <p className="mt-4 text-white text-sm font-medium leading-tight">
                  {resource.title}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrePlanning;
