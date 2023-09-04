import {
  isExactMajorMinor,
  isMajorMinorEqualOrGreater,
  splitVersion,
  versionFormatter,
} from './versionHelpers';

describe('versionFormatter', () => {
  it('returns the expected version string', () => {
    const versions = [
      { value: 'v4.12.0-0', result: '4.12.0' },
      { value: 'v4.11.0-candidate', result: '4.11.0-candidate' },
      { value: '4.11.7-candidate', result: '4.11.7-candidate' },
      { value: 'openshift-v4.10.0-candidate', result: '4.10.0-candidate' },
      { value: 'openshift-4.10.1-candidate', result: '4.10.1' },
      { value: 'v2.17.33-7.nightly-2023-03-15-163541-nightly.3', result: '2.17.33-nightly' },
      { value: 'v2.16.33-7.nightly-2023-03-15-163541-latest.3', result: '2.16.33-nightly' },
      { value: '2.16.32-7.nightly-2023-03-15-163541-latest.3', result: '2.16.32-nightly' },
      {
        value: 'openshift-v2.15.33-7.nightly-2023-03-15-163541-latest.3',
        result: '2.15.33-nightly',
      },
      { value: 'v4.10.0-0.nightly-2023-03-15-163541-nightly', result: '4.10.0-nightly' },
      { value: 'v4.9.0-0.nightly-2023-03-15-163541-latest', result: '4.9.0-nightly' },
      { value: 'v4.8.0-0', result: '4.8.0' },
      { value: 'v4.7.0', result: '4.7.0' },
      { value: '4.6.0', result: '4.6.0' },
      { value: 'hello', result: 'hello' },
    ];
    versions.forEach((version) => {
      expect(versionFormatter(version.value)).toEqual(version.result);
    });
  });
});

describe('splitVersion', () => {
  it('can parse versions', () => {
    expect(splitVersion('4.12.0-0')).toEqual([4, 12, 0]);
    expect(splitVersion('4.11.0-candidate')).toEqual([4, 11, 0]);
    expect(splitVersion('4.0.0')).toEqual([4, 0, 0]);
    expect(splitVersion('4.0')).toEqual([4, 0]);
    expect(splitVersion('4')).toEqual([4, 0]);
    expect(splitVersion('hello')).toEqual([NaN, 0]);
  });
});

describe('version comparision', () => {
  it('can isExactMajorMinor', () => {
    expect(isExactMajorMinor('4.12.0-0', 4, 12)).toBeTruthy();
    expect(isExactMajorMinor('4.12.1-0', 4, 12)).toBeTruthy();
    expect(isExactMajorMinor('4.12', 4, 12)).toBeTruthy();
    expect(isExactMajorMinor('4', 4, 0)).toBeTruthy();

    expect(isExactMajorMinor('4.13', 4, 12)).toBeFalsy();
    expect(isExactMajorMinor('4.12', 4, 13)).toBeFalsy();
    expect(isExactMajorMinor('hello', 4, 13)).toBeFalsy();
  });

  it('can isMajorMinorEqualOrGreater', () => {
    expect(isMajorMinorEqualOrGreater('4.12.0-0', 4, 12)).toBeTruthy();
    expect(isMajorMinorEqualOrGreater('4.12.1-0', 4, 12)).toBeTruthy();
    expect(isMajorMinorEqualOrGreater('4.12', 4, 12)).toBeTruthy();
    expect(isMajorMinorEqualOrGreater('4', 4, 0)).toBeTruthy();
    expect(isMajorMinorEqualOrGreater('4.12.0', 4, 12)).toBeTruthy();
    expect(isMajorMinorEqualOrGreater('4.12.1', 4, 12)).toBeTruthy();
    expect(isMajorMinorEqualOrGreater('4.13', 4, 12)).toBeTruthy();
    expect(isMajorMinorEqualOrGreater('5.13', 4, 12)).toBeTruthy();
    expect(isMajorMinorEqualOrGreater('5', 4, 12)).toBeTruthy();

    expect(isMajorMinorEqualOrGreater('4', 4, 12)).toBeFalsy();
    expect(isMajorMinorEqualOrGreater('4.12', 4, 13)).toBeFalsy();
    expect(isMajorMinorEqualOrGreater('4.12.1', 4, 13)).toBeFalsy();
    expect(isMajorMinorEqualOrGreater('4.12.0', 5, 12)).toBeFalsy();
    expect(isMajorMinorEqualOrGreater('hello', 4, 12)).toBeFalsy();
  });
});
