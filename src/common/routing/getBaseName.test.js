import { ocmBaseName, withBasename } from './getBaseName';

describe('getBaseName', () => {
  it('returns /openshift', () => {
    expect(['/openshift']).toContain(ocmBaseName);
  });
});

describe('withBasename', () => {
  it('works with string routes starting with a slash', () => {
    expect(withBasename('/test')).toEqual('/openshift/test');
  });

  it('works with string routes starting without a slash', () => {
    expect(withBasename('test')).toEqual('/openshift/test');
  });

  it('works with object routes starting with a slash', () => {
    expect(withBasename({ pathname: '/test' })).toEqual({ pathname: '/openshift/test' });
  });

  it('works with object routes starting without a slash', () => {
    expect(withBasename({ pathname: 'test' })).toEqual({ pathname: '/openshift/test' });
  });
});
