import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { handleSmoothScroll } from "@/lib/lenis";
import SplitText from "@/components/SplitText";

export interface HeroParallaxProduct {
  title: string;
  link: string;
  thumbnail: string;
  category?: string;
  price?: string;
}

export const HeroParallax = ({
  products,
}: {
  products: HeroParallaxProduct[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 800]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -800]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 200]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-white text-slate-900"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 sm:space-x-20 mb-12 sm:mb-20">
          {firstRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title + idx}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-12 sm:mb-20 space-x-12 sm:space-x-20">
          {secondRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title + idx}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 sm:space-x-20">
          {thirdRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title + idx}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <div className="max-w-7xl relative mx-auto py-12 md:py-24 px-4 w-full left-0 top-0 z-20">
      <h1 className="text-3xl md:text-7xl font-extrabold tracking-tight text-slate-900 font-montserrat">
        <SplitText
          text="MODALINE"
          className="inline-block"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="left"
          tag="span"
          onLetterAnimationComplete={handleAnimationComplete}
        />
        <br />
        <span className="text-[#1F80FF]">
          <SplitText
            text="Apparel Gallery"
            className="inline-block"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
            tag="span"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-6 text-slate-600 leading-relaxed font-light">
        Everyday comfort meets lasting durability. Discover Modaline's collection of everyday essentials, crafted as a <strong className="font-semibold text-slate-800">Plain Cotton-Polyester T-Shirt</strong> for a comfortable feel and dependable durability. Designed with simple, versatile styles that are made for everyday wear.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 items-center">
        <a
          href="#shop"
          onClick={(e) => handleSmoothScroll(e, "#shop")}
          className="btn-uiverse-gagan"
        >
          Explore Shop
        </a>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: HeroParallaxProduct;
  translate: MotionValue<number>;
}) => {
  const isLifestyle = product.thumbnail.endsWith(".jpg") || product.thumbnail.endsWith(".jpeg");

  return (
    <motion.div
      style={{
        x: translate,
      }}
      key={product.title}
      className="group/product h-72 sm:h-96 w-[18rem] sm:w-[26rem] relative shrink-0 overflow-hidden bg-transparent"
    >
      <a
        href={product.link}
        onClick={(e) => {
          if (product.link.startsWith("#")) {
            handleSmoothScroll(e, product.link);
          }
        }}
        className="block h-full w-full"
      >
        <div className="h-full w-full relative flex items-center justify-center overflow-hidden bg-transparent">
          {isLifestyle ? (
            <img
              src={product.thumbnail}
              height="600"
              width="600"
              className="object-cover object-center absolute inset-0 h-full w-full rounded-2xl"
              alt={product.title}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative w-full h-full p-4 flex items-center justify-center bg-transparent">
              <img
                src={product.thumbnail}
                className="max-h-full max-w-full object-contain"
                alt={product.title}
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </a>
    </motion.div>
  );
};
