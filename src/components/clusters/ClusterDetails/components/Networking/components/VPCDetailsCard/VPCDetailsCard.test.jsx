import * as React from 'react';

import VPCDetailsCard from './VPCDetailsCard';
import { mockRestrictedEnv, render, screen } from '../../../../../../../testUtils';

describe('<VPCDetailsCard />', () => {
  describe('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('does not render footer', async () => {
      const props = {
        isBYOVPC: true,
      };
      const { rerender } = render(<VPCDetailsCard {...props} />);
      expect(screen.queryByText('Edit cluster-wide proxy')).toBeInTheDocument();

      isRestrictedEnv.mockReturnValueOnce(true);
      rerender(<VPCDetailsCard {...props} />);
      expect(screen.queryByText('Edit cluster-wide proxy')).not.toBeInTheDocument();
    });
  });
});
