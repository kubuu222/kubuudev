import { Navbar } from '@/components/site/Navbar';
import { Hero } from '@/components/site/Hero';
import { Specializations } from '@/components/site/Specializations';
import { Portfolio } from '@/components/site/Portfolio';
import { Pricing } from '@/components/site/Pricing';
import { Process } from '@/components/site/Process';
import { Contact } from '@/components/site/Contact';
import { Footer } from '@/components/site/Footer';
import { ShopSection } from '@/components/site/ShopSection';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Specializations />
        <Portfolio />
        <ShopSection />
        <Pricing />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
