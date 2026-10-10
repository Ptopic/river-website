import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { App } from './core/App';
import { ModuleLoader } from './core/ModuleLoader';
import { initTransitions } from './transitions';
import { initSmoothScroll } from './utils/smoothScroll';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const app = new App();
const loader = new ModuleLoader(app);

function bindScroll(): void {
  const scroll = initSmoothScroll();
  app.scroll = scroll;
  if (scroll) scroll.on('scroll', ScrollTrigger.update);
}

function boot(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasTransitionShell = Boolean(document.querySelector('[data-transition="wrapper"]'));

  if (reduced || !hasTransitionShell) {
    bindScroll();
    void loader.load().then(() => ScrollTrigger.refresh());
    return;
  }

  initTransitions(app, loader, bindScroll);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

let lastWidth = window.innerWidth;
let resizeTimer: number | undefined;
window.addEventListener('resize', () => {
  if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth === lastWidth) return;
  lastWidth = window.innerWidth;
  if (resizeTimer) window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    app.emit('resize');
    ScrollTrigger.refresh();
  }, 150);
});
