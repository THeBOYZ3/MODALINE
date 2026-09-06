import Lenis from 'lenis';

interface WindowWithLenis {
  __lenis?: Lenis | null;
}

let globalLenis: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  globalLenis = instance;
  if (typeof window !== 'undefined') {
    (window as unknown as WindowWithLenis).__lenis = instance;
  }
}

export function getLenis(): Lenis | null {
  if (globalLenis) return globalLenis;
  if (typeof window !== 'undefined') {
    const win = window as unknown as WindowWithLenis;
    if (win.__lenis) {
      return win.__lenis;
    }
  }
  return null;
}

export function scrollToTarget(
  target: string | HTMLElement | number,
  options?: Parameters<Lenis['scrollTo']>[1]
) {
  const lenis = getLenis();
  if (lenis) {
    if (typeof target === 'string') {
      if (target === '#home' || target === '#') {
        lenis.scrollTo(0, options);
      } else {
        const el = document.querySelector(target);
        if (el) {
          lenis.scrollTo(el as HTMLElement, options);
        } else {
          lenis.scrollTo(target, options);
        }
      }
    } else {
      lenis.scrollTo(target, options);
    }
  } else {
    // Fallback if Lenis instance is not yet available
    if (typeof target === 'string') {
      if (target === '#home' || target === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Reusable click event handler for in-page navigation links and buttons.
 * Uses the existing Lenis instance for smooth animated scrolling.
 */
export function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>,
  targetHref?: string,
  onAfterScroll?: () => void
) {
  const href = targetHref || (e.currentTarget as HTMLAnchorElement).getAttribute('href');
  if (href && (href.startsWith('#') || href === '')) {
    e.preventDefault();
    scrollToTarget(href === '' ? '#home' : href);
    if (onAfterScroll) {
      onAfterScroll();
    }
  }
}
