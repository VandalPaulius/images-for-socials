import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, messages, resolveLocale, SUPPORTED_LOCALES } from './index';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function placeholders(message: string): string[] {
  return [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? '').sort();
}

describe('locale files', () => {
  const englishKeys = flattenKeys(messages.en).sort();

  it.each(SUPPORTED_LOCALES.filter((locale) => locale !== 'en'))(
    '%s has exactly the same keys as English',
    (locale) => {
      expect(flattenKeys(messages[locale]).sort()).toEqual(englishKeys);
    },
  );

  it.each(SUPPORTED_LOCALES)('%s has no empty messages', (locale) => {
    const empty = englishKeys.filter((key) => getMessage(locale, key).trim() === '');
    expect(empty).toEqual([]);
  });

  it.each(SUPPORTED_LOCALES.filter((locale) => locale !== 'en'))(
    '%s uses the same placeholders as English',
    (locale) => {
      for (const key of englishKeys) {
        const expected = [...new Set(placeholders(getMessage('en', key)))];
        const actual = [...new Set(placeholders(getMessage(locale, key)))];
        expect(actual, key).toEqual(expected);
      }
    },
  );
});

function getMessage(locale: keyof typeof messages, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      messages[locale],
    );
  return typeof value === 'string' ? value : '';
}

describe('resolveLocale', () => {
  it('matches on the language subtag', () => {
    expect(resolveLocale(['lt-LT'])).toBe('lt');
    expect(resolveLocale(['en-GB'])).toBe('en');
  });

  it('picks the first supported language in order of preference', () => {
    expect(resolveLocale(['de-DE', 'lt', 'en'])).toBe('lt');
  });

  it('is case-insensitive', () => {
    expect(resolveLocale(['LT-lt'])).toBe('lt');
  });

  it('falls back to English when nothing matches', () => {
    expect(resolveLocale(['de-DE', 'fr'])).toBe(DEFAULT_LOCALE);
    expect(resolveLocale([])).toBe(DEFAULT_LOCALE);
  });
});
