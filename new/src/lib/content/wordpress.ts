import { getFixturePage, fixtureSlugs } from '../fixtures/pages';
import { getFixtureMenuGroup, menuNav } from '../fixtures/menu-data';
import type { Block, MenuGroup, MenuGroupSlug, MenuPageBlock, Page, WineListBlock } from '../types/blocks';

const astroEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const API_URL = process.env.WP_API_URL ?? astroEnv?.WP_API_URL;
const USE_FIXTURES = (process.env.USE_FIXTURE_CONTENT ?? astroEnv?.USE_FIXTURE_CONTENT) === 'true';

export const priceListConfigured = !USE_FIXTURES && Boolean(API_URL);

export interface PriceListVersion {
  filename: string;
  published_at: string;
  download_url: string;
}

export interface PriceListManifest {
  current: PriceListVersion | null;
  archive: PriceListVersion[];
  available: boolean;
}

export async function getPriceListManifest(): Promise<PriceListManifest | null> {
  if (!priceListConfigured) return null;
  const response = await fetch(wpRestUrl('/wp-json/river/v1/price-list'), { cache: 'no-store' });
  if (!response.ok) throw new Error(`WordPress price list fetch failed: ${response.status}`);
  const manifest = (await response.json()) as PriceListManifest;
  if (!Array.isArray(manifest.archive) || typeof manifest.available !== 'boolean') {
    throw new Error('WordPress price list manifest is invalid.');
  }
  return manifest;
}

type AcfSection = { acf_fc_layout?: string; type?: string } & Record<string, unknown>;

interface WpPage {
  id: number;
  slug: string;
  title?: { rendered?: string };
  river_sections?: AcfSection[];
  river_seo?: Page['seo'];
  acf?: {
    sections?: AcfSection[];
  };
}

export function wpRestUrl(path: string, apiOrigin = API_URL): URL {
  if (!apiOrigin) {
    throw new Error('WP_API_URL is not set. Use USE_FIXTURE_CONTENT=true for fixture builds.');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const apiUrl = new URL(apiOrigin);

  if (apiUrl.hostname === 'localhost' || apiUrl.hostname === '127.0.0.1') {
    const url = new URL('/index.php', apiUrl);
    url.searchParams.set('rest_route', normalizedPath.replace(/^\/wp-json/, ''));
    return url;
  }

  return new URL(normalizedPath, apiUrl);
}

function assertBlock(value: AcfSection): Block {
  const type = value.type ?? value.acf_fc_layout;
  if (!type) {
    throw new Error(`River section is missing a type: ${JSON.stringify(value)}`);
  }

  const block = { ...value, type } as Block;
  switch (block.type) {
    case 'site_nav':
    case 'home_hero':
    case 'category_recap':
    case 'info_cards':
    case 'contact_location':
    case 'story':
    case 'section_heading':
    case 'gallery':
    case 'map':
    case 'site_footer':
    case 'menu_page':
    case 'wine_list':
      return block;
    default:
      throw new Error(`Unknown River section type "${type}". Add it to Block and BlockRenderer.`);
  }
}

export function mapWpPage(page: WpPage): Page {
  const sections = page.river_sections ?? page.acf?.sections ?? [];
  return {
    slug: page.slug === 'home' ? 'home' : page.slug,
    title: page.title?.rendered?.replace(/<[^>]*>/g, '') || page.slug,
    seo: page.river_seo,
    blocks: sections.map(assertBlock)
  };
}

export async function getPageFromWordPress(slug: string): Promise<Page> {
  const wpSlug = slug === '' || slug === '/' ? 'home' : slug.replace(/^\/+|\/+$/g, '');
  const url = wpRestUrl('/wp-json/wp/v2/pages');
  url.searchParams.set('slug', wpSlug);
  url.searchParams.set('_fields', 'id,slug,title,river_sections,river_seo,acf');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WordPress page fetch failed for "${wpSlug}": ${response.status} ${response.statusText}`);
  }

  const pages = (await response.json()) as WpPage[];
  if (!pages.length) {
    throw new Error(`WordPress page not found for slug "${wpSlug}".`);
  }

  return mapWpPage(pages[0]);
}

export async function getPage(slug: string): Promise<Page> {
  if (USE_FIXTURES || !API_URL) {
    return getFixturePage(slug);
  }

  return getPageFromWordPress(slug);
}

interface WpMenuResponse {
  groups?: MenuGroup[];
}

export async function getMenuGroupsFromWordPress(): Promise<MenuGroup[]> {
  const url = wpRestUrl('/wp-json/river/v1/menu');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WordPress menu fetch failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as WpMenuResponse;
  if (!Array.isArray(payload.groups)) {
    throw new Error('WordPress menu response is missing groups.');
  }

  return payload.groups;
}

export async function getMenuGroup(slug: MenuGroupSlug): Promise<MenuGroup> {
  if (USE_FIXTURES || !API_URL) {
    return getFixtureMenuGroup(slug);
  }

  const groups = await getMenuGroupsFromWordPress();
  const group = groups.find((candidate) => candidate.slug === slug);
  if (!group) {
    throw new Error(`WordPress menu group not found for slug "${slug}".`);
  }

  return group;
}

export async function getMenuPageBlock(slug: Exclude<MenuGroupSlug, 'wine'>): Promise<MenuPageBlock> {
  const group = await getMenuGroup(slug);
  return {
    type: 'menu_page',
    title: group.title,
    activeMenu: slug,
    nav: menuNav,
    showKunaConversion: false,
    conversionRate: 7.5345,
    languages: group.languages
  };
}

export async function getWineListBlock(): Promise<WineListBlock> {
  const group = await getMenuGroup('wine');
  return {
    type: 'wine_list',
    title: group.title,
    nav: menuNav,
    showKunaConversion: false,
    conversionRate: 7.5345,
    languages: group.languages
  };
}

interface BlockPreviewPayload {
  layout: string;
  page: string;
  row: AcfSection;
}

export async function getBlockPreview(hash: string, token: string): Promise<Block> {
  const url = wpRestUrl(`/wp-json/river/v1/block-preview/${hash}`);
  url.searchParams.set('t', token);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WordPress block preview fetch failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as BlockPreviewPayload;
  return assertBlock(payload.row);
}

export async function getStaticPagePaths() {
  if (USE_FIXTURES || !API_URL) {
    return fixtureSlugs
      .filter((slug) => slug !== 'home')
      .map((slug) => ({ params: { slug } }));
  }

  const url = wpRestUrl('/wp-json/wp/v2/pages');
  url.searchParams.set('_fields', 'slug');
  url.searchParams.set('per_page', '100');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WordPress page path fetch failed: ${response.status} ${response.statusText}`);
  }

  const pages = (await response.json()) as Array<{ slug: string }>;
  return pages
    .filter((page) => page.slug !== 'home')
    .map((page) => ({ params: { slug: page.slug } }));
}
