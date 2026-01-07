import { Header } from '@/components/Header';
import { CarelineBar } from '@/components/CarelineBar';
import { Hero } from '@/components/Hero';
import { CultureSection } from '@/components/CultureSection';
import { CaringSection } from '@/components/CaringSection';
import { VideoSection } from '@/components/VideoSection';
import { ProductsSection } from '@/components/ProductsSection';
import { VideoSection2 } from '@/components/VideoSection2';
import { AdvantagesSection } from '@/components/AdvantagesSection';
import { QuoteSection } from '@/components/QuoteSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Hero />
        <CarelineBar />
        <CultureSection />
        <CaringSection />
        <VideoSection />
        <ProductsSection />
        <VideoSection2 />
        <AdvantagesSection />
        <QuoteSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
