import * as React from 'react';
import { screen } from '@testing-library/dom';
import { mockRestrictedEnv, render } from '~/testUtils';
import NetworkScreen from '.';

describe('<NetworkScreen />', () => {
  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('Cluster privacy is set to internal and cannot be changed', () => {
      const { rerender } = render(<NetworkScreen change={() => {}} showClusterPrivacy />);

      expect(screen.getByTestId('cluster_privacy-external')).not.toBeDisabled();
      expect(screen.getByTestId('cluster_privacy-internal')).not.toBeDisabled();

      isRestrictedEnv.mockReturnValue(true);
      rerender(<NetworkScreen change={() => {}} showClusterPrivacy />);
      expect(screen.getByTestId('cluster_privacy-external')).toBeDisabled();
      expect(screen.getByTestId('cluster_privacy-external')).not.toBeChecked();
      expect(screen.getByTestId('cluster_privacy-internal')).toBeChecked();
      expect(screen.getByTestId('cluster_privacy-internal')).toBeDisabled();
    });
  });
});
