import ocmBaseName, { removeOcmBaseName } from '../getBaseName';

describe('ocmBaseName', () => {
  it('has the expected value', () => {
    expect(ocmBaseName).toBe('/openshift');
  });
});

describe('removeOcmBaseName', () => {
  it('returns the expected value', () => {
    expect(removeOcmBaseName('/openshift/foo?bar=baz')).toBe('/foo?bar=baz');
  });
});
