import { useEffect } from 'react';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { SplitText } from 'gsap-trial/SplitText';
import Lenis from 'lenis';
import { setLenisInstance } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function useTextReveal() {
  useEffect(() => {
    // 1. Smooth Scrolling Setup (Lenis + GSAP)
    const lenis = new Lenis();
    setLenisInstance(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. Initialize the Text Reveal Animation
    const splitInstances: SplitText[] = [];

    const initTextReveal = async () => {
      // Initialization Gate: Wait for fonts to be ready
      await document.fonts.ready;

      const elements = document.querySelectorAll<HTMLElement>('[data-copy], [data-copy-wrapper="true"]');
      
      elements.forEach((el) => {
        const isWrapper = el.dataset.copyWrapper === 'true';
        const delay = parseFloat(el.dataset.copyDelay || '0');
        const enableScroll = el.dataset.copyScroll !== 'false';
        
        // Target elements: either the element itself, or its direct children if it's a wrapper
        const targets = isWrapper ? Array.from(el.children) as HTMLElement[] : [el];
        
        targets.forEach((target) => {
          // SplitText Config
          const split = new SplitText(target, { 
            type: "lines", 
            mask: "lines", 
            linesClass: "line line++", 
            lineThreshold: 0.1 
          });
          
          splitInstances.push(split);

          // Text-Indent Transfer
          const computedStyle = window.getComputedStyle(target);
          const textIndent = computedStyle.textIndent;
          if (textIndent && textIndent !== '0px') {
            if (split.lines && split.lines.length > 0) {
              split.lines[0].style.paddingLeft = textIndent;
            }
            target.style.textIndent = '0';
          }

          // Initial State
          gsap.set(split.lines, { y: '100%' });

          // The Tween Config
          const tweenConfig: gsap.TweenVars = {
            y: '0%',
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out',
            delay: delay
          };

          // ScrollTrigger or immediate playback
          if (enableScroll) {
            tweenConfig.scrollTrigger = {
              trigger: target,
              start: 'top 90%',
              once: true
            };
          }

          gsap.to(split.lines, tweenConfig);
        });
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    };

    initTextReveal();

    return () => {
      setLenisInstance(null);
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      splitInstances.forEach(split => split.revert());
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}
