import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import node from '@astrojs/node';

const isNodePreview = process.env.ASTRO_ADAPTER === 'node';

export default defineConfig({
  output: isNodePreview ? 'server' : 'static',
  adapter: isNodePreview ? node({ mode: 'standalone' }) : netlify(),
  site: process.env.SITE_URL || 'https://river-sol.com',
  vite: {
    resolve: {
      alias: {
        '~': new URL('./src', import.meta.url).pathname
      }
    }
  }
});
