import assert from 'node:assert/strict';
import { getFixtureMenuGroup } from '../src/lib/fixtures/menu-data';

const food = getFixtureMenuGroup('menu');
const drinks = getFixtureMenuGroup('drinks');
const pizza = getFixtureMenuGroup('pizza');
const wine = getFixtureMenuGroup('wine');

assert.equal(drinks.languages.length, 2, 'Drinks should have HR and EN menus.');
assert.equal(pizza.languages.length, 2, 'Pizza should have HR and EN menus.');
assert.equal(wine.languages.length, 2, 'Wine should have HR and EN menus.');
assert.equal(food.languages.length, 2, 'Food menu should have HR and EN menus.');
assert.ok(food.languages[0].categories.length > 0, 'Food fixture should include categories.');
assert.ok(drinks.languages[0].categories.length > 0, 'Drinks fixture should include categories.');
assert.ok(pizza.languages[0].categories[0].items.some((item) => item.jumboPriceEur), 'Pizza fixture should preserve jumbo pricing.');
assert.ok(wine.languages[0].categories.length >= 4, 'Wine fixture should include the migrated starter categories.');

console.log('Content parity checks passed.');
