import {
  humanizeValueWithUnit,
  parseValueWithUnit,
  roundValueWithUnit,
  humanizeValueWithUnitGiB,
} from '../units';

test('Parse value with unit works', () => {
  expect(parseValueWithUnit(5, 'KB')).toBe(5000);
  expect(parseValueWithUnit(1, 'KiB')).toBe(1024);
  expect(parseValueWithUnit(1, 'MiB')).toBe(2 ** 20);
  expect(parseValueWithUnit(1, 'GiB')).toBe(2 ** 30);
});

test('Humanizing produces human results', () => {
  expect(humanizeValueWithUnit(1024, 'MiB')).toEqual({ value: 1, unit: 'GiB' });
});

test('Humanizing rounds long fractions', () => {
  expect(humanizeValueWithUnit(12345678, 'B')).toEqual({ value: 11.77, unit: 'MiB' });
});

test('Humanize bytes to GiB works', () => {
  expect(humanizeValueWithUnitGiB(644245094400)).toEqual({ value: 600, unit: 'GiB' });
  expect(humanizeValueWithUnitGiB(827318075392)).toEqual({ value: 770.5, unit: 'GiB' });
});

test('Rounding rounds long fractions', () => {
  expect(roundValueWithUnit(1234.56789, 'Cores')).toEqual({ value: 1234.57, unit: 'Cores' });
});
