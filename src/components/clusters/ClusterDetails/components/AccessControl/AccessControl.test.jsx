import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testUtils';

import { normalizedProducts } from '~/common/subscriptionTypes';

import AccessControl from './AccessControl';

const buildCluster = ({ clusterProps, subscriptionProps, consoleUrl, apiUrl }) => ({
  canEdit: true,
  id: 'clusterId',
  cloud_provider: { id: 'azure' },
  subscription: {
    id: 'subscriptionId',
    ...subscriptionProps,
  },
  managed: true,
  state: 'ready',
  console: {
    url:
      consoleUrl === undefined ? 'https://console-openshift-console.apps.example.com' : consoleUrl,
  },
  api: { url: apiUrl === undefined ? 'https://api.test-liza.wiex.s1.devshift.org:6443' : apiUrl },
  ...clusterProps,
});

describe('<AccessControl />', () => {
  const buildComponent = (cluster) => (
    <MemoryRouter>
      <AccessControl cluster={cluster || buildCluster({})} />
    </MemoryRouter>
  );

  describe('Tab grouping', () => {
    it('has "single-tab" class if only one section is shown', () => {
      const singleTabCluster = buildCluster({
        clusterProps: {
          managed: false,
        },
      });
      render(buildComponent(singleTabCluster));

      const cardBody = document.querySelector('.pf-c-card__body');
      expect(cardBody.classList).toContain('single-tab');
      expect(screen.getAllByRole('tab')).toHaveLength(1);
    });

    it('does not have "single-tab" class if multiple tabs are shown', () => {
      const multipleTabCluster = buildCluster({
        clusterProps: {
          managed: true,
        },
      });
      render(buildComponent(multipleTabCluster));

      const cardBody = document.querySelector('.pf-c-card__body');
      expect(cardBody.classList).not.toContain('single-tab');
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });
  });

  describe('Identity Provider section', () => {
    it('is not shown for OSD/ROSA clusters before they have console URL', () => {
      const osdCluster = buildCluster({
        consoleUrl: '',
      });
      render(buildComponent(osdCluster));

      expect(screen.queryByRole('tab', { name: 'Identity providers' })).not.toBeInTheDocument();
    });

    it('is shown for OSD/ROSA clusters after they have console URL', () => {
      render(buildComponent());

      expect(
        screen.getByRole('tab', { name: 'Identity providers', selected: true }),
      ).toBeInTheDocument();
    });

    it('is shown for Hypershift clusters even before they have console URL', () => {
      const hypershiftCluster = buildCluster({
        clusterProps: {
          hypershift: { enabled: true },
        },
        subscriptionProps: {
          plan: { id: normalizedProducts.ROSA_HyperShift },
        },
        consoleUrl: '',
      });

      render(buildComponent(hypershiftCluster));
      expect(
        screen.getByRole('tab', { name: 'Identity providers', selected: true }),
      ).toBeInTheDocument();
    });
  });
});
