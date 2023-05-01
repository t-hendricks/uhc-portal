import ocmBaseName, { removeOcmBaseName } from '../getBaseName';

describe('getBaseName', () => {
  it('returns one of 2 expected values', () => {
    expect(['/openshift', '/preview/openshift']).toContain(ocmBaseName());
  });
});

describe('removeOcmBaseName', () => {
  it('handles stable URL', () => {
    expect(removeOcmBaseName('/openshift/foo?bar=baz')).toBe('/foo?bar=baz');
  });

  it('handles beta URL', () => {
    expect(removeOcmBaseName('/beta/openshift/foo?bar=baz')).toBe('/foo?bar=baz');
  });

  it('handles preview URL', () => {
    expect(removeOcmBaseName('/preview/openshift/foo?bar=baz')).toBe('/foo?bar=baz');
  });
});
