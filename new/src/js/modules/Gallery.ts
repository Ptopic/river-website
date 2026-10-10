import { Module } from '../core/Module';

export default class Gallery extends Module {
  private modal: HTMLElement | null = null;
  private modalImage: HTMLImageElement | null = null;
  private sources: string[] = [];

  init(): void {
    this.modal = document.querySelector<HTMLElement>('[data-gallery-modal]');
    this.modalImage = document.querySelector<HTMLImageElement>('[data-gallery-modal-image]');
    const galleryImages = Array.from(this.instance.querySelectorAll<HTMLElement>('[data-gallery-index]'));
    this.sources = galleryImages.map((button) => button.querySelector('img')?.getAttribute('src') || '');

    galleryImages.forEach((button) => {
      this.listen(button, 'click', () => {
        const index = Number(button.getAttribute('data-gallery-index') || 0);
        if (this.modalImage) this.modalImage.src = this.sources[index] || '';
        this.modal?.classList.remove('astro-hidden');
      });
    });

    const close = document.querySelector<HTMLElement>('.astro-modal-close');
    if (close) {
      this.listen(close, 'click', () => this.modal?.classList.add('astro-hidden'));
    }
  }
}
