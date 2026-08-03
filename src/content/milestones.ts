/**
 * About-page timeline.
 *
 * `year` is null until confirmed. An entry with no year renders its label with
 * an em dash in place of the date rather than a plausible-looking one — the
 * company's own history is exactly the kind of claim that must not be guessed.
 *
 * Copy lives under `about.timeline.items.<key>`.
 */
export interface Milestone {
  key: string;
  year: number | null;
}

export const MILESTONES: readonly Milestone[] = [
  { key: 'founded', year: null },
  { key: 'firstLine', year: null },
  { key: 'toolingInHouse', year: null },
  { key: 'dairyPartnerships', year: null },
  { key: 'capacityExpansion', year: null },
  { key: 'today', year: null },
] as const;

/** Editorial chapters on the About page, in order. */
export const ABOUT_CHAPTERS = [
  'origin',
  'facility',
  'quality',
  'equipment',
] as const;
