import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { setLenisInstance } from '@/lib/lenis';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HeroParallaxSection from '@/components/HeroParallaxSection';
import ProductShowcase from '@/components/ProductShowcase';
import Footer from '@/components/Footer';
import { useTextReveal } from '@/hooks/useTextReveal';
import OpeningPage from '@/components/OpeningPage';
import AnimatedContent from '@/components/AnimatedContent';
import { ShopProvider, useShop } from '@/context/ShopContext';
import ProductDetailPage from '@/components/ProductDetailPage';
import { CartDrawer } from '@/components/CartDrawer';
import { TourGuideChat } from '@/components/TourGuideChat';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={0.9}
          ease="power3.out"
          delay={0.1}
        >
          <Hero />
        </AnimatedContent>
        <HeroParallaxSection />
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={0.9}
          ease="power3.out"
          threshold={0.1}
        >
          <ProductShowcase />
        </AnimatedContent>
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={0.9}
          ease="power3.out"
          threshold={0.1}
        >
          <Footer />
        </AnimatedContent>
      </main>
    </div>
  );
}

function MainAppContent() {
  const { currentPath } = useShop();
  const isProductPage = currentPath.startsWith('/product/');

  useTextReveal();

  return isProductPage ? <ProductDetailPage /> : <HomePage />;
}

function AppContent() {
  const [showOpening, setShowOpening] = useState(true);

  if (showOpening) {
    return (
      <AnimatedContent
        key="opening-page"
        distance={120}
        direction="vertical"
        duration={1.0}
        ease="power3.out"
      >
        <OpeningPage onEnter={() => setShowOpening(false)} />
      </AnimatedContent>
    );
  }

  return (
    <>
      <CartDrawer />
      <AnimatedContent
        key="main-app-page"
        distance={120}
        direction="vertical"
        duration={1.0}
        ease="power3.out"
      >
        <MainAppContent />
      </AnimatedContent>
      <TourGuideChat />
    </>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    setLenisInstance(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

export default App;
