// The single source of truth for dataset release facts shown on the site.
// Update this file when a release ships; the Qor page table and the live
// ledgers on Home and Qor all read from here (audit P0.7: static metadata
// and live UI must not disagree).

export const CURRENT_RELEASE = 'v0.2.1';

export type Release = {
  version: string;
  date: string; // ISO
  records: number; // verified records in the release
  notes: string;
};

export const RELEASES: Release[] = [
  { version: 'v0.2.1', date: '2026-08-09', records: 268, notes: '2,282 verified sentences' },
  { version: 'v0.2.0', date: '2026-08-04', records: 235, notes: '' },
  { version: 'v0.1.2', date: '2026-07-30', records: 124, notes: '' },
  { version: 'v0.1.1', date: '2026-07-30', records: 124, notes: '' },
  { version: 'v0.1.0', date: '2026-07-30', records: 124, notes: 'First public release' },
];
