export type LanguageCode = 'hr' | 'en';

export interface MediaAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: Record<string, string>;
}

export interface Cta {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteNavBlock {
  type: 'site_nav';
  logo?: MediaAsset;
  items: NavItem[];
  cta?: Cta;
}

export interface HomeHeroBlock {
  type: 'home_hero';
  eyebrow?: string;
  title: string;
  body: string;
  slides: MediaAsset[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

export interface CategoryRecapBlock {
  type: 'category_recap';
  heading: string;
  cta?: Cta;
  items: Array<{
    title: string;
    body: string;
    href: string;
    image?: MediaAsset;
  }>;
}

export interface InfoCardsBlock {
  type: 'info_cards';
  heading?: string;
  cards: Array<{
    title: string;
    text: string;
    href?: string;
    label?: string;
  }>;
}

export interface ContactLocationBlock {
  type: 'contact_location';
  heading: string;
  body: string;
  address: string;
  phone: string;
  email: string;
  ctas: Cta[];
  icon?: MediaAsset;
}

export interface StoryBlock {
  type: 'story';
  eyebrow?: string;
  heading: string;
  body: string;
  image?: MediaAsset;
  images?: MediaAsset[];
}

export interface SectionHeadingBlock {
  type: 'section_heading';
  eyebrow?: string;
  heading: string;
  body?: string;
}

export interface GalleryBlock {
  type: 'gallery';
  heading?: string;
  images: MediaAsset[];
}

export interface MapBlock {
  type: 'map';
  title: string;
  address: string;
  embedUrl?: string;
}

export interface SiteFooterBlock {
  type: 'site_footer';
  logo?: MediaAsset;
  address: string;
  phone: string;
  email: string;
  hours: Array<{ label: string; value: string }>;
  socialLinks: Cta[];
  supportLogos?: MediaAsset[];
}

export interface MenuItem {
  name: string;
  description?: string;
  quantity?: string;
  priceEur: string;
  anchorPriceEur?: string;
  anchorPriceDate?: string;
  jumboPriceEur?: string;
  jumboAnchorPriceEur?: string;
  jumboAnchorPriceDate?: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface MenuPageBlock {
  type: 'menu_page';
  title: string;
  activeMenu: 'menu' | 'drinks' | 'pizza';
  languages: Array<{
    code: LanguageCode;
    label: string;
    categories: MenuCategory[];
  }>;
  nav: NavItem[];
  showKunaConversion: boolean;
  conversionRate: number;
}

export interface WineListBlock {
  type: 'wine_list';
  title: string;
  languages: Array<{
    code: LanguageCode;
    label: string;
    categories: MenuCategory[];
  }>;
  nav: NavItem[];
  showKunaConversion: boolean;
  conversionRate: number;
}

export type MenuGroupSlug = 'menu' | 'drinks' | 'pizza' | 'wine';

export interface MenuGroup {
  slug: MenuGroupSlug;
  title: string;
  languages: Array<{
    code: LanguageCode;
    label: string;
    categories: MenuCategory[];
  }>;
}

export type Block =
  | SiteNavBlock
  | HomeHeroBlock
  | CategoryRecapBlock
  | InfoCardsBlock
  | ContactLocationBlock
  | StoryBlock
  | SectionHeadingBlock
  | GalleryBlock
  | MapBlock
  | SiteFooterBlock
  | MenuPageBlock
  | WineListBlock;

export interface Page {
  slug: string;
  title: string;
  seo?: {
    title?: string;
    description?: string;
  };
  blocks: Block[];
}
