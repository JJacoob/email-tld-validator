# email-tld-validator

Lightweight email validator with full IANA TLD validation. Zero dependencies. TypeScript included.

## Features

* ✅ Email syntax validation
* ✅ Local-part validation (length, characters, dot rules)
* ✅ Domain validation (labels, hyphens, length limits)
* ✅ TLD validation against the official IANA Root Zone Database
* ✅ Supports 1,437+ active TLDs
* ✅ TypeScript support
* ✅ Zero runtime dependencies
* ✅ Fast and lightweight

## Installation

```bash
npm install email-tld-validator
```

## Quick Start

### CommonJS

```js
const {
  validateEmail,
  isValidEmail,
  getTLDs
} = require('email-tld-validator');

validateEmail('user@example.com');
// { valid: true }

isValidEmail('user@example.com');
// true
```

### ES Modules

```js
import {
  validateEmail,
  isValidEmail,
  getTLDs
} from 'email-tld-validator';
```

## Examples

### Detailed Validation

```js
validateEmail('user@example.com');
// { valid: true }

validateEmail('user@example.invalid');
// {
//   valid: false,
//   reason: '"invalid" is not a recognized TLD'
// }

validateEmail('.bad@example.com');
// {
//   valid: false,
//   reason: 'Invalid characters or format in local part (before @)'
// }
```

### Boolean Validation

```js
isValidEmail('user@example.com');
// true

isValidEmail('not-an-email');
// false
```

### Access Supported TLDs

```js
const tlds = getTLDs();

tlds.has('com'); // true
tlds.has('dev'); // true

console.log(tlds.size);
// 1437+
```

## TypeScript

```ts
import {
  validateEmail,
  isValidEmail,
  getTLDs,
  ValidationResult
} from 'email-tld-validator';

const result: ValidationResult =
  validateEmail('user@example.com');
```

## API

### `validateEmail(email: string): ValidationResult`

Performs full email validation.

Returns:

```ts
{ valid: true }
```

or

```ts
{
  valid: false,
  reason: string
}
```

### `isValidEmail(email: string): boolean`

Convenience helper that returns only a boolean result.

Equivalent to:

```ts
validateEmail(email).valid
```

### `getTLDs(): Set<string>`

Returns a copy of the internal TLD set used for validation.

## Validation Rules

| Check                 | Rule                                      |
| --------------------- | ----------------------------------------- |
| Local part characters | `a-z A-Z 0-9 . _ % + -`                   |
| Local part length     | Maximum 64 characters                     |
| Local part dots       | No leading, trailing, or consecutive dots |
| Domain label          | Alphanumeric and hyphens only             |
| Domain label length   | Maximum 63 characters                     |
| Domain label hyphens  | Cannot start or end with `-`              |
| Domain length         | Maximum 253 characters                    |
| Email length          | Maximum 254 characters                    |
| TLD validation        | Must exist in the IANA Root Zone Database |

## Notes

This package validates email format and TLD existence only.

It does **not**:

* Verify mailbox existence
* Perform SMTP checks
* Check MX records
* Detect disposable email providers

## License

MIT
