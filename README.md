# email-tld-validator

Lightweight email validator with IANA TLD whitelist support. No dependencies.

- Validates local part format (length, allowed characters, dot rules)
- Validates domain label format (length, hyphens, structure)
- Validates TLD against the full IANA Root Zone Database (1,437 TLDs, updated Jun 2026)
- Full TypeScript support

## Install

```bash
npm install email-tld-validator
```

## Usage

```js
const { validateEmail, isValidEmail, getTLDs } = require('email-tld-validator');

// Detailed result
validateEmail('user@example.com');
// { valid: true }

validateEmail('user@example.invalid');
// { valid: false, reason: '"invalid" is not a recognized TLD' }

validateEmail('.bad@example.com');
// { valid: false, reason: 'Invalid characters or format in local part (before @)' }

// Simple boolean
isValidEmail('user@example.com');   // true
isValidEmail('not-an-email');       // false

// Inspect the TLD set
const tlds = getTLDs();
tlds.has('com'); // true
tlds.has('dev'); // true
tlds.size;       // 1437
```

## TypeScript

```ts
import { validateEmail, isValidEmail, getTLDs, ValidationResult } from 'email-tld-validator';

const result: ValidationResult = validateEmail('user@example.com');
```

## API

### `validateEmail(email: string): { valid: boolean, reason?: string }`

Full validation. Returns `{ valid: true }` on success, or `{ valid: false, reason: string }` with a human-readable reason on failure.

### `isValidEmail(email: string): boolean`

Convenience wrapper. Returns `true` or `false`.

### `getTLDs(): Set<string>`

Returns a copy of the internal TLD set for inspection.

## Validation rules

| Check | Rule |
|---|---|
| Local part characters | `a-z A-Z 0-9 . _ % + -` only |
| Local part length | max 64 characters |
| Local part dots | no leading, trailing, or consecutive dots |
| Domain label | alphanumeric + hyphens, no leading/trailing hyphen, max 63 chars |
| Domain total length | max 253 characters |
| Total email length | max 254 characters |
| TLD | must be in IANA Root Zone Database |
