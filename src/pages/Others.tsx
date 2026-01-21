import { ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const Others = () => {

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Lavender Background */}
      <section className="relative min-h-[350px] md:min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100" />
        <div className="absolute inset-0 bg-white/20" />
        <div className="relative z-10 text-center px-4 pt-16">
          <h1 className="font-serif text-4xl md:text-5xl text-slate-700 font-light">
            Other Products
          </h1>
          <p className="text-slate-500 text-sm mt-3">
            Find the perfect tribute for your loved
          </p>
        </div>
      </section>

      {/* Ancestral Tablet Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Image with decorative frame */}
            <div className="relative pb-16">
              {/* Main image */}
              <div className="relative z-10">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Ancestral Tablet</span>
                </div>
              </div>
              
              {/* Blue L-shaped frame - right and bottom, extending beyond image */}
              <div className="absolute top-[10%] -right-8 bottom-0 left-[10%] border border-[#5b7cfa]">
                {/* Caption inside frame */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="font-serif text-xl text-slate-600 italic">Ancestral Tablet</p>
                </div>
              </div>
            </div>

            {/* Right - Content + Image */}
            <div>
              <h2 className="font-serif text-2xl text-[#5b7cfa] italic mb-4">
                Ancestral Tablet
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Ancestral worship in the form of ancestral tablets is a Chinese tradition that dates back to the ancient times. Ancestral tablets in the past usually take central position at the altar of traditional Chinese homes. It is a sacred item that is synonymous with the virtue of filial piety.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                The passage of time is changing the way we pay homage to our ancestors and families may not time or space to honour their ancestors at home. Nirvana offers the option of installing ancestral tablets at various memorial centers to preserve and promote the virtuous tradition of honouring our ancestors while accommodating modern lifestyles. At the same time, we offer thoughtfully-designed ancestral tablets that are installed in elegant and air-conditioned settings – surrounding sanctified altars dedicated to divinities and enlightened beings.
              </p>
              {/* Image with carousel dots */}
              <div className="mt-6">
                <div className="aspect-[16/10] bg-gradient-to-br from-cyan-900 to-cyan-800 flex items-center justify-center">
                  <span className="text-slate-300 text-sm">Tablet Hall</span>
                </div>
                {/* Carousel dots */}
                <div className="flex justify-center gap-1.5 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NV Seed Section */}
      <section className="py-16 bg-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left - Content */}
            <div>
              <h2 className="font-serif text-2xl text-[#5b7cfa] italic mb-4">
                NV Seed
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                The principles of Sheng Ji or "Living Tomb" involves the creation of a tomb for a living person in order to harness auspicious energies of an environment with excellent Feng Shui to remedy imperfections contained within the subject's destiny or Ba Zi.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                NV Seed takes advantage of the powerful Feng Shui dynamics found at Nirvana's various memorial parks which are endorsed by renowned masters for the purpose of installing Sheng Ji. By deploying this Feng Shui remedy, a person's life can be improved in various ways such as enhanced fortune, career, health, family relations and overall luck.
              </p>
            </div>

            {/* Right - Layered composition: Blue card with image overlapping on top-right */}
            <div className="relative h-[400px]">
              {/* Layer 1: Blue rectangular card - positioned bottom-left */}
              <div className="absolute left-0 bottom-0 w-[85%] h-[85%] bg-[#5b7cfa]">
                {/* NV Seed text in bottom-left corner of blue card */}
                <p className="absolute bottom-4 left-4 font-serif text-xl text-white">NV Seed</p>
              </div>
              
              {/* Layer 2: Square image - overlapping top-right of blue card */}
              <div className="absolute top-0 right-0 w-[75%] aspect-square bg-gradient-to-br from-green-200 via-green-300 to-sky-200 flex items-center justify-center shadow-lg">
                <span className="text-slate-500 text-sm">Memorial Park</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Benefits of Installing Sheng Ji Section */}
      <section className="py-16 bg-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Image with carousel */}
            <div>
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                <span className="text-slate-500 text-sm">Sheng Ji</span>
              </div>
              {/* Carousel dots */}
              <div className="flex justify-center gap-1.5 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#5b7cfa] mb-4">
                7 benefits of installing<br />Sheng Ji
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                The installation of Sheng Ji or "Living Tomb" has many benefits if done with proper care and consultation. The seven key benefits for installing Sheng Ji are:
              </p>
              
              {/* Benefits list */}
              <div className="space-y-0">
                {[
                  'Promoting longevity',
                  'Triggering positive energies',
                  'Changing destiny',
                  'Spurring career growth',
                  'Promoting fertility and wealth',
                  'Improving human relations and luck',
                  'Encouraging meritorious deeds'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-300">
                    <span className="text-slate-600 text-sm">{benefit}</span>
                    <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eternal Blessing Lights Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Image with blue L-shaped frame */}
            <div className="relative pb-16">
              {/* Main image */}
              <div className="relative z-10">
                <div className="aspect-square bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Blessing Lights</span>
                </div>
              </div>
              
              {/* Blue L-shaped frame - right and bottom, extending beyond image */}
              <div className="absolute top-[10%] -right-8 bottom-0 left-[10%] border border-[#5b7cfa]">
                {/* Caption inside frame */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="font-serif text-xl text-slate-600 italic">Eternal Blessing Lights</p>
                </div>
              </div>
            </div>

            {/* Right - Content + Image */}
            <div>
              <h2 className="font-serif text-2xl text-[#5b7cfa] italic mb-4">
                Eternal Blessing Lights
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                The traditional Buddhist practice of offering lamps symbolises dispelling the darkness of ignorance and attainment of enlightenment by the Buddha. It also carries the aspiration to attain liberation from suffering and the cultivation of merit through good deeds.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Because of its association with good fortune, this meritorious practice is encouraged and translated through Nirvana's Eternal Blessing Lights. The traditional oil lamps are updated to exquisite crystal lamps in the form of Buddhas, Bodhisattvas and artificial candles emitting soft light for dedication to enlightened beings. The gift of light and prayers whether during difficult times or as a meritorious practice, help bring greater happiness in times of illness and loss while at the same improving family dynamics, career, health and overall fortunes.
              </p>
              {/* Image with carousel dots */}
              <div>
                <div className="aspect-[16/10] bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Lights Hall</span>
                </div>
                {/* Carousel dots */}
                <div className="flex justify-center gap-1.5 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Navy */}
      <section className="py-16 bg-[#1a2744]">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#5b7cfa] px-4 py-2">
              <span className="text-white text-[10px] tracking-wider uppercase">WHAT'S NEXT</span>
            </div>
          </div>

          {/* Three Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="text-center">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-600 to-slate-700 mb-4 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Pre-planning</span>
              </div>
              <p className="text-white/70 text-xs mb-2">Plan ahead and ensure peace of mind</p>
              <p className="text-white text-sm">Pre-planning Services</p>
            </div>

            {/* Card 2 */}
            <div className="text-center">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-600 to-slate-700 mb-4 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Consultation</span>
              </div>
              <p className="text-white/70 text-xs mb-2">Get the help you need when you need it</p>
              <p className="text-white text-sm">Book a Consultation</p>
            </div>

            {/* Card 3 */}
              <div className="text-center">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-600 to-slate-700 mb-4 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Contact</span>
              </div>
              <p className="text-white/70 text-xs mb-2">We're here to help and answer questions</p>
              <p className="text-white text-sm">Contact Us</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Others;
