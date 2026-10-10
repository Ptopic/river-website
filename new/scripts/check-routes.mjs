import { existsSync } from 'node:fs';
import { join } from 'node:path';

const routes = ['index.html', 'drinks/index.html', 'pizza/index.html', 'vine/index.html', 'menu/index.html', 'food/index.html'];
const missing = routes.filter((route) => !existsSync(join(process.cwd(), 'dist', route)));

if (missing.length) {
  console.error(`Missing built routes:\n${missing.map((route) => `- ${route}`).join('\n')}`);
  process.exit(1);
}

console.log(`Route check passed for ${routes.length} River routes.`);
