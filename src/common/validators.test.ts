import { checkHostDomain } from './validators';

describe('validators', () => {
  describe('checkHostDomain', () => {
    it('should return undefined if the host domain is valid', () => {
      expect(checkHostDomain('example.com')).toEqual(undefined);
    });

    it('should return error if the host domain is invalid', () => {
      expect(checkHostDomain('example')).toBeDefined();
    });
    it('should return error if the host domain contains protocol', () => {
      expect(checkHostDomain('https://example.com')).toBeDefined();
    });
    it('should return error if the host domain is empty', () => {
      expect(checkHostDomain('')).toBeDefined();
    });
    it('should return undefined if subdomain host domain is valid', () => {
      expect(checkHostDomain('sub.example.com')).toEqual(undefined);
    });
  });
});
