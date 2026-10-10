import { Module } from '../core/Module';

export default class WinePage extends Module {
  init(): void {
    const scope = this.instance.closest('[data-transition="container"]') ?? this.instance.parentElement ?? this.instance;
    const modal = scope.querySelector<HTMLElement>('[data-language-modal]');
    const toggle = this.instance.querySelector<HTMLElement>('.astro-language-toggle');
    const close = modal?.querySelector<HTMLElement>('.astro-language-close');

    if (toggle) this.listen(toggle, 'click', () => modal?.classList.remove('astro-hidden'));
    if (close) this.listen(close, 'click', () => modal?.classList.add('astro-hidden'));
  }
}
