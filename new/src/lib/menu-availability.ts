export const menuEnabled = !['false', 'off', '0'].includes(
  (import.meta.env.PUBLIC_MENU_ENABLED ?? '').trim().toLowerCase()
);

export function showMenuLink(href?: string): boolean {
  return menuEnabled || !/^\/(?:menu|hrana)\/?(?:[?#]|$)/.test(href ?? '');
}
