import { readFileSync } from 'node:fs';

const path = new URL('../wordpress/wp-content/mu-plugins/acf-json/group_river_page_sections.json', import.meta.url);
const group = JSON.parse(readFileSync(path, 'utf8'));

if (group.fields?.[0]?.key !== 'field_river_sections') {
  throw new Error('River ACF sections field is missing.');
}

const required = [
  'site_nav',
  'home_hero',
  'category_recap',
  'info_cards',
  'contact_location',
  'story',
  'section_heading',
  'gallery',
  'map',
  'site_footer',
  'menu_page',
  'wine_list'
];

const layouts = Object.values(group.fields[0].layouts ?? {}).map((layout) => layout.name);
const missing = required.filter((layout) => !layouts.includes(layout));

if (missing.length) {
  throw new Error(`Missing River ACF layouts: ${missing.join(', ')}`);
}

console.log('River ACF structure check passed.');
