import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pages } from '../src/lib/fixtures/pages.ts';

const output = resolve(process.cwd(), 'tmp-river-fixture-export.json');
writeFileSync(output, `${JSON.stringify(pages, null, 2)}\n`);
console.log(`Wrote ${output}`);
