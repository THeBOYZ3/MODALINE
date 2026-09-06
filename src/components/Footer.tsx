import { Facebook, Instagram, Mail, ArrowRight } from 'lucide-react';
import { handleSmoothScroll } from '@/lib/lenis';
import { useShop } from '@/context/ShopContext';
import BlurText from './BlurText';

function Footer() {
  const { currentPath, navigate } = useShop();
  const isProductPage = currentPath.startsWith('/product/');

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (isProductPage) {
      navigate('/');
      setTimeout(() => {
        handleSmoothScroll(e, href);
      }, 100);
    } else {
      handleSmoothScroll(e, href);
    }
  };

  return (
    <>
      {/* Mission section */}
      <section
        id="mission"
        className="relative w-full overflow-hidden bg-[#0CC0DF] py-20 sm:py-28"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-royal/15 blur-2xl" />
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-royal-light/10" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8 flex flex-col items-center">
          <BlurText
            text="Our Mission"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-sm font-semibold uppercase tracking-widest text-royal-light"
          />
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tightest text-white sm:text-4xl md:text-5xl">
            Comfort for Everyone.
            <br />
            Quality You Can Trust.
          </h2>
          <BlurText
            text="Modaline is built on a simple idea: everyone deserves stylish, comfortable, and affordable clothing. Made with a Plain Cotton-Polyester T-Shirt, our apparel delivers everyday comfort, lasting durability, and timeless style—so you can wear confidence every day."
            delay={80}
            animateBy="words"
            direction="top"
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg justify-center"
          />
          <a
            href="#shop"
            onClick={(e) => handleNavClick(e, '#shop')}
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy transition-all duration-300 hover:gap-3.5 hover:bg-royal hover:text-white"
          >
            Shop the Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer
        id="contact"
        className="relative w-full bg-black py-16"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Brand */}
            <div>
              <span className="text-2xl font-extrabold tracking-tightest text-white">
                Moda<span className="text-royal-light">line</span>
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
                Quality everyday apparel designed for comfort, durability, and
                lasting value.
              </p>
              <div className="mt-6 flex items-center gap-3">
                {[
                  { Icon: Facebook, name: 'Facebook', id: 'footer-social-fb' },
                  { Icon: Instagram, name: 'Instagram', id: 'footer-social-instagram' },
                ].map(({ Icon, name, id }) => (
                  <a
                    key={name}
                    id={id}
                    href="#"
                    onClick={(e) => handleNavClick(e, '#home')}
                    aria-label={name}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-300 hover:bg-royal hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
