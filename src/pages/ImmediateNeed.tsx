import { useState } from 'react';
import { Phone, FileText, Users, MapPin, Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const ImmediateNeed = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const steps = [
    { icon: Phone, step: 'Step 1', title: 'Engage a funeral agency or call our hotline', desc: 'Contact us immediately for compassionate guidance' },
    { icon: FileText, step: 'Step 2', title: 'Reporting the death to the authorities', desc: 'We assist with all necessary documentation' },
    { icon: Users, step: 'Step 3', title: 'Embalming preparation', desc: 'Professional care with dignity and respect' },
    { icon: MapPin, step: 'Step 4', title: 'Consider the final resting place', desc: 'Explore meaningful memorial options' }
  ];

  const branches = [
    { region: 'Northern Region', locations: ['Penang', 'Kedah', 'Perlis', 'Perak'] },
    { region: 'East Coast Region', locations: ['Kelantan', 'Terengganu', 'Pahang'] },
    { region: 'Central Region', locations: ['Kuala Lumpur', 'Melaka', 'Selangor', 'Negeri Sembilan'] },
    { region: 'Southern Region', locations: ['Johor Bahru', 'Muar', 'Kluang', 'Batu Pahat', 'Kulai'] },
    { region: 'International', locations: ['Singapore', 'Indonesia', 'Thailand'] }
  ];

  const faqItems = [
    'Report the death',
    'Register the death to obtain the Death Certificate',
    'Arrange the funeral with a bereavement care provider'
  ];

  const resources = [
    { title: 'FAQ, Contact, Questions', color: 'bg-slate-400/90' },
    { title: 'Nirvana Memorial Park Rental Plot', color: 'bg-blue-500/90' },
    { title: 'Know more about Columbarium', color: 'bg-slate-500/90' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Dark Navy with Hands Image */}
      <section className="relative min-h-[520px] flex items-center justify-center bg-[#0f1729] overflow-hidden">
        {/* Background image - hands holding light */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=1920&h=1080&fit=crop"
            alt="Hands holding light"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1729]/70 via-[#0f1729]/60 to-[#0f1729]/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-16">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white font-light mb-4 tracking-wide italic">
            Immediate Need
          </h1>
          <p className="text-white/70 text-base md:text-lg mb-8 italic">
            We are ready to assist 24/7
          </p>
          <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 text-sm font-medium tracking-wider transition-colors cursor-pointer uppercase">
            Call Careline: 1800-88-1338
          </button>
        </div>
      </section>

      {/* Steps Section - What to do when someone passes away */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-[#3b82f6] font-light mb-4">
              What to do when<br />someone passes away
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              Our team will guide you every step of the way. We'll be here to support you throughout the process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6]/5 transition-all cursor-pointer">
                  <item.icon className="w-7 h-7 text-slate-400 group-hover:text-[#3b82f6] transition-colors" strokeWidth={1.5} />
                </div>
                <p className="text-[#3b82f6] text-xs font-medium tracking-wider uppercase mb-2">{item.step}</p>
                <h3 className="text-slate-700 text-sm font-medium mb-2 leading-snug">{item.title}</h3>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section - Navy Background */}
      <section className="py-16 bg-[#1e3a5f]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-white/60 text-xs tracking-[0.2em] uppercase mb-2">CONTACT US</p>
            <h2 className="text-3xl text-white font-light">Our Branches</h2>
          </div>

          <div className="space-y-3">
            {branches.map((branch, idx) => (
              <div key={idx} className="bg-[#2a4a6f] hover:bg-[#345580] transition-colors cursor-pointer">
                <div className="px-6 py-4 flex flex-wrap items-center gap-2">
                  <span className="text-white font-medium text-sm mr-2">{branch.region}:</span>
                  {branch.locations.map((loc, i) => (
                    <span key={i} className="text-white/70 text-sm">
                      {loc}{i < branch.locations.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message Form Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-slate-400 text-xs tracking-[0.2em] uppercase mb-8">MESSAGE US</p>

          <div className="bg-white p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
            <div className="mb-6">
              <textarea
                name="message"
                placeholder="Your Message *"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-[#3b82f6] transition-colors resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-10 py-3 text-sm font-medium tracking-wider transition-colors cursor-pointer">
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Image + Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-slate-400 text-xs tracking-[0.2em] uppercase mb-2">R.S.V.P</p>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start mt-8">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl text-slate-700 font-light mb-6 leading-tight">
                When a loved one<br />passes away
              </h2>
              <div className="text-slate-500 text-sm leading-relaxed space-y-4 mb-8">
                <p>
                  Losing a loved one is an incredibly painful experience. When someone passes away, there are numerous tasks that need to be handled—such as caring for the deceased, managing funeral arrangements, and organizing personal affairs.
                </p>
                <p>
                  We can assist you at every step and guide you through this difficult time. Our dedicated team can help plan and guide you in making important decisions.
                </p>
              </div>

              {/* What to do immediately box */}
              <div className="bg-slate-100 p-6 mb-8">
                <h3 className="text-slate-700 font-medium mb-4">What to do when someone dies</h3>
                <div className="space-y-3">
                  {faqItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between py-3 px-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <span className="text-slate-600 text-sm">{item}</span>
                      <Plus className="w-5 h-5 text-[#3b82f6]" />
                    </button>
                  ))}
                </div>
              </div>

              <button className="border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white px-8 py-3 text-sm font-medium tracking-wider transition-colors cursor-pointer">
                PRE-PLANNING
              </button>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-slate-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=750&fit=crop" 
                  alt="Hands together in support"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-slate-400 text-xs tracking-[0.2em] uppercase mb-2">NEXT STEPS</p>
          <h2 className="text-3xl text-slate-700 font-light mb-12">Additional Resources</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className={`relative aspect-[4/3] ${item.color} flex items-center justify-center p-6 transition-all group-hover:opacity-90`}>
                  <h3 className="text-white text-center text-lg font-medium leading-snug">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ImmediateNeed;
