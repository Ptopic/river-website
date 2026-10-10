import { gsap } from 'gsap';
import Lenis from 'lenis';

let instance: Lenis | null = null;
const raf = (time: number) => instance?.raf(time * 1000);

export function initSmoothScroll(): Lenis | null {
  if (instance) return instance;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  instance = new Lenis({
    duration: 1.4,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.6
  });

  gsap.ticker.add(raf, false, true);
  return instance;
}

export function destroySmoothScroll(): void {
  gsap.ticker.remove(raf);
  instance?.destroy();
  instance = null;
}
