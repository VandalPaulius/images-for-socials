/**
 * Lithuanian plural rule for vue-i18n. Messages provide three forms:
 *   0 — 1, 21, 31, …        "1 nuotrauka"
 *   1 — 2–9, 22–29, …       "2 nuotraukos"
 *   2 — 0, 10–20, 30, …     "10 nuotraukų"
 */
export function lithuanianPluralRule(choice: number, choicesLength: number): number {
  const n = Math.abs(choice);
  const mod10 = n % 10;
  const mod100 = n % 100;
  const isTeen = mod100 >= 11 && mod100 <= 19;

  let index: number;
  if (mod10 === 1 && !isTeen) index = 0;
  else if (mod10 >= 2 && mod10 <= 9 && !isTeen) index = 1;
  else index = 2;

  return Math.min(index, choicesLength - 1);
}
