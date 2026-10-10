import { Module } from '../core/Module';

export default class SiteNav extends Module {
  private opened = false;
  private mobileToggle: HTMLElement | null = null;
  private mobileContainer: HTMLElement | null = null;
  private navbar: HTMLElement | null = null;
  private mobileNavbar: HTMLElement | null = null;

  init(): void {
    this.mobileToggle = document.querySelector<HTMLElement>('.astro-mobile-menu-toggle');
    this.mobileContainer = document.querySelector<HTMLElement>('.navbar-mobile-container');
    this.navbar = document.querySelector<HTMLElement>('.navbar');
    this.mobileNavbar = document.querySelector<HTMLElement>('.navbar-mobile');

    this.syncNavbarBackground();

    this.listen(window, 'scroll', () => this.syncNavbarBackground(), { passive: true });
    this.listen(window, 'resize', () => this.syncNavbarBackground());
    if (this.mobileToggle) {
      this.listen(this.mobileToggle, 'click', () => this.toggleMobileMenu());
    }
    if (this.mobileContainer) {
      this.listen(this.mobileContainer, 'click', (event) => {
        if (event.target instanceof HTMLAnchorElement) this.closeMobileMenu();
      });
    }
  }

  destroy(): void {
    this.closeMobileMenu();
    super.destroy();
  }

  private syncNavbarBackground(): void {
    const recap = document.querySelector<HTMLElement>('.recap-container');
    const trigger = recap ? recap.getBoundingClientRect().top + window.scrollY + 500 : 80;
    const isScrolled = window.scrollY >= trigger;

    if (this.navbar) {
      this.navbar.style.background = isScrolled ? '#0b0d12' : 'none';
    }
    if (this.mobileNavbar) {
      this.mobileNavbar.style.background = isScrolled ? '#0b0d12' : 'transparent';
    }
  }

  private toggleMobileMenu(): void {
    this.opened = !this.opened;
    this.mobileToggle?.classList.toggle('is-open', this.opened);
    this.mobileToggle?.setAttribute('aria-expanded', this.opened ? 'true' : 'false');
    if (this.mobileContainer) {
      this.mobileContainer.style.transform = this.opened ? 'translateX(0%)' : 'translateX(100%)';
    }
  }

  private closeMobileMenu(): void {
    this.opened = false;
    this.mobileToggle?.classList.remove('is-open');
    this.mobileToggle?.setAttribute('aria-expanded', 'false');
    if (this.mobileContainer) {
      this.mobileContainer.style.transform = 'translateX(100%)';
    }
  }
}
