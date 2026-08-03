/**
 * Company facts.
 *
 * Every value marked TODO_CONFIRM is a placeholder awaiting the real figure.
 * Nothing here is invented: trust claims that turn out to be false are worse
 * than no claims, so the UI renders a dash for any unconfirmed value rather
 * than a plausible-sounding number. See the checklist in DECISIONS.md.
 */

export interface TrustStat {
  /** i18n key under `home.manufacturing.stats`. */
  key: string;
  /** Numeric value to count up to. `null` until confirmed by the client. */
  value: number | null;
  suffix?: string;
}

/**
 * True once a placeholder has been replaced with a real value.
 *
 * Matches bare `TODO` rather than the exact `TODO_CONFIRM` token: the phone
 * number was written `+212 TODO CONFIRM`, with a space, so an exact-token check
 * passed it as confirmed and the placeholder was printed on the page.
 */
export function isConfirmed(value: string): boolean {
  return !/TODO/i.test(value);
}

export const COMPANY = {
  email: 'TODO_CONFIRM@azhar-products.com',
  phone: 'TODO_CONFIRM',
  whatsapp: 'TODO_CONFIRM',
  address: 'TODO_CONFIRM',
  social: {
    // Taken from the current site. Facebook and LinkedIn are referenced there
    // but only as share widgets, with no canonical page URL exposed.
    instagram: 'https://www.instagram.com/azhar.product/',
    facebook: 'TODO_CONFIRM',
    linkedin: 'TODO_CONFIRM',
  },
  /** Used for JSON-LD Organization and hreflang alternates. */
  siteUrl: 'https://azhar-products.com',
} as const;

export const TRUST_STATS: readonly TrustStat[] = [
  { key: 'yearsOperating', value: null, suffix: '+' },
  { key: 'monthlyOutput', value: null, suffix: 'M' },
  { key: 'formats', value: null, suffix: '+' },
] as const;
