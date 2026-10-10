import { Module } from '../core/Module';

function buildEmail(el: HTMLElement): string {
  const local = el.dataset.emailLocal || '';
  const domain = el.dataset.emailDomain || '';
  return local && domain ? `${local}@${domain}` : '';
}

export default class FooterEmail extends Module {
  init(): void {
    this.instance.querySelectorAll<HTMLElement>('[data-email-local][data-email-domain]').forEach((el) => {
      const email = buildEmail(el);
      if (!email) return;

      if (el instanceof HTMLAnchorElement) {
        el.href = `mailto:${email}`;
      } else {
        el.textContent = email;
      }
    });
  }
}
