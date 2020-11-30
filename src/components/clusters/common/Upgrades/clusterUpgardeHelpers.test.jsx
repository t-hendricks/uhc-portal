import { versionComparator } from './clusterUpgardeHelpers';

test('Version comparator', () => {
  expect(versionComparator('4.5.15', '4.5.15')).toBe(0);
  expect(versionComparator('4.6.1', '4.6.2')).toBe(-1);
  expect(versionComparator('4.6.19', '4.5.18')).toBe(1);
  expect(versionComparator('4.5.15-fc.4', '4.5.15')).toBe(-1);
  expect(versionComparator('4.5.15-fc.4', '4.5.15-fc.3')).toBe(1);
  expect(versionComparator('4.5.15-fc.4', '4.5.15-fc.4')).toBe(0);
  expect(versionComparator('4.5.14', '4.5.15-fc.4')).toBe(-1);
});
