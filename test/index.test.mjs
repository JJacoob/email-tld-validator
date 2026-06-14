/**
 * test/index.test.mjs
 * Run with: node --experimental-vm-modules test/index.test.mjs
 */

import { validateEmail, isValidEmail, getTLDs, getTLDMeta } from '../dist/index.mjs';

let passed = 0;
let failed = 0;

function test(description, email, expectedValid) {
  const result = validateEmail(email);
  const ok = result.valid === expectedValid;
  if (ok) {
    console.log(`  ✓  ${description}`);
    passed++;
  } else {
    console.error(`  ✗  ${description}`);
    console.error(`     email   : ${JSON.stringify(email)}`);
    console.error(`     expected: valid=${expectedValid}`);
    console.error(`     got     : valid=${result.valid}, reason="${result.reason}"`);
    failed++;
  }
}

console.log('\n── Valid emails ───────────────────────────────────────');
test('simple .com',                 'user@example.com',                true);
test('with dots in local',          'first.last@example.com',          true);
test('with plus tag',               'user+tag@example.org',            true);
test('with underscore',             'user_name@example.net',           true);
test('with hyphen in local',        'user-name@example.io',            true);
test('numeric local',               '12345@example.com',               true);
test('subdomain',                   'user@mail.example.com',           true);
test('new TLD .app',                'hello@example.app',               true);
test('new TLD .dev',                'hello@example.dev',               true);
test('new TLD .ai',                 'hello@example.ai',                true);
test('new TLD .io',                 'hello@example.io',                true);
test('uppercase (trimmed)',          'User@Example.COM',                true);
test('leading/trailing whitespace', '  user@example.com  ',            true);
test('long but valid local (64)',   'a'.repeat(64) + '@example.com',   true);

console.log('\n── Invalid emails ─────────────────────────────────────');
test('missing @',                   'userexample.com',                 false);
test('missing local',               '@example.com',                    false);
test('missing domain',              'user@',                           false);
test('double @',                    'user@@example.com',               false);
test('leading dot in local',        '.user@example.com',               false);
test('trailing dot in local',       'user.@example.com',               false);
test('consecutive dots in local',   'us..er@example.com',              false);
test('space in local',              'us er@example.com',               false);
test('no TLD',                      'user@example',                    false);
test('unknown TLD .invalid',        'user@example.invalid',            false);
test('unknown TLD .xyz123',         'user@example.xyz123',             false);
test('hyphen at start of label',    'user@-example.com',               false);
test('hyphen at end of label',      'user@example-.com',               false);
test('local too long (65 chars)',   'a'.repeat(65) + '@example.com',   false);
test('empty string',                '',                                 false);
test('whitespace only',             '   ',                             false);
test('IDN TLD',                     'user@example.xn--p1ai',           false);

console.log('\n── isValidEmail ───────────────────────────────────────');
const t1 = isValidEmail('user@example.com') === true;
const t2 = isValidEmail('bad-email') === false;
console.log(`  isValidEmail('user@example.com') → true  ${t1 ? '✓' : '✗'}`);
console.log(`  isValidEmail('bad-email')         → false ${t2 ? '✓' : '✗'}`);
if (t1) passed++; else failed++;
if (t2) passed++; else failed++;

console.log('\n── getTLDs ────────────────────────────────────────────');
const tlds = getTLDs();
console.log(`  count : ${tlds.size}`);
['com', 'dev', 'xyz', 'ai', 'io', 'app'].forEach((t) => {
  const has = tlds.has(t);
  console.log(`  has("${t}") → ${has ? '✓' : '✗'}`);
  if (has) passed++; else failed++;
});

console.log('\n── getTLDMeta ─────────────────────────────────────────');
const meta = getTLDMeta();
console.log(`  source    : ${meta.source}`);
console.log(`  updatedAt : ${meta.updatedAt}`);
console.log(`  count     : ${meta.count}`);

console.log(`\n── Results: ${passed} passed, ${failed} failed ──────────────────\n`);
if (failed > 0) process.exit(1);
