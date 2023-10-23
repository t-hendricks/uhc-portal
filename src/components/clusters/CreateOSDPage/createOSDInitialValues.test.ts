import { mockRestrictedEnv } from '~/testUtils';
import createOSDInitialValues from './createOSDInitialValues';

describe('createOSDInitialValues', () => {
  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('sets cluster_privacy to internal', () => {
      const props = {
        cloudProviderID: 'aws',
        product: '',
        isByoc: false,
        isMultiAz: true,
        isTrialDefault: false,
        isHypershiftSelected: false,
      };
      expect(createOSDInitialValues(props).cluster_privacy).toBe('external');

      isRestrictedEnv.mockReturnValue(true);
      expect(createOSDInitialValues(props).cluster_privacy).toBe('internal');
    });
  });
});
