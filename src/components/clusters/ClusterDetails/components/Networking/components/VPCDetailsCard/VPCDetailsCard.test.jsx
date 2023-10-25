import * as React from 'react';

import VPCDetailsCard from './VPCDetailsCard';
import { mockRestrictedEnv, render, screen } from '../../../../../../../testUtils';

describe('<VPCDetailsCard />', () => {
  const defaultProps = {
    isBYOVPC: true,
    openModal: jest.fn(),
  };

  describe('in default environment', () => {
    it('renders footer', async () => {
      render(<VPCDetailsCard {...defaultProps} />);
      expect(screen.queryByText('Edit cluster-wide proxy')).toBeInTheDocument();
    });
  });

  describe('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    beforeAll(() => {
      isRestrictedEnv.mockReturnValue(true);
    });
    afterAll(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('does not render footer', async () => {
      render(<VPCDetailsCard {...defaultProps} />);
      expect(screen.queryByText('Edit cluster-wide proxy')).not.toBeInTheDocument();
    });
  });
});
