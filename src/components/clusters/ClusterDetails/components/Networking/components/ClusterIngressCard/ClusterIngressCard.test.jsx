import * as React from 'react';
import { screen } from '@testing-library/dom';
import { mockRestrictedEnv, render } from '../../../../../../../testUtils';
import ClusterIngressCard from './ClusterIngressCard';

describe('<ClusterIngressCard />', () => {
  const isRestrictedEnv = mockRestrictedEnv();
  describe('in restricted env', () => {
    const props = {
      isBYOVPC: true,
    };

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('does not render footer', async () => {
      const { rerender } = render(<ClusterIngressCard {...props} />);
      expect(screen.queryByText('Edit cluster ingress')).toBeInTheDocument();

      isRestrictedEnv.mockReturnValue(true);
      rerender(<ClusterIngressCard {...props} />);
      expect(screen.queryByText('Edit cluster ingress')).not.toBeInTheDocument();
    });

    it('API and router are shown as private', async () => {
      const { rerender } = render(<ClusterIngressCard {...props} />);
      expect(screen.queryByText('Private API')).not.toBeInTheDocument();

      isRestrictedEnv.mockReturnValue(true);
      rerender(<ClusterIngressCard {...props} />);
      expect(screen.queryByText('Private API')).toBeInTheDocument();
    });
  });
});
