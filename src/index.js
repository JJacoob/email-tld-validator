import tldData from '../data/tlds.json';

const VALID_TLDS = new Set(tldData.tlds);

/**
 * Validates the local part (before the @).
 * Max 64 chars, allowed: a-z A-Z 0-9 . _ % + -
 * No leading/trailing/consecutive dots.
 * @param {string} local
 * @returns {boolean}
 */
function isValidLocal(local) {
  if (!local || local.length > 64) return false;
  if (/^\.|\.$/.test(local)) return false;
  if (/\.\./.test(local)) return false;
  return /^[a-zA-Z0-9._%+\-]+$/.test(local);
}

/**
 * Validates the domain part (after the @).
 * Each label: 1–63 chars, alphanumeric + hyphens, no leading/trailing hyphen.
 * Total domain max 253 chars, must have at least 2 labels.
 * @param {string} domain
 * @returns {boolean}
 */
function isValidDomain(domain) {
  if (!domain || domain.length > 253) return false;
  const labels = domain.split('.');
  if (labels.length < 2) return false;
  return labels.every(
    (label) =>
      label.length >= 1 &&
      label.length <= 63 &&
      /^[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?$|^[a-zA-Z0-9]$/.test(label),
  );
}

/**
 * Validates an email address against format rules and the IANA TLD whitelist.
 *
 * @param {string} email
 * @returns {{ valid: boolean, reason?: string }}
 *
 * @example
 * validateEmail('user@example.com')      // { valid: true }
 * validateEmail('user@example.invalid')  // { valid: false, reason: '"invalid" is not a recognized TLD' }
 */
export function validateEmail(email) {
  if (typeof email !== 'string' || !email.trim()) {
    return { valid: false, reason: 'Email must be a non-empty string' };
  }

  const trimmed = email.trim();

  if (trimmed.length > 254) {
    return { valid: false, reason: 'Email address is too long' };
  }

  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex === -1) {
    return { valid: false, reason: 'Email address must contain @' };
  }

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  if (!local) {
    return { valid: false, reason: 'Email address must contain @' };
  }

  if (!isValidLocal(local)) {
    return {
      valid: false,
      reason: 'Invalid characters or format in local part (before @)',
    };
  }

  if (!isValidDomain(domain)) {
    return { valid: false, reason: 'Invalid domain format' };
  }

  const tld = domain.split('.').pop().toLowerCase();
  if (!VALID_TLDS.has(tld)) {
    return { valid: false, reason: `"${tld}" is not a recognized TLD` };
  }

  return { valid: true };
}

/**
 * Returns true if the email passes all validation checks.
 * Convenience wrapper around validateEmail.
 *
 * @param {string} email
 * @returns {boolean}
 *
 * @example
 * isValidEmail('user@example.com')  // true
 * isValidEmail('bad-email')         // false
 */
export function isValidEmail(email) {
  return validateEmail(email).valid;
}

/**
 * Returns a copy of the internal IANA TLD set.
 * Useful for inspection or custom filtering.
 *
 * @returns {Set<string>}
 */
export function getTLDs() {
  return new Set(VALID_TLDS);
}

/**
 * Returns TLD metadata from the data file (source, updatedAt, count).
 *
 * @returns {{ source: string, updatedAt: string, count: number }}
 */
export function getTLDMeta() {
  const { source, updatedAt, count } = tldData;
  return { source, updatedAt, count };
}
