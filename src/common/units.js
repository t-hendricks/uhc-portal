import filesize from 'filesize';

function parseValueWithUnit(value, unit) {
  // takes a value + unit from the API and converts it to bytes
  const units = {
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
  return value * units[unit.trim()];
}

function humanizeValueWithUnit(value, unit) {
  const result = filesize(parseValueWithUnit(value, unit), { output: 'object', standard: 'iec' });
  return {
    value: result.value,
    unit: result.suffix,
  };
}

export { parseValueWithUnit, humanizeValueWithUnit };
