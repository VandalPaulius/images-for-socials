import { describe, expect, it } from 'vitest';
import { lithuanianPluralRule } from './pluralRules';

describe('lithuanianPluralRule', () => {
  it.each([1, 21, 31, 101, 121])('uses the singular form for %i', (n) => {
    expect(lithuanianPluralRule(n, 3)).toBe(0);
  });

  it.each([2, 5, 9, 22, 29, 102])('uses the "few" form for %i', (n) => {
    expect(lithuanianPluralRule(n, 3)).toBe(1);
  });

  it.each([0, 10, 11, 15, 19, 20, 30, 111, 119])('uses the "many" form for %i', (n) => {
    expect(lithuanianPluralRule(n, 3)).toBe(2);
  });

  it('treats negative numbers like positive ones', () => {
    expect(lithuanianPluralRule(-21, 3)).toBe(0);
  });

  it('never returns an index beyond the available forms', () => {
    expect(lithuanianPluralRule(10, 2)).toBe(1);
    expect(lithuanianPluralRule(5, 1)).toBe(0);
  });
});
