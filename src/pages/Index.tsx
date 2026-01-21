import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CultureSection } from '@/components/CultureSection';
import { CaringSection } from '@/components/CaringSection';
import { ThreeImageSection } from '@/components/ThreeImageSection';
import { NatureVideoSection } from '@/components/NatureVideoSection';
import { ProductsSection } from '@/components/ProductsSection';
import { AerialViewSection } from '@/components/AerialViewSection';
import { AdvantagesSection } from '@/components/AdvantagesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Hero />
        <CultureSection />
        <CaringSection />
        <ThreeImageSection />
        <NatureVideoSection />
        <ProductsSection />
        <AerialViewSection />
        <AdvantagesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
