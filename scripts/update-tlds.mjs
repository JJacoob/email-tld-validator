/**
 * update-tlds.mjs
 *
 * Fetches the latest TLD list from the IANA Root Zone Database and writes
 * data/tlds.json. Run locally or via GitHub Actions.
 *
 * Usage:
 *   node scripts/update-tlds.mjs
 */

import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../data/tlds.json');
const IANA_URL = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt';

const JUNK = new Set([
  'last', 'updated', 'sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri',
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct',
  'nov', 'dec', 'utc',
]);

async function fetchTLDs() {
  console.log(`Fetching TLDs from ${IANA_URL} ...`);
  const res = await fetch(IANA_URL);
  if (!res.ok) throw new Error(`IANA fetch failed: ${res.status} ${res.statusText}`);
  return res.text();
}

function parseTLDs(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim().toLowerCase())
    .filter((line) => {
      if (!line || line.startsWith('#')) return false;
      if (JUNK.has(line)) return false;
      if (/^\d/.test(line)) return false;
      if (line.startsWith('xn--')) return false;
      if (!/^[a-z0-9][a-z0-9\-]*[a-z0-9]$|^[a-z0-9]$/.test(line)) return false;
      return true;
    });
}

async function main() {
  const raw = await fetchTLDs();
  const tlds = parseTLDs(raw);

  if (tlds.length < 900) {
    throw new Error(`Suspicious TLD count: ${tlds.length}. Aborting to avoid overwriting good data.`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const payload = {
    source: 'IANA Root Zone Database',
    updatedAt: today,
    count: tlds.length,
    tlds,
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ Written ${tlds.length} TLDs to data/tlds.json (${today})`);
}

main().catch((err) => {
  console.error('✗ update-tlds failed:', err.message);
  process.exit(1);
});
