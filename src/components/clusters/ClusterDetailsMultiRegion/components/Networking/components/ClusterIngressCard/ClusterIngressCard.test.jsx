import * as React from 'react';

import { mockRestrictedEnv, screen, withState } from '../../../../../../../testUtils';

import ClusterIngressCard from './ClusterIngressCard';

describe('<ClusterIngressCard />', () => {
  const loadedState = {
    clusters: {
      details: {
        cluster: { openshift_version: '4.13.4', api: { url: 'controlPlaneAPIEndpoint' } },
      },
    },
  };

  const defaultProps = {
    isBYOVPC: true,
    isApiPrivate: true,
    isAdditionalRouterPrivate: false,
    hasAdditionalRouter: true,
    canEdit: false,
    isReadOnly: false,
    isSTSEnabled: false,
    isHypershiftCluster: false,
    clusterHibernating: false,
    showConsoleLink: false,
    openModal: jest.fn(),
    refreshCluster: jest.fn(),
    controlPlaneAPIEndpoint: '',
    additionalRouterAddress: '',
  };

  describe('in default environment', () => {
    it('renders footer', async () => {
      withState(loadedState).render(<ClusterIngressCard {...defaultProps} />);
      expect(screen.queryByText('Edit cluster ingress')).toBeInTheDocument();
    });

    it('renders the API as public when isApiPrivate=false', async () => {
      withState(loadedState).render(<ClusterIngressCard {...defaultProps} isApiPrivate={false} />);
      expect(screen.queryByText('Public API')).toBeInTheDocument();
      expect(screen.queryByText('Private API')).not.toBeInTheDocument();
    });

    it('renders the API as private when isApiPrivate=true', async () => {
      withState(loadedState).render(<ClusterIngressCard {...defaultProps} isApiPrivate />);
      expect(screen.queryByText('Public API')).not.toBeInTheDocument();
      expect(screen.queryByText('Private API')).toBeInTheDocument();
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
      withState(loadedState).render(<ClusterIngressCard {...defaultProps} />);
      expect(screen.queryByText('Edit cluster ingress')).not.toBeInTheDocument();
    });

    it('renders the API as private in any case', async () => {
      const { rerender } = withState(loadedState).render(
        <ClusterIngressCard {...defaultProps} isApiPrivate={false} />,
      );
      expect(screen.queryByText('Private API')).toBeInTheDocument();

      rerender(<ClusterIngressCard {...defaultProps} isApiPrivate />, {}, loadedState);
      expect(screen.queryByText('Private API')).toBeInTheDocument();
    });
  });
  describe('ROSA classic', () => {
    it('disables editing cluster ingress', async () => {
      const props = {
        ...defaultProps,
        isSTSEnabled: true,
        isHypershiftCluster: false,
      };
      withState(loadedState).render(<ClusterIngressCard {...props} />);
      expect(screen.getByTestId('edit-cluster-ingress')).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
