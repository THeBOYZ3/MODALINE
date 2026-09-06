import React, { useEffect, useMemo, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  containerClassName?: string;
  className?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

function processNode(node: ReactNode, keyPrefix = ''): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).split('').map((char, index) => (
      <span className="inline-block char" key={`${keyPrefix}-${index}`}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }
  if (React.isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children;
    const processedChildren = React.Children.map(children, (child, i) =>
      processNode(child, `${keyPrefix}-${i}`)
    );
    return React.cloneElement(node, {}, processedChildren);
  }
  return node;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  className = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.02,
}) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);

  const splitText = useMemo(() => {
    return React.Children.map(children, (child, i) => processNode(child, String(i)));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef?.current ||
      document.getElementById('snap-main-container') ||
      window;

    const charElements = el.querySelectorAll('.char');
    if (charElements.length === 0) return;

    const animation = gsap.fromTo(
      charElements,
      {
        willChange: 'transform, opacity',
        transformOrigin: '50% 100%',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        skewX: '-50deg',
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        skewX: '0deg',
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller: scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      }
    );

    return () => {
      animation.kill();
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <span
      ref={containerRef}
      className={`inline-block overflow-hidden ${containerClassName}`}
    >
      <span className={`inline-block ${className}`}>
        {splitText}
      </span>
    </span>
  );
};

export default ScrollFloat;
