import type { Module, ModuleContext } from '../core/Module';

type ModuleCtor = new (context: ModuleContext) => Module;

export const registry = {
  fade: () => import('./Fade') as Promise<{ default: ModuleCtor }>,
  footerEmail: () => import('./FooterEmail') as Promise<{ default: ModuleCtor }>,
  gallery: () => import('./Gallery') as Promise<{ default: ModuleCtor }>,
  heroCarousel: () => import('./HeroCarousel') as Promise<{ default: ModuleCtor }>,
  menuPage: () => import('./MenuPage') as Promise<{ default: ModuleCtor }>,
  siteNav: () => import('./SiteNav') as Promise<{ default: ModuleCtor }>
};

export type ModuleName = keyof typeof registry;
