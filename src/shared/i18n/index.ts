import en from '../locales/en.json';
import lt from '../locales/lt.json';
import { lithuanianPluralRule } from './pluralRules';

export const SUPPORTED_LOCALES = ['en', 'lt'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en';

/** English is the source language; every other locale must have the same shape. */
export type MessageSchema = typeof en;

export const messages: Record<SupportedLocale, MessageSchema> = { en, lt };

export const pluralRules = { lt: lithuanianPluralRule };

function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Picks the first supported locale from a list of BCP 47 tags (e.g. `navigator.languages`),
 * matching on the language subtag only, so `lt-LT` resolves to `lt`.
 */
export function resolveLocale(preferred: readonly string[]): SupportedLocale {
  for (const tag of preferred) {
    const language = tag.toLowerCase().split('-')[0] ?? '';
    if (isSupportedLocale(language)) return language;
  }
  return DEFAULT_LOCALE;
}
