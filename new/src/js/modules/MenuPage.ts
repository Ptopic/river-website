import { Module } from '../core/Module';

type MenuItem = {
  name: string;
  quantity?: string;
  description?: string;
  priceEur: string;
  anchorPriceEur?: string;
  anchorPriceDate?: string;
  jumboPriceEur?: string;
  jumboAnchorPriceEur?: string;
  jumboAnchorPriceDate?: string;
};

type MenuCategory = {
  title: string;
  items: MenuItem[];
};

type MenuPayload = {
  hr?: MenuCategory[];
  en?: MenuCategory[];
};

export default class MenuPage extends Module {
  private payload: MenuPayload = {};
  private activeMenu = 'drinks';
  private language: 'hr' | 'en' = 'hr';
  private openDropdown: number | null = null;
  private modal: HTMLElement | null = null;
  private categoriesContainer: HTMLElement | null = null;
  private desktopContent: HTMLElement | null = null;
  private dropdownsContainer: HTMLElement | null = null;
  private flagButton: HTMLElement | null = null;
  private hrFlag = '';
  private enFlag = '';

  init(): void {
    const scope = this.instance.closest('[data-transition="container"]') ?? this.instance.parentElement ?? this.instance;
    this.payload = this.readPayload();
    this.activeMenu = this.instance.dataset.activeMenu || 'drinks';
    this.language = this.instance.dataset.initialLanguage === 'en' ? 'en' : 'hr';
    this.modal = scope.querySelector<HTMLElement>('[data-language-modal]');
    this.categoriesContainer = this.instance.querySelector<HTMLElement>('[data-desktop-categories]');
    this.desktopContent = this.instance.querySelector<HTMLElement>('[data-desktop-menu-content]');
    this.dropdownsContainer = this.instance.querySelector<HTMLElement>('[data-mobile-dropdowns]');
    this.flagButton = this.instance.querySelector<HTMLElement>('[data-current-flag]');
    this.hrFlag = scope.querySelector('.language .hrv img')?.getAttribute('src') || '';
    this.enFlag = scope.querySelector('.language .eng img')?.getAttribute('src') || '';

    this.listen(this.instance, 'click', (event) => this.handlePageClick(event));

    const toggle = this.instance.querySelector<HTMLElement>('.astro-language-toggle');
    const close = scope.querySelector<HTMLElement>('.astro-language-close');
    if (toggle) this.listen(toggle, 'click', () => this.modal?.classList.remove('astro-hidden'));
    if (close) this.listen(close, 'click', () => this.modal?.classList.add('astro-hidden'));

    scope.querySelectorAll<HTMLElement>('.astro-language-option').forEach((option) => {
      this.listen(option, 'click', () => this.setLanguage(option.dataset.language === 'en' ? 'en' : 'hr'));
    });
  }

  private readPayload(): MenuPayload {
    try {
      return JSON.parse(this.instance.dataset.menuPayload || '{}') as MenuPayload;
    } catch {
      return {};
    }
  }

  private categories(): MenuCategory[] {
    return this.payload[this.language] || [];
  }

  private euro(price: string): string {
    return String(price).replace('.', ',');
  }

  private anchor(price?: string, date?: string): string {
    if (!price) return '';
    return `<p2>Sidrena cijena:<br />${this.euro(price)} €${date ? ` (${date})` : ''}</p2>`;
  }

  private handlePageClick(event: Event): void {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const categoryButton = target.closest('.astro-menu-category-button');
    if (categoryButton instanceof HTMLElement) {
      this.renderDesktopContent(Number(categoryButton.dataset.categoryIndex || 0));
    }

    const dropdown = target.closest('[data-dropdown-index]');
    if (dropdown instanceof HTMLElement && target.closest('.astro-dropdown-button, .click-layer')) {
      const index = Number(dropdown.dataset.dropdownIndex || 0);
      this.openDropdown = this.openDropdown === index ? null : index;
      this.syncDropdowns();
    }
  }

  private renderCategories(): void {
    if (!this.categoriesContainer) return;
    this.categoriesContainer.innerHTML = this.categories()
      .map((category, index) => `<button type="button" class="astro-menu-category-button" data-category-index="${index}">${category.title}</button>`)
      .join('');
  }

  private renderDesktopContent(index: number): void {
    const category = this.categories()[index];
    if (!category || !this.desktopContent) return;
    this.desktopContent.classList.remove('astro-hidden');
    this.desktopContent.innerHTML = `
      <h1>${category.title}</h1>
      ${category.items.map((item) => `
        <div class="menu-content-item">
          <div class="flex-container">
            <div class="menu-content-item-content">
              <h1>${item.name}</h1>
              <p>${item.quantity || item.description || ''}</p>
            </div>
            <div class="price-container">${this.euro(item.priceEur)}€${item.anchorPriceEur ? `<small>Sidrena cijena:<br />${this.euro(item.anchorPriceEur)} €${item.anchorPriceDate ? ` (${item.anchorPriceDate})` : ''}</small>` : ''}</div>
          </div>
        </div>
      `).join('')}
    `;
  }

  private renderDropdowns(): void {
    if (!this.dropdownsContainer) return;
    this.dropdownsContainer.innerHTML = this.categories().map((category, index) => `
      <div class="dropdown" data-dropdown-index="${index}">
        <div class="click-layer"></div>
        <button class="dropdown-div astro-dropdown-button" type="button" ${this.activeMenu === 'pizza' ? 'style="display: grid"' : ''}>
          <h1>${category.title}</h1>
          ${this.activeMenu === 'pizza' ? `<h2 style="text-align: end">${this.language === 'hr' ? 'Velika' : 'Large'}</h2><h2 style="text-align: end">Jumbo</h2>` : ''}
        </button>
        <div class="dropdown-content">
          ${category.items.map((item) => `
            <div class="item-container" style="opacity: 0; display: none; padding: 3rem 0.5rem; ${this.activeMenu === 'pizza' ? 'grid-template-columns: 1fr 1fr;' : ''}">
              <div class="item-info"><h2>${item.name}</h2><p>${item.quantity || item.description || ''}</p></div>
              <div class="item-prices">
                <div class="${this.activeMenu === 'pizza' ? 'item-price-pizza' : 'item-price'}" ${this.activeMenu === 'pizza' ? 'style="margin-right: 2rem"' : ''}>
                  <p>${this.euro(item.priceEur)}€</p>${this.anchor(item.anchorPriceEur, item.anchorPriceDate)}
                </div>
                ${this.activeMenu === 'pizza' ? (item.jumboPriceEur ? `<div class="item-price-pizza"><p>${this.euro(item.jumboPriceEur)}€</p>${this.anchor(item.jumboAnchorPriceEur, item.jumboAnchorPriceDate)}</div>` : `<div class="item-price-pizza" style="visibility: hidden"><p>0€</p><p2>Sidrena cijena:<br />0 €</p2></div>`) : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  private syncNavLabels(): void {
    this.instance.querySelectorAll<HTMLElement>('[data-nav-label]').forEach((link) => {
      link.textContent = link.dataset[this.language === 'hr' ? 'labelHr' : 'labelEn'] || link.textContent;
      const href = link.dataset[this.language === 'hr' ? 'hrefHr' : 'hrefEn'];
      if (href) link.setAttribute('href', href);
    });
  }

  private syncDropdowns(): void {
    this.instance.querySelectorAll('[data-dropdown-index]').forEach((currentDropdown) => {
      const current = Number(currentDropdown.getAttribute('data-dropdown-index') || 0);
      currentDropdown.querySelectorAll('.item-container').forEach((item) => {
        if (item instanceof HTMLElement) {
          item.style.opacity = this.openDropdown === current ? '1' : '0';
          item.style.display = this.openDropdown === current ? (this.activeMenu === 'pizza' ? 'grid' : 'flex') : 'none';
        }
      });
    });
  }

  private setLanguage(language: 'hr' | 'en'): void {
    this.language = language;
    this.modal?.querySelectorAll('[data-check]').forEach((check) => {
      check.classList.toggle('astro-hidden', check.getAttribute('data-check') !== language);
    });
    if (this.flagButton) {
      this.flagButton.className = language === 'hr' ? 'hrv astro-language-toggle' : 'eng astro-language-toggle';
      this.flagButton.innerHTML = `<img src="${language === 'hr' ? this.hrFlag : this.enFlag}" alt="" />`;
    }
    this.desktopContent?.classList.add('astro-hidden');
    this.openDropdown = null;
    this.syncNavLabels();
    this.renderCategories();
    this.renderDropdowns();
    this.modal?.classList.add('astro-hidden');
  }
}
