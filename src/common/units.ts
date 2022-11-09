// @types/filesize does not support have the correct return type when `output: 'object'`
// TODO update filesize to latest version which packages updated types
//@ts-ignore
import filesize from 'filesize';
import round from './math';

type Unit = 'B' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

type ValueWithUnits = {
  value: number;
  unit: Unit;
};

const parseValueWithUnit = (value: number, unit: Unit): number => {
  // takes a value + unit from the API and converts it to bytes
  const units: Record<Unit, number> = {
    B: 1,
    KiB: 1024,
    MiB: 2 ** 20,
    GiB: 2 ** 30,
    TiB: 2 ** 40,
    PiB: 2 ** 50,
    KB: 1000,
    MB: 10 ** 6,
    GB: 10 ** 9,
    TB: 10 ** 12,
    PB: 10 ** 15,
  };
  return value * units[unit.trim() as Unit];
};

// We have two strategies for formatting numbers:
// humanize: (45634027520, 'B') -> {value: 42.5, unit: 'GiB'}
// just round: (1234.56789, 'Cores') -> {value: 1234.57, unit: 'Cores'}
// Both have to round long fractions to few digits.
// Both have to return {value, unit} separately, to allow different styling (value in larger font).

// The resulting .value is imprecise, should never be used for further computations.
// TODO: consider making it a string to prevent such usage?

const humanizeValueWithUnit = (
  value: number,
  unit: Unit,
): {
  value: number;
  unit: Unit;
} => {
  const result = filesize(parseValueWithUnit(value, unit), { output: 'object', standard: 'iec' });
  return {
    value: result.value,
    unit: result.suffix,
  };
};

const roundValueWithUnit = (value: number, unit: Unit) => ({
  value: round(value, 2),
  unit,
});

/**
 * Converts bytes to GiB and returns a pair {value: valueInGiB, unit: 'GiB'}.
 * Example:
 * humanizeValueWithUnitGiB(827318075392) => { value: 770.5, unit: 'GiB' }.
 * @param {int} bytes
 */
const humanizeValueWithUnitGiB = (bytes: number): ValueWithUnits => {
  const GiB = 2 ** 30;
  // return a rounded value in GB to be rendered.
  return roundValueWithUnit(bytes / GiB, 'GiB');
};

export { parseValueWithUnit, humanizeValueWithUnit, roundValueWithUnit, humanizeValueWithUnitGiB };
