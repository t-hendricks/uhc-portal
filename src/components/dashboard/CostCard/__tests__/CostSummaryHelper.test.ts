import { formatCurrency, formatPercentage, getTotal } from '../CostSummaryHelper'; // Replace 'yourModule' with the actual module name
import { Report } from '../models/Report';

describe('formatCurrency', () => {
  it.each([
    ['undefined value, undefined unit -> $0', undefined, undefined, '$0.00'],
    ['100 EUR -> €100', 100, 'EUR', '€100.00'],
    ['50.5 GBP -> £50.50', 50.5, 'GBP', '£50.50'],
    ['0 USD -> $0.00', 0, 'USD', '$0.00'],
  ])('%p', (title, value, unit, expected) => expect(formatCurrency(value, unit)).toBe(expected));
});

describe('getTotal', () => {
  it('returns formatted total and units when report is falsy', () => {
    const report = undefined;
    expect(getTotal(report)).toBe('$0.00');
  });

  it('returns formatted total and units when report.meta.total.cost.total is falsy', () => {
    const report: Report = {
      meta: {
        total: {
          cost: {
            total: undefined,
          },
        },
      },
      data: [],
      pending: false,
      fulfilled: false,
    };
    expect(getTotal(report)).toBe('$0.00');
  });

  it('returns formatted total and units when report.meta.total.cost.total is truthy', () => {
    const report: Report = {
      meta: {
        total: {
          cost: {
            total: {
              value: 100,
              units: 'EUR',
            },
          },
        },
      },
      data: [],
      pending: false,
      fulfilled: false,
    };
    expect(getTotal(report)).toBe('€100.00');
  });

  it('returns formatted total and units with default values when units are not provided', () => {
    const report: Report = {
      meta: {
        total: {
          cost: {
            total: {
              value: 50,
            },
          },
        },
      },
      data: [],
      pending: false,
      fulfilled: false,
    };
    expect(getTotal(report)).toBe('$50.00');
  });
});

describe('formatPercentage', () => {
  it.each([
    ['undefined value -> 0%', undefined, '0%'],
    ['0.5 value -> 50%', 0.5, '50%'],
    ['0 value -> 0%', 0, '0%'],
    ['negative value, negative percentage', -0.25, '-25%'],
    ['0.75 value -> 75%', 0.75, '75%'],
  ])('%p', (title, value, expected) => expect(formatPercentage(value)).toBe(expected));
});
