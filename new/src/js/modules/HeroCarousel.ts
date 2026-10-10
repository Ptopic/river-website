import { Module } from '../core/Module';

export default class HeroCarousel extends Module {
  private activeIndex = 0;
  private intervalId: number | undefined;

  init(): void {
    const carousel = this.instance.querySelector<HTMLElement>('.astro-carousel-collection');
    const slideCount = Number(this.instance.dataset.slideCount || 1);
    if (!carousel || slideCount <= 1) return;

    this.intervalId = window.setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % slideCount;
      carousel.style.transform = `translateX(${-this.activeIndex * 100}%)`;
    }, 3000);
  }

  destroy(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    super.destroy();
  }
}
