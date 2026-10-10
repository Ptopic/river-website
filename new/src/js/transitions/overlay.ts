import { gsap } from 'gsap';
import type { App } from '../core/App';

export class Overlay {
  private readonly el: HTMLElement | null;
  private readonly label: HTMLElement | null;

  constructor(private readonly app: App) {
    this.el = document.querySelector<HTMLElement>('[data-river-overlay]');
    this.label = document.querySelector<HTMLElement>('[data-river-overlay-label]');
    if (!this.el) return;

    this.el.style.clipPath = 'inset(calc(100% * var(--clip-enter, 0)) 0 calc(100% * var(--clip-leave, 0)) 0)';
    this.el.style.visibility = 'visible';
    this.app.overlayEnter = gsap.quickSetter(this.el, '--clip-enter') as (value: number) => void;
    this.app.overlayLeave = gsap.quickSetter(this.el, '--clip-leave') as (value: number) => void;
    this.app.overlayEnter(0);
    this.app.overlayLeave(0);
  }

  setLabel(text: string): void {
    if (this.label) this.label.textContent = text;
  }

  async intro(load: () => Promise<void>): Promise<void> {
    await load();
    if (!this.el || !this.app.overlayLeave) return;

    const state = { value: 0 };
    await gsap.to(state, {
      value: 1,
      duration: 1,
      delay: 0.2,
      ease: 'expo.inOut',
      onUpdate: () => this.app.overlayLeave?.(state.value)
    });
  }

  async cover(label: string): Promise<void> {
    if (!this.el || !this.app.overlayEnter || !this.app.overlayLeave) return;
    this.setLabel(label);
    this.app.overlayLeave(0);
    this.app.overlayEnter(1);

    const state = { value: 1 };
    await gsap.to(state, {
      value: 0,
      duration: 0.9,
      ease: 'expo.inOut',
      onUpdate: () => this.app.overlayEnter?.(state.value)
    });
  }

  async reveal(): Promise<void> {
    if (!this.el || !this.app.overlayLeave) return;

    const state = { value: 0 };
    await gsap.to(state, {
      value: 1,
      duration: 1,
      ease: 'expo.inOut',
      onUpdate: () => this.app.overlayLeave?.(state.value)
    });
  }
}
