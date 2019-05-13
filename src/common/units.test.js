import { humanizeValueWithUnit, parseValueWithUnit, roundValueWithUnit } from './units';

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

test('Rounding rounds long fractions', () => {
  expect(roundValueWithUnit(1234.56789, 'Cores')).toEqual({ value: 1234.57, unit: 'Cores' });
});
