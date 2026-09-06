import { ArrowRight } from 'lucide-react';
import { handleSmoothScroll } from '@/lib/lenis';
import RotatingText from './RotatingText';

function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#0CC0DF]"
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[28rem] w-[28rem] rounded-full bg-royal/25 blur-2xl" />
        <div className="absolute right-40 top-24 h-40 w-40 rounded-full bg-royal-light/15" />
        <div className="absolute -left-10 top-1/3 h-64 w-64 rounded-full bg-royal/10" />
      </div>

      {/* 3-column layout */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-4 lg:py-24">
        {/* Left asset — blue thread ball */}
        <div className="order-2 flex justify-center lg:order-1 lg:justify-end">
          
        </div>

        {/* Center text */}
        <div className="order-1 max-w-2xl text-center lg:order-2 lg:px-6">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tightest text-white sm:text-5xl md:text-6xl lg:text-[4.2rem] flex flex-col items-center justify-center">
            <span data-copy data-copy-delay="0.2" data-copy-scroll="false">Modaline</span>
            <span className="relative flex items-center justify-center mt-2">
              <span className="invisible pointer-events-none">Comfortable</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <RotatingText
                  texts={['Affordable', 'Durable', 'Comfortable']}
                  mainClassName="text-white"
                  staggerFrom="last"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-120%", opacity: 0 }}
                  staggerDuration={0.005}
                  splitLevelClassName="overflow-hidden pb-1 md:pb-2"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                  splitBy="characters"
                />
              </span>
            </span>
          </h1>
          <p 
            data-copy 
            data-copy-delay="0.4" 
            data-copy-scroll="false"
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            At Modaline, we provide quality everyday apparel designed for
            comfort, durability, and lasting value—without stretching your
            budget.
          </p>
          <a
            href="#shop"
            onClick={(e) => handleSmoothScroll(e, '#shop')}
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy shadow-lg transition-all duration-300 hover:gap-3.5 hover:bg-navy hover:text-white"
          >
            Explore Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Right asset — stacked fan of t-shirts */}
        <div className="order-3 relative flex h-72 items-center justify-center lg:h-[28rem]">
          <img
            src="/images/products/Blue.png"
            alt="Blue t-shirt"
            className="absolute left-1/2 w-44 -translate-x-[60%] rotate-[-8deg] opacity-60 transition-all duration-500 sm:w-56 lg:w-64"
            loading="eager"
          />
          <img
            src="/images/products/white.png"
            alt="White t-shirt"
            className="absolute left-1/2 w-44 -translate-x-[40%] rotate-[4deg] opacity-80 transition-all duration-500 sm:w-56 lg:w-64"
            loading="eager"
          />
          <img
            src="/images/products/black.png"
            alt="Black t-shirt"
            className="absolute left-1/2 w-44 -translate-x-[20%] rotate-[10deg] opacity-95 drop-shadow-2xl transition-all duration-500 sm:w-56 lg:w-64"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
