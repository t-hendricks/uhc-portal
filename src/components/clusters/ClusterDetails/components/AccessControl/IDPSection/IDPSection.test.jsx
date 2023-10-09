import React from 'react';
import { screen, render, checkAccessibility } from '@testUtils';
import IDPSection from './IDPSection';

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
  idpActions: {
    list: true,
  },
  clusterID: 'fake id',
  subscriptionID: 'fake sub',
  identityProviders: baseIDPs,
  clusterHibernating: false,
  isReadOnly: false,
  isHypershift: false,
  openModal,
  clusterUrls,
};

describe('<IDPSection />', () => {
  it('should render (no IDPs)', async () => {
    const { container } = render(<IDPSection {...props} />);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.pf-c-skeleton').length).toBe(0);
    await checkAccessibility(container);
  });

  it('should render (IDPs pending)', async () => {
    const IDPs = {
      ...baseIDPs,
      pending: true,
      fulfilled: false,
    };

    const newProps = { ...props, identityProviders: IDPs };
    const { container } = render(<IDPSection {...newProps} />);
    expect(container.querySelectorAll('.pf-c-skeleton').length).toBeGreaterThan(0);
    await checkAccessibility(container);
  });

  describe('should render (with IDPs)', () => {
    const IDPs = {
      ...baseIDPs,
      clusterIDPList: [
        {
          name: 'hello',
          type: 'GithubIdentityProvider',
          id: 'id',
        },
        {
          name: 'hi',
          type: 'GoogleIdentityProvider',
          id: 'id',
        },
      ],
      fulfilled: true,
    };

    it('non-Hypershift cluster', async () => {
      const newProps = { ...props, identityProviders: IDPs };
      const { container } = render(<IDPSection {...newProps} />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'hi' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'hello' })).toBeInTheDocument();
      expect(container.querySelectorAll('.pf-c-skeleton').length).toBe(0);
      await checkAccessibility(container);
    });

    it('Hypershift cluster', async () => {
      const newProps = { ...props, identityProviders: IDPs, isHypershift: true };
      const { container } = render(<IDPSection {...newProps} />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'hi' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'hello' })).toBeInTheDocument();
      expect(container.querySelectorAll('.pf-c-skeleton').length).toBe(0);
      await checkAccessibility(container);
    });
  });
});
