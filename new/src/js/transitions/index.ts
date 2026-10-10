import barba from '@barba/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { App } from '../core/App';
import type { ModuleLoader } from '../core/ModuleLoader';
import { destroySmoothScroll } from '../utils/smoothScroll';
import { Overlay } from './overlay';
import { syncHead } from './syncHead';

gsap.registerPlugin(ScrollTrigger);

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

function hideContainer(container?: HTMLElement | null): void {
  if (!container) return;
  gsap.set(container, {
    autoAlpha: 0,
    display: 'none',
    position: 'absolute',
    inset: 0,
    width: '100%'
  });
}

function showContainer(container?: HTMLElement | null): void {
  if (!container) return;
  gsap.set(container, {
    autoAlpha: 1,
    clearProps: 'display,position,inset,width'
  });
}

export function initTransitions(app: App, loader: ModuleLoader, bindScroll: () => void): void {
  const overlay = new Overlay(app);

  barba.init({
    schema: { prefix: 'data-transition', namespace: 'page' },
    timeout: 7000,
    prevent: ({ el, event }: { el?: HTMLAnchorElement | null; event: MouseEvent }) => {
      if (!el || event.type !== 'click') return false;
      if (el.closest('[data-no-transition]')) return true;
      const url = new URL(el.href, location.href);
      return url.origin !== location.origin || (url.pathname === location.pathname && Boolean(url.hash));
    },
    transitions: [
      {
        name: 'river',
        once: async () => {
          overlay.setLabel('River');
          await overlay.intro(async () => {
            bindScroll();
            await loader.load();
            ScrollTrigger.refresh();
          });
        },
        leave: async (data: any) => {
          app.scroll?.stop();
          await overlay.cover('River');
          hideContainer(data.current.container);
          loader.unload();
          ScrollTrigger.killAll();
          destroySmoothScroll();
        },
        enter: async (data: any) => {
          hideContainer(data.next.container);
          syncHead(data.next.html ?? '');
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          await nextFrame();
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          bindScroll();
          await loader.load(data.next.container);
          ScrollTrigger.refresh();
          showContainer(data.next.container);
          await nextFrame();
          await overlay.reveal();
          app.scroll?.start();
        }
      }
    ]
  });

  barba.hooks.enter((data: any) => {
    data.next.container.querySelectorAll('video').forEach((video: HTMLVideoElement) => video.load());
  });
}
