import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Users, Eye, Flame, MapPin, Heart, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Import images
import familyHugImage from "@/assets/family-hug.jpg";
import family1Image from "@/assets/family-1.jpg";
import family2Image from "@/assets/family-2.jpg";
import family3Image from "@/assets/family-3.jpg";
import columbariumImage from "@/assets/columbarium.jpg";
import landscapeImage from "@/assets/landscape.jpg";

// Animation
const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: easeOut }
};

const steps = [
  {
    icon: Phone,
    step: "Step 1",
    title: "Contact our agents or call our hotline",
    description: "Our team is on standby round the clock to assist you and provide guidance every step of the way. We are ready to help you through this difficult time."
  },
  {
    icon: Eye,
    step: "Step 2",
    title: "Viewing the Deceased",
    description: "Once a life has passed away, the family will need to view the deceased. Our team will handle the arrangements to ensure everything is done with dignity and respect."
  },
  {
    icon: Flame,
    step: "Step 3",
    title: "Burial or cremation",
    description: "Consider between the options of burial and cremation. Our team is here to guide the deceased's resting place based on cultural and religious preferences."
  },
  {
    icon: MapPin,
    step: "Step 4",
    title: "Complete the final resting place",
    description: "Upon selection of the final resting place, our team will handle arrangements such as engraving and installation to ensure everything is in place for the final farewell."
  },
  {
    icon: Heart,
    step: "Step 5",
    title: "Receive what matters",
    description: "Receiving urn or ashes for columbarium or scatter and other personal items. Finalizing any outstanding arrangements including legal matters."
  }
];

const branches = [
  {
    region: "Central Region",
    locations: "Kuala Lumpur, Seremban, Shah Alam, Klang, Subang"
  },
  {
    region: "Northern Region",
    locations: "Kepala Batas, Penang, Kulim, Bukit Mertajam, Sungai Petani"
  },
  {
    region: "Southern Region",
    locations: "Melaka, Johor, Johor Bahru, Muar, Kluang, Batu Pahat, Kulai, Senai, Pasir Gudang, Segamat, Yong Peng, Tangkak"
  },
  {
    region: "East Malaysia",
    locations: "Kota Kinabalu, Sabah, Sibu, Sarawak"
  },
  {
    region: "International",
    locations: "Singapore, Jakarta, Surabaya, Thailand"
  }
];

const todoSteps = [
  "Report the death",
  "Register the death to obtain the Death Certificate",
  "Arrange the funeral with a bereavement care provider"
];

const resources = [
  { title: "Eternal Garden Columbarium", image: columbariumImage },
  { title: "Nirvana Memorial Park Burial Plot", image: landscapeImage },
  { title: "Know more about Columbaria", image: family1Image }
];

const ImmediateNeed = () => {
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Dark Blue with Hands Image */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-[#1e2a4a]">
        {/* Background image overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${familyHugImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="font-display text-4xl md:text-5xl lg:text-6xl italic"
          >
            Immediate Need
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
            className="text-white/80 text-sm md:text-base mt-4"
          >
            We are ready to assist 24/7
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
            className="mt-6"
          >
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 text-xs tracking-wider">
              CALL CARELINE 1800-88-1818
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Section 2: What to do when someone passes away */}
      <section className="py-16 md:py-24 bg-white relative">
        {/* Curved top edge */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#1e2a4a] -translate-y-full" />
        <div 
          className="absolute -top-8 left-0 right-0 h-16 bg-white"
          style={{ borderRadius: "50% 50% 0 0" }}
        />
        
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              What to do when<br />
              someone passes away
            </h2>
            <p className="text-muted-foreground text-sm mt-4 max-w-xl mx-auto">
              Our little team can guide you through every step of the way. We 
              assist you every step of the way.
            </p>
          </motion.div>

          {/* 5 Steps */}
          <motion.div 
            {...fadeInUp}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4"
          >
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-primary text-xs font-medium mb-2">{step.step}</p>
                <h3 className="text-foreground text-sm font-medium mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 3: Our Branches */}
      <section className="py-16 md:py-20 bg-[#f5f5f5]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-medium">
              L O C A T I O N S
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-primary mt-4">
              Our Branches
            </h2>
          </motion.div>

          {/* Accordion Branches */}
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto space-y-3">
            {branches.map((branch, index) => (
              <div 
                key={index}
                className="bg-primary text-white overflow-hidden"
              >
                <button
                  onClick={() => setExpandedBranch(expandedBranch === index ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-primary/90 transition-colors"
                >
                  <span className="text-sm">{branch.region}: {branch.locations}</span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${
                      expandedBranch === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedBranch === index && (
                  <div className="px-5 pb-4 text-white/80 text-sm">
                    <p>Contact our branch for assistance.</p>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 4: Contact Form */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-medium">
              M E S S A G E &nbsp; U S
            </span>
          </motion.div>

          <motion.form {...fadeInUp} className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary"
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary"
              />
              <Input
                name="phone"
                placeholder="Contact No."
                value={formData.phone}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary"
              />
            </div>
            <Textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary min-h-[120px] mb-4"
            />
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 text-xs tracking-wider">
                SUBMIT
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Section 5: When a loved one passes away */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          {/* Decorative elements */}
          <motion.div {...fadeInUp} className="flex justify-center gap-4 mb-6">
            <span className="text-muted-foreground text-sm"># 8 &lt; 3 &gt;</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div {...fadeInUp}>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
                When a loved one passes away
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                It is hard to lose a loved one. When a loved one dies, there is a set 
                of procedures to follow such as taking care of the body, managing 
                the deceased, and putting your affairs in order. We can help 
                you through every step and guide you in managing this difficult 
                time of transition in your life.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                If an immediate need arises, those relatives beside you will have many 
                responsibilities to do in the short span of time. Our caring and 
                knowledgeable staff can help with planning and guide you to make 
                important decisions. We understand that you need to put your mind and 
                priorities in order. So rest assured your loved one will be taken care of
                with respect and dignity while you focus on spending time with family — 
                healing with your loved ones and gathering.
              </p>
              <p className="text-muted-foreground text-sm mb-6 italic">
                Are you concerned about planning?
              </p>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white text-xs tracking-wider"
              >
                I'M INTERESTED
              </Button>
            </motion.div>

            {/* Right: Image */}
            <motion.div {...fadeInUp}>
              <img 
                src={family2Image} 
                alt="Elderly couple" 
                className="w-full aspect-[4/3] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 6: What to do when someone dies */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
            <h3 className="font-display text-xl md:text-2xl text-primary text-center mb-8">
              What to do when someone dies
            </h3>
            
            <div className="space-y-0">
              {todoSteps.map((step, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-gray-200"
                >
                  <span className="text-foreground text-sm">{step}</span>
                  <div className="w-6 h-6 bg-primary flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 7: Additional Resources */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-medium">
              N E X T &nbsp; S T E P S
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-4">
              Additional Resources
            </h2>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            className="grid md:grid-cols-3 gap-6"
          >
            {resources.map((resource, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer overflow-hidden"
              >
                <img 
                  src={resource.image}
                  alt={resource.title}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/70 flex items-center justify-center p-6">
                  <p className="text-white text-center text-sm font-medium leading-relaxed">
                    {resource.title}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ImmediateNeed;
