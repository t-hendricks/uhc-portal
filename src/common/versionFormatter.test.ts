import { versionFormatter } from './versionFormatter';

describe('versionFormatter', () => {
  it('returns the expected version string', () => {
    const versions = [
      { value: 'v4.12.0-0', result: '4.12.0' },
      { value: 'v4.11.0-candidate', result: '4.11.0-candidate' },
      { value: 'v2.17.33-7.nightly-2023-03-15-163541-nightly.3', result: '2.17.33-nightly' },
      { value: 'v2.17.33-7.nightly-2023-03-15-163541-latest.3', result: '2.17.33-nightly' },
      { value: 'v4.12.0-0.nightly-2023-03-15-163541-nightly', result: '4.12.0-nightly' },
      { value: 'v4.12.0-0.nightly-2023-03-15-163541-latest', result: '4.12.0-nightly' },
      { value: 'v4.12.0-0', result: '4.12.0' },
      { value: 'v4.12.0', result: '4.12.0' },
      { value: '4.12.0', result: '4.12.0' },
      { value: 'hello', result: 'hello' },
    ];
    versions.forEach((version) => {
      expect(versionFormatter(version.value)).toEqual(version.result);
    });
  });
});
