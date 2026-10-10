import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Module, type ModuleContext } from '../core/Module';

gsap.registerPlugin(ScrollTrigger);

type FadeItem = HTMLElement & {
  dataset: HTMLElement['dataset'] & {
    fade?: string;
    fadeX?: string;
    fadeY?: string;
    fadeScale?: string;
    fadeDelay?: string;
  };
};

export default class Fade extends Module {
  private items: FadeItem[] = [];
  private triggers: ScrollTrigger[] = [];

  constructor(context: ModuleContext) {
    super(context);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.destroy();
      return;
    }

    const tagged = Array.from(this.instance.querySelectorAll<FadeItem>('[data-fade]'));
    this.items = tagged.length ? tagged : Array.from(this.instance.children).filter((child): child is FadeItem => child instanceof HTMLElement);
  }

  init(): void {
    if (this.destroyed || !this.items.length) return;

    this.items.forEach((item, index) => {
      const x = Number(item.dataset.fadeX ?? this.options.x ?? 0);
      const y = Number(item.dataset.fadeY ?? this.options.y ?? 20);
      const scale = Number(item.dataset.fadeScale ?? this.options.scale ?? 1);
      const delay = Number(item.dataset.fadeDelay ?? index * Number(this.options.stagger ?? 0.1));

      gsap.set(item, {
        opacity: 0,
        x,
        y,
        scale,
        transformOrigin: 'center center'
      });

      const tween = gsap.to(item, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        delay,
        duration: Number(this.options.duration ?? 0.8),
        ease: this.options.ease ?? 'power3.out',
        overwrite: true,
        paused: true
      });

      const trigger = ScrollTrigger.create({
        trigger: item,
        start: this.options.start ?? 'top 85%',
        once: true,
        onEnter: () => tween.play()
      });

      this.triggers.push(trigger);
    });
  }

  resize(): void {
    ScrollTrigger.refresh();
  }

  destroy(): void {
    this.triggers.forEach((trigger) => trigger.kill());
    this.triggers.length = 0;
    super.destroy();
  }
}
