import { versionFormatter } from './versionFormatter';

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
