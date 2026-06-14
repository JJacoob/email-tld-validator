export interface ValidationResult {
  valid: boolean;
  /** Human-readable reason, present only when valid is false */
  reason?: string;
}

export interface TLDMeta {
  source: string;
  updatedAt: string;
  count: number;
}

/**
 * Validates an email address against format rules and the IANA TLD whitelist.
 *
 * @example
 * validateEmail('user@example.com')      // { valid: true }
 * validateEmail('user@example.invalid')  // { valid: false, reason: '"invalid" is not a recognized TLD' }
 */
export function validateEmail(email: string): ValidationResult;

/**
 * Returns true if the email passes all validation checks.
 * Convenience wrapper around validateEmail.
 *
 * @example
 * isValidEmail('user@example.com')  // true
 * isValidEmail('bad-email')         // false
 */
export function isValidEmail(email: string): boolean;

/**
 * Returns a copy of the internal IANA TLD set.
 */
export function getTLDs(): Set<string>;

/**
 * Returns TLD metadata (source, updatedAt, count) from data/tlds.json.
 */
export function getTLDMeta(): TLDMeta;
