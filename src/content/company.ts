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

export const COMPANY = {
  email: 'TODO_CONFIRM@azhar-products.com',
  phone: '+212 TODO CONFIRM',
  whatsapp: 'TODO_CONFIRM',
  address: 'TODO_CONFIRM — full facility address',
  social: {
    instagram: 'TODO_CONFIRM',
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
