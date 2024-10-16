import React from 'react';

import { useFetchClusterIdentityProviders } from '~/queries/ClusterDetailsQueries/useFetchClusterIdentityProviders';
import { checkAccessibility, render, screen } from '~/testUtils';

import fixtures from '../../../__tests__/ClusterDetails.fixtures';

import IDPSection from './IDPSection';

jest.mock('~/queries/ClusterDetailsQueries/useFetchClusterIdentityProviders', () => ({
  useFetchClusterIdentityProviders: jest.fn(),
}));

const baseIDPs = {
  clusterIDPList: [],
  pending: false,
  fulfilled: true,
  error: false,
};

const clusterUrls = {
  console: 'https://console-openshift-console.apps.test-liza.wiex.s1.devshift.org',
  api: 'https://api.test-liza.wiex.s1.devshift.org:6443',
};

const openModal = jest.fn();
const props = {
  cluster: fixtures.clusterDetails.cluster,
  idpActions: {
    list: true,
  },
  clusterID: '1i4counta3holamvo1g5tp6n8p3a03bq',
  subscriptionID: '1msoogsgTLQ4PePjrTOt3UqvMzX',
  identityProviders: baseIDPs,
  clusterHibernating: false,
  isReadOnly: false,
  isHypershift: false,
  openModal,
  clusterUrls,
};

describe('<IDPSection />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const useFetchClusterIdentityProvidersMock = useFetchClusterIdentityProviders;

  it('should render (no IDPs)', async () => {
    useFetchClusterIdentityProvidersMock.mockReturnValue({
      clusterIdentityProviders: [],
      isLoading: false,
      isError: false,
    });
    const { container } = render(<IDPSection {...props} />);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBe(0);
    await checkAccessibility(container);
  });

  it('should render (IDPs pending)', async () => {
    useFetchClusterIdentityProvidersMock.mockReturnValue({
      clusterIdentityProviders: [],
      isLoading: true,
      isError: false,
    });

    const { container } = render(<IDPSection {...props} />);
    expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBeGreaterThan(0);
    await checkAccessibility(container);
  });

  describe('should render (with IDPs)', () => {
    it('non-Hypershift cluster', async () => {
      useFetchClusterIdentityProvidersMock.mockReturnValue({
        clusterIdentityProviders: {
          items: [
            {
              name: 'hello',
              type: 'GithubIdentityProvider',
              id: 'id1',
            },
            {
              name: 'hi',
              type: 'GoogleIdentityProvider',
              id: 'id2',
            },
          ],
        },
        isLoading: false,
        isError: false,
      });
      const { container } = render(<IDPSection {...props} />);
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hi' })).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hello' })).toBeInTheDocument();
      expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBe(0);

      await checkAccessibility(container);
    });

    it('Hypershift cluster', async () => {
      useFetchClusterIdentityProvidersMock.mockReturnValue({
        clusterIdentityProviders: {
          items: [
            {
              name: 'hello',
              type: 'GithubIdentityProvider',
              id: 'id1',
            },
            {
              name: 'hi',
              type: 'GoogleIdentityProvider',
              id: 'id2',
            },
          ],
        },
        isLoading: false,
        isError: false,
      });
      const newProps = { ...props, isHypershift: true };
      const { container } = render(<IDPSection {...newProps} />);
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hi' })).toBeInTheDocument();
      expect(await screen.findByRole('cell', { name: 'hello' })).toBeInTheDocument();
      expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBe(0);
      await checkAccessibility(container);
    });
  });
});
