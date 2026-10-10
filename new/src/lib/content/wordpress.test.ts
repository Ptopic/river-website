import assert from 'node:assert/strict';
import test from 'node:test';
import { getFixtureMenuGroup } from '../fixtures/menu-data';
import { getFixturePage } from '../fixtures/pages';
import { mapWpPage, wpRestUrl } from './wordpress';

test('fixture page exposes the single WordPress-backed home page', () => {
  assert.equal(getFixturePage('/').slug, 'home');
  assert.equal(getFixturePage('home').slug, 'home');
});

test('fixture menu groups expose the public menu routes', () => {
  assert.equal(getFixtureMenuGroup('menu').slug, 'menu');
  assert.equal(getFixtureMenuGroup('drinks').slug, 'drinks');
  assert.equal(getFixtureMenuGroup('pizza').slug, 'pizza');
  assert.equal(getFixtureMenuGroup('wine').slug, 'wine');
});

test('WordPress mapper accepts normalized River section rows', () => {
  const page = mapWpPage({
    id: 10,
    slug: 'home',
    title: { rendered: 'Home' },
    river_sections: [{ type: 'section_heading', heading: 'Hello' }]
  });

  assert.equal(page.blocks[0].type, 'section_heading');
});

test('WordPress mapper rejects unknown layouts loudly', () => {
  assert.throws(
    () =>
      mapWpPage({
        id: 11,
        slug: 'home',
        title: { rendered: 'Home' },
        river_sections: [{ acf_fc_layout: 'mystery_block' }]
      }),
    /Unknown River section type/
  );
});

test('localhost REST URLs use rest_route for plain permalink-safe local WordPress', () => {
  const url = wpRestUrl('/wp-json/wp/v2/pages', 'http://localhost:8080');
  assert.equal(url.pathname, '/index.php');
  assert.equal(url.searchParams.get('rest_route'), '/wp/v2/pages');
});
