import {
  humanizeValueWithUnit,
  parseValueWithUnit,
  roundValueWithUnit,
  humanizeValueWithUnitGiB,
  humanizeValueWithoutUnit,
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

describe('Humanize values without units', () => {
  it.each([
    [1, '1 B'],
    [1024 ** 1, '1 KiB'],
    [1024 ** 2, '1 MiB'],
    [1024 ** 3, '1 GiB'],
    [1024 ** 4, '1 TiB'],
    [1024 ** 5, '1 PiB'],
    [1024 ** 6, '1 EiB'],
  ])('value %i is expected to be %s', (value, expected) =>
    expect(humanizeValueWithoutUnit(value)).toEqual(expected),
  );

  it.each([
    [1, 2, '1 B'],
    [1024 ** 1, 2, '1 KiB'],
    [1024 ** 2, 2, '1 MiB'],
    [1024 ** 3, 2, '1 GiB'],
    [1024 ** 4, 2, '1 TiB'],
    [1024 ** 5, 2, '1 PiB'],
    [1024 ** 6, 2, '1 EiB'],
    [1, undefined, '1 B'],
    [1024 ** 1, undefined, '1 KiB'],
    [1024 ** 2, undefined, '1 MiB'],
    [1024 ** 3, undefined, '1 GiB'],
    [1024 ** 4, undefined, '1 TiB'],
    [1024 ** 5, undefined, '1 PiB'],
    [1024 ** 6, undefined, '1 EiB'],
    [1, 10, '1 B'],
    [1024 ** 1, 10, '1.02 kB'],
    [1024 ** 2, 10, '1.05 MB'],
    [1024 ** 3, 10, '1.07 GB'],
    [1024 ** 4, 10, '1.1 TB'],
    [1024 ** 5, 10, '1.13 PB'],
    [1024 ** 6, 10, '1.15 EB'],
  ])('with base. value %i is expected to be %s', (value, base: number | undefined, expected) =>
    expect(humanizeValueWithoutUnit(value, base as 2 | 10 | undefined)).toEqual(expected),
  );
});

test('Rounding rounds long fractions', () => {
  expect(roundValueWithUnit(1234.56789, 'B')).toEqual({ value: 1234.57, unit: 'B' });
});
