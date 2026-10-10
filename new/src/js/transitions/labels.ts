const ROUTE_LABELS: Record<string, string> = {
  '/': 'River',
  '/menu': 'Menu',
  '/food': 'Food',
  '/drinks': 'Drinks',
  '/pizza': 'Pizza',
  '/vine': 'Wine'
};

const prettify = (path: string) =>
  path
    .split('/')
    .filter(Boolean)
    .pop()
    ?.split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'River';

export function resolveLabel(url: URL): string {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  return ROUTE_LABELS[path] ?? prettify(path);
}
