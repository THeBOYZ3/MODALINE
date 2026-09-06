import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import ScrollFloat from './ScrollFloat';
import BlurText from './BlurText';
import { Magnetic } from '@/components/core/magnetic';
import { useShop } from '@/context/ShopContext';

type ColorOption = {
  name: string;
  value: string;
  image: string;
};

const COLORS: ColorOption[] = [
  { name: 'Black', value: '#0a0a0a', image: '/images/products/black.png' },
  { name: 'White', value: '#f8f8f8', image: '/images/products/white.png' },
  { name: 'Navy Blue', value: '#0a1628', image: '/images/products/navy_blue.png' },
  { name: 'Royal Blue', value: '#0550c6', image: '/images/products/Blue.png' },
];

function ProductShowcase() {
  const [active, setActive] = useState(0);
  const { navigate } = useShop();
  const activeColor = COLORS[active];

  return (
    <section
      id="shop"
      className="relative w-full overflow-hidden bg-white py-20 sm:py-28"
    >
      {/* Section logo */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.02}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tightest text-navy font-montserrat"
        >
          Moda<span className="text-[#0CC0DF]">line</span>
        </ScrollFloat>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-8">
        {/* Stacked card visual */}
        <div className="relative flex h-80 items-center justify-center sm:h-96 lg:h-[32rem]">
          {/* Background card layers */}
          <div className="absolute h-64 w-52 rotate-[-9deg] rounded-3xl bg-navy/5 sm:h-80 sm:w-64" />
          <div className="absolute h-64 w-52 rotate-[-4deg] rounded-3xl bg-royal/8 sm:h-80 sm:w-64" />

          {/* Active product card */}
          <div
            key={active}
            className="relative flex h-72 w-48 items-center justify-center rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(5,80,198,0.35)] transition-all duration-500 sm:h-88 sm:w-60 lg:h-96 lg:w-72"
          >
            <img
              src={activeColor.image}
              alt={`${activeColor.name} t-shirt`}
              className="w-full rounded-3xl object-contain p-3"
              style={{
                animation: 'fadeScale 0.5s ease',
              }}
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy/70">
              {activeColor.name}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center lg:items-start">
          <BlurText
            text="Modaline Essentials"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-sm font-semibold uppercase tracking-widest text-royal"
          />
          <h2 className="mt-3 text-3xl font-extrabold tracking-tightest text-navy sm:text-4xl" data-copy>
            Pick your color.
          </h2>
          <p className="mt-3 max-w-md text-center text-base text-navy/60 lg:text-left font-montserrat" data-copy>
            Made from a Plain Cotton-Polyester T-Shirt. Soft, durable, and designed for all-day comfort and everyday wear.
          </p>

          {/* Color swatches */}
          <div className="mt-8 flex items-center gap-4">
            {COLORS.map((color, i) => (
              <button
                key={color.name}
                aria-label={color.name}
                onClick={() => setActive(i)}
                className={`relative h-9 w-9 rounded-full transition-all duration-300 ${
                  active === i
                    ? 'ring-2 ring-royal ring-offset-2 ring-offset-white'
                    : 'ring-1 ring-navy/10 hover:ring-2 hover:ring-navy/20'
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>

          {/* Pagination dots */}
          <div className="mt-6 flex items-center gap-2">
            {COLORS.map((color, i) => (
              <button
                key={color.name}
                aria-label={`Go to ${color.name}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? 'w-6 bg-royal' : 'w-2 bg-navy/20 hover:bg-navy/40'
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-9">
            <Magnetic>
              <motion.button
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  scale: 1.04,
                  backgroundColor: '#12d1f0',
                  boxShadow: '0 16px 32px -4px rgba(12, 192, 223, 0.45)',
                  transition: { duration: 0.2, ease: 'easeOut' },
                }}
                whileTap={{
                  scale: 0.96,
                  transition: { duration: 0.12, ease: 'easeOut' },
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-[#0CC0DF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#0CC0DF]/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0CC0DF]/40 focus-visible:ring-offset-2"
                onClick={() => navigate('/product/essential-tee', { colorIndex: active })}
              >
                ORDER NOW
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            </Magnetic>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

export default ProductShowcase;
