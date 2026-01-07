import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Advantages } from '@/components/Advantages';
import { Products } from '@/components/Products';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Advantages />
      <Products />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
