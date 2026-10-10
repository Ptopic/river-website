import { drinksData } from '../../data/drinks.js';
import { drinksDataEng } from '../../data/drinksEng.js';
import { hranaData } from '../../data/hrana.js';
import { hranaDataEng } from '../../data/hranaEng.js';
import { pizzaData } from '../../data/pizzaData.js';
import { pizzaDataEng } from '../../data/pizzaDataEng.js';
import type { MenuCategory, MenuGroup, MenuGroupSlug, NavItem } from '../types/blocks';

type LegacyCategory = {
  name: string;
  content: Array<{
    name: string;
    kol?: string;
    price: string;
    jumbo?: string;
  }>;
};

const toMenuCategories = (categories: LegacyCategory[]): MenuCategory[] =>
  categories.map((category) => ({
    title: category.name,
    items: category.content.map((item) => ({
      name: item.name,
      quantity: item.kol,
      priceEur: item.price,
      jumboPriceEur: item.jumbo
    }))
  }));

export const drinksHr = toMenuCategories(drinksData as LegacyCategory[]);
export const drinksEn = toMenuCategories(drinksDataEng as LegacyCategory[]);
export const foodHr = toMenuCategories(hranaData as LegacyCategory[]);
export const foodEn = toMenuCategories(hranaDataEng as LegacyCategory[]);
export const pizzaHr = toMenuCategories(pizzaData as LegacyCategory[]);
export const pizzaEn = toMenuCategories(pizzaDataEng as LegacyCategory[]);

export const wineHr: MenuCategory[] = [
  {
    title: 'Sparkling',
    items: [
      { name: 'Perla Rose', description: 'Brut - Istra', priceEur: '35.00' },
      { name: 'Millenium Tomac', priceEur: '45.00' },
      { name: 'Selection', priceEur: '40.00' }
    ]
  },
  {
    title: 'White wine',
    items: [
      { name: 'Pošip Čara', quantity: '0,75 l', priceEur: '40.00' },
      { name: 'Pošip Intrada', quantity: '0,75 l', priceEur: '45.00' },
      { name: 'Krauhaker Pinot Sivi', quantity: '0,75 l', priceEur: '35.00' },
      { name: 'Žlahtina Katunar', quantity: '0,75 l', priceEur: '35.00' },
      { name: 'Malvazija Kabola', quantity: '0,75 l', priceEur: '40.00' },
      { name: 'Galić G-Točka', quantity: '0,75 l', priceEur: '30.00' }
    ]
  },
  {
    title: 'Rose',
    items: [
      { name: 'Rose Benkovac', quantity: '1,00 l', priceEur: '27.00' },
      { name: 'Rose Galić', quantity: '0,75 l', description: 'Dry - Slavonia', priceEur: '35.00' }
    ]
  },
  {
    title: 'Red wine',
    items: [
      { name: 'Plavac Mali', quantity: '0,75 l', priceEur: '35.00' },
      { name: 'Dingač', quantity: '0,75 l', priceEur: '55.00' },
      { name: 'Postup', quantity: '0,75 l', priceEur: '45.00' }
    ]
  }
];

export const wineEn: MenuCategory[] = [
  {
    title: 'Sparkling',
    items: [
      { name: 'Perla Rose', description: 'Brut - Istria', priceEur: '35.00' },
      { name: 'Millenium Tomac', priceEur: '45.00' },
      { name: 'Selection', priceEur: '40.00' }
    ]
  },
  {
    title: 'White wine',
    items: [
      { name: 'Pošip Čara', quantity: '0.75 l', priceEur: '40.00' },
      { name: 'Pošip Intrada', quantity: '0.75 l', priceEur: '45.00' },
      { name: 'Krauhaker Pinot Sivi', quantity: '0.75 l', priceEur: '35.00' },
      { name: 'Žlahtina Katunar', quantity: '0.75 l', priceEur: '35.00' },
      { name: 'Malvazija Kabola', quantity: '0.75 l', priceEur: '40.00' },
      { name: 'Galić G-Točka', quantity: '0.75 l', priceEur: '30.00' }
    ]
  },
  {
    title: 'Rose',
    items: [
      { name: 'Rose Benkovac', quantity: '1.00 l', priceEur: '27.00' },
      { name: 'Rose Galić', quantity: '0.75 l', description: 'Dry - Slavonia', priceEur: '35.00' }
    ]
  },
  {
    title: 'Red wine',
    items: [
      { name: 'Plavac Mali', quantity: '0.75 l', priceEur: '35.00' },
      { name: 'Dingač', quantity: '0.75 l', priceEur: '55.00' },
      { name: 'Postup', quantity: '0.75 l', priceEur: '45.00' }
    ]
  }
];

export const menuNav: NavItem[] = [
  { label: 'Food', href: '/food' },
  { label: 'Drinks', href: '/drinks' },
  { label: 'Pizza', href: '/pizza' },
  { label: 'Wine', href: '/vine' }
];

export const fixtureMenuGroups: MenuGroup[] = [
  {
    slug: 'menu',
    title: 'Menu',
    languages: [
      { code: 'hr', label: 'HR', categories: foodHr },
      { code: 'en', label: 'EN', categories: foodEn }
    ]
  },
  {
    slug: 'drinks',
    title: 'Drinks',
    languages: [
      { code: 'hr', label: 'HR', categories: drinksHr },
      { code: 'en', label: 'EN', categories: drinksEn }
    ]
  },
  {
    slug: 'pizza',
    title: 'Pizza',
    languages: [
      { code: 'hr', label: 'HR', categories: pizzaHr },
      { code: 'en', label: 'EN', categories: pizzaEn }
    ]
  },
  {
    slug: 'wine',
    title: 'Vinska karta',
    languages: [
      { code: 'hr', label: 'HR', categories: wineHr },
      { code: 'en', label: 'EN', categories: wineEn }
    ]
  }
];

export function getFixtureMenuGroup(slug: MenuGroupSlug): MenuGroup {
  const group = fixtureMenuGroups.find((candidate) => candidate.slug === slug);
  if (!group) {
    throw new Error(`No River fixture menu group found for slug "${slug}".`);
  }
  return group;
}
