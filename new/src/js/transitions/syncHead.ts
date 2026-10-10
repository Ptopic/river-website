export function syncHead(html: string): void {
  const next = new DOMParser().parseFromString(html, 'text/html');

  const title = next.querySelector('title');
  if (title) document.title = title.textContent ?? document.title;

  const description = next.querySelector('meta[name="description"]');
  const currentDescription = document.head.querySelector('meta[name="description"]');
  if (description && currentDescription) currentDescription.setAttribute('content', description.getAttribute('content') ?? '');

  const currentStyles = new Set(Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).map((link) => link.getAttribute('href')));
  next.head.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !currentStyles.has(href)) document.head.appendChild(link.cloneNode(true));
  });
}
