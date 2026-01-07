import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CultureSection } from '@/components/CultureSection';
import { CaringSection } from '@/components/CaringSection';
import { VideoSection } from '@/components/VideoSection';
import { ProductsSection } from '@/components/ProductsSection';
import { AdvantagesSection } from '@/components/AdvantagesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <CultureSection />
      <CaringSection />
      <VideoSection />
      <ProductsSection />
      <AdvantagesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
