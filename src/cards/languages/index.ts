import { ConfigError } from '../../shape.ts';
import type { CardDef } from '../card.ts';
import { languagesData, type LanguageItem } from './data.ts';
import { renderLanguages } from './classic.ts';
import { renderDisplayLanguages } from './display.ts';

export interface LanguagesSettings {
  title: string | null;
  /** Entries shown, "Other" included: up to MAX_LANGUAGES, the rows that fit on the card. */
  count: number;
  /** Languages left out: their share is dropped. */
  hide: string[];
  /** Weight per repo; 1 is neutral, 0 leaves it out. */
  repos: Record<string, number>;
  /** Fold the remaining languages into an "Other" entry. */
  other: boolean;
  /** How a language's share is measured: by your commits in each repo (each repo's mix weighted by them),
   * or by raw code size, across your and your organizations' repos you committed to, forks left out. */
  by: 'commits' | 'size';
}

export const MAX_LANGUAGES = 6;

export const languages: CardDef<'languages', LanguagesSettings, LanguageItem[]> = {
  name: 'languages',
  on: true,
  alt: 'Most used languages',
  settings: { title: 'Most used languages', count: 6, hide: [], repos: {}, other: true, by: 'commits' },
  shape: { title: 'string?', count: 'number', hide: 'string[]', repos: 'weights', other: 'boolean', by: 'string' },
  check: (s) => {
    if (s.by !== 'commits' && s.by !== 'size') throw new ConfigError('"cards.languages.by" must be "commits" or "size"');
    if (s.count > MAX_LANGUAGES) throw new ConfigError(`"cards.languages.count" must be at most ${MAX_LANGUAGES}, "Other" included`);
  },
  data: languagesData,
  classic: (data, theme, config) => renderLanguages(data, theme, config),
  display: (data, style, config) => renderDisplayLanguages(data, config.cards.languages.title, style),
};
