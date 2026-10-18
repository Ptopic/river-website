import type { APIRoute } from 'astro';
import { priceListConfigured, wpRestUrl } from '~/lib/content/wordpress';

export const prerender = false;

export const GET: APIRoute = async () => {
  if (!priceListConfigured) return new Response('Cjenik nije dostupan.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  try {
    const upstream = await fetch(wpRestUrl('/wp-json/river/v1/price-list/current.csv'), { cache: 'no-store' });
    if (!upstream.ok) return new Response('Trenutačni cjenik nije dostupan.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': upstream.headers.get('content-disposition') ?? 'attachment; filename="cjenik.csv"',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch {
    return new Response('Trenutačni cjenik nije dostupan.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
