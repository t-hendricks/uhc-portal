import { checkHostDomain, validateSecureURL } from './validators';

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
  describe('validateSecureURL', () => {
    it('should return false if no secure protocol', () => {
      expect(validateSecureURL('example.com')).toEqual(false);
    });

    it('should return false if the host domain is invalid', () => {
      expect(validateSecureURL('example')).toEqual(false);
    });
    it('should return true if the host domain contains secure protocol', () => {
      expect(validateSecureURL('https://example.com')).toEqual(true);
    });
    it('should return false if the host domain is empty', () => {
      expect(validateSecureURL('')).toEqual(false);
    });
    it('should return false if subdomain host domain is valid but unsecure', () => {
      expect(validateSecureURL('http://sub.example.com')).toEqual(false);
    });
  });
});
