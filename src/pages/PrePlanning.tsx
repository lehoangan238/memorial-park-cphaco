import { Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const PrePlanning = () => {
  const forYourselfBenefits = [
    'You assume financial responsibility of your own funeral',
    'You will have time and space to consider all factors and concerns',
    'You can be self-reliant and choose the way you wish to be celebrated',
    'You get the option of paying over time through an installment plan',
    'You will be able to enjoy greater peace of mind'
  ];

  const forFamilyBenefits = [
    'Your family will know who to contact in the event of an emergency',
    'Your family will not be pressured into making hasty decisions',
    'Your family can focus on remembering and healing',
    'Your family can avoid being suddenly forced to spend a huge amount',
    'Your family is protected from rising funeral costs due to inflation'
  ];

  const linkCards = [
    { title: 'How does pre-planning work?', subtitle: 'Learn the process' },
    { title: 'Why is pre-planning important?', subtitle: 'Understand the benefits' },
    { title: 'What is Nirvana Life Plan?', subtitle: 'Explore our services' }
  ];

  const guideSteps = [
    'Research and compare bereavement care providers',
    'Assess your budget and payment options',
    'Consider key options for different methods for memorialisation',
    'Decide on how you would like to be laid to rest',
    'Consider appointing an Executor',
    'Ensure you have made arrangements for your other needs'
  ];

  const resources = [
    { title: 'Nirvana Life Plan comparison', color: 'bg-slate-300' },
    { title: 'Nirvana Memorial Park Burial Plot', color: 'bg-blue-400' },
    { title: 'Know more about Columbaria', color: 'bg-slate-400' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Sky/Cloud Background */}
      <section className="relative min-h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=600&fit=crop"
            alt="Sky background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1e2a4a]/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4 pt-16">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl italic font-light tracking-wide">
            Pre-Planning
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-4 italic">
            I believe in people and loves
          </p>
        </div>
      </section>

      {/* Section 2: Pre-planning Intro - Text Left, Image Right */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl text-slate-800 font-light mb-6">
                Pre-planning
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                We prepare for almost everything in life. To cover for the possibility of 
                accidents and sickness, we have insurance. To get married, couples 
                spend months to years to ensure everything goes right. To safeguard our 
                children's future education, we start an education fund.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                To live life to the fullest, we have bucket lists. But hold up, are we 
                forgetting something here?
              </p>
              <a href="#" className="text-slate-400 text-xs uppercase tracking-wider hover:text-blue-500 transition-colors cursor-pointer">
                Read More →
              </a>
            </div>

            {/* Right: Image */}
            <div>
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=450&fit=crop"
                alt="Happy couple"
                className="w-full aspect-[4/3] object-cover shadow-lg"
              />
              
              {/* What is Pre-planning? - Below image */}
              <div className="mt-10">
                <h3 className="text-xl md:text-2xl text-slate-800 font-light mb-4">
                  What is Pre-planning?
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  To put it simply, pre-planning means setting up your funeral arrangements 
                  in advance before the need for these services occurs, either as a funeral 
                  insurance or pre-need funeral contract.
                </p>
                <a href="#" className="text-slate-400 text-xs uppercase tracking-wider hover:text-blue-500 transition-colors cursor-pointer">
                  Read More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: 5 main advantages of pre-planning */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-serif text-3xl md:text-4xl text-[#3b82f6] italic mb-12">
            5 main advantages<br />of pre-planning
          </h2>

          {/* For Yourself */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">
            <div>
              <h3 className="font-serif text-2xl text-slate-700 italic mb-6">For Yourself</h3>
              <div className="relative pl-6 border-l-2 border-[#3b82f6]">
                <div className="space-y-4">
                  {forYourselfBenefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <p className="text-[#3b82f6] text-sm leading-relaxed flex-1">{benefit}</p>
                      <span className="w-2 h-2 rounded-full bg-[#3b82f6] mt-1.5 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=450&fit=crop"
                alt="Happy family"
                className="w-full aspect-[4/3] object-cover shadow-lg"
              />
            </div>
          </div>

          {/* For Your Family */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=450&fit=crop"
                alt="Family together"
                className="w-full aspect-[4/3] object-cover shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="font-serif text-2xl text-slate-700 italic mb-6">For Your Family</h3>
              <div className="relative pl-6 border-l-2 border-[#3b82f6]">
                <div className="space-y-4">
                  {forFamilyBenefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <p className="text-[#3b82f6] text-sm leading-relaxed flex-1">{benefit}</p>
                      <span className="w-2 h-2 rounded-full bg-[#3b82f6] mt-1.5 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Three Link Cards - Dark Navy Background */}
      <section className="relative py-20 bg-[#1e2a4a] overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=800&fit=crop"
            alt="Mountain landscape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative">
          {/* Center Badge */}
          <div className="flex justify-center mb-16">
            <div className="w-40 h-40 bg-[#3b82f6] flex flex-col items-center justify-center text-white">
              <p className="text-[10px] tracking-[0.3em] uppercase mb-2">READ</p>
              <p className="text-sm tracking-wider">Pre-Planning</p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {linkCards.map((card, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="bg-white p-1 shadow-xl">
                  <div className="aspect-[4/3] bg-slate-200 overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-${idx === 0 ? '1511895426328-dc8714191300' : idx === 1 ? '1609220136736-443140cffec6' : '1529156069898-49953e39b3ac'}?w=400&h=300&fit=crop`}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <p className="mt-4 text-white text-sm font-medium">{card.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: 6 Steps Guide */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Text + Image */}
            <div>
              <h2 className="text-2xl md:text-3xl text-slate-800 font-light mb-6">
                6 steps guide to pre-planning
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Pre-planning involves thinking about your preferences in case of
                death and what happens after. This guide will take you through the
                steps of pre-planning and help you understand the key decisions
                involved.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                A good place to start is to research and compare bereavement care 
                providers. Having a pre-plan in place gives you and family peace, and
                eases the emotional stress that often accompanies making decisions.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&h=400&fit=crop"
                alt="Family planning together"
                className="w-full aspect-[16/10] object-cover shadow-lg"
              />
            </div>

            {/* Right: Steps list */}
            <div>
              <div className="space-y-0">
                {guideSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-200 group cursor-pointer hover:bg-slate-50 transition-colors">
                    <span className="text-slate-600 text-sm pr-4">{step}</span>
                    <div className="w-8 h-8 rounded-full border border-[#3b82f6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#3b82f6] transition-colors">
                      <Plus className="w-4 h-4 text-[#3b82f6] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Additional Resources */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-slate-400 text-xs tracking-[0.2em] uppercase mb-2">READ MORE</p>
            <h2 className="text-3xl text-slate-700 font-light">Additional Resources</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className={`relative aspect-[4/3] ${item.color} flex items-center justify-center p-6 transition-all group-hover:opacity-90`}>
                  <h3 className="text-white text-center text-base font-medium leading-snug">{item.title}</h3>
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

export default PrePlanning;
