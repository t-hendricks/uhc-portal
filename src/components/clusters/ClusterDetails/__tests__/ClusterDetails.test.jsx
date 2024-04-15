import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter, useParams } from 'react-router-dom-v5-compat';

import { subscriptionStatuses } from '../../../../common/subscriptionTypes';
import { screen, waitFor, withState } from '../../../../testUtils';
import clusterStates from '../../common/clusterStates';
import ClusterDetails from '../ClusterDetails';

import fixtures, { funcs } from './ClusterDetails.fixtures';

jest.mock('../components/Overview/ClusterVersionInfo');

jest.mock('react-router-dom-v5-compat', () => ({
  ...jest.requireActual('react-router-dom-v5-compat'), // Preserve other exports from react-router-dom
  useParams: jest.fn(), // Mock useParams
}));

const waitForRender = async () => {
  await screen.findByText('Open console');
};

const creator = {
  id: '1VW00yfnFuhoybNRBqF86RyS2h6',
  kind: 'Account',
  href: '/api/accounts_mgmt/v1/accounts/1VW00yfnFuhoybNRBqF86RyS2h6',
  name: 'Liran Roitman',
  username: 'lroitman.openshift',
};

const initialState = {
  clusters: {
    details: {
      cluster: {
        id: '1i4counta3holamvo1g5tp6n8p3a03bq',
        canEdit: true,
        external_id: '9f50940b-fba8-4c59-9c6c-d64284b2026d',
        openshift_version: '4.6.8',
        subscription: { creator, plan: { type: 'OSD' }, id: '1msoogsgTLQ4PePjrTOt3UqvMzX' },
        metrics: {
          upgrade: {
            updated_timestamp: '2021-01-11T11:55:29Z',
            available: false,
            state: 'idle',
          },
          nodes: {
            total: 9,
            master: 3,
            infra: 2,
            compute: 4,
          },
        },
        node_drain_grace_period: {
          value: 60,
          unit: 'minutes',
        },
      },
    },
  },
};

describe('<ClusterDetails />', () => {
  // eslint-disable-next-line react/prop-types
  const RouterWrapper = ({ children }) => (
    <MemoryRouter keyLength={0} initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}>
      <CompatRouter>{children}</CompatRouter>
    </MemoryRouter>
  );

  // TODO: By testing presentation half ClusterDetails.jsx without index.js redux connect(),
  //   we mostly got away with passing fixtures by props without setting up redux state.
  //   However many sub-components mounted by mount() and render() do connect() to redux,
  //   and will see a different picture from what the top ClusterDetails sees...

  // Fixing this would mean that initialState (defined above) would need to match what is set
  // in the fixtures file

  describe('Cluster Details - OSD', () => {
    useParams.mockReturnValue({ id: '1msoogsgTLQ4PePjrTOt3UqvMzX' });
    const functions = funcs();

    it('should call clearGlobalError on mount', async () => {
      //  subscriptionID: tate.clusters.details.cluster.subscription?.id

      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...fixtures} {...functions} hasIssues />
        </RouterWrapper>,
      );

      await waitForRender();
      expect(functions.clearGlobalError).toHaveBeenCalledWith('clusterDetails');
    });

    describe('fetches all relevant resources', () => {
      it('should call get grants for aws cluster', async () => {
        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </RouterWrapper>,
        );

        await waitForRender();
        expect(functions.getGrants).toHaveBeenCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get IDPs', async () => {
        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </RouterWrapper>,
        );

        await waitForRender();
        expect(functions.getClusterIdentityProviders).toHaveBeenCalledWith(
          fixtures.clusterDetails.cluster.id,
        );
      });

      it('should get users', async () => {
        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </RouterWrapper>,
        );

        await waitForRender();
        expect(functions.getUsers).toHaveBeenCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get cluster routers', async () => {
        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </RouterWrapper>,
        );

        await waitForRender();

        expect(functions.getClusterRouters).toHaveBeenCalledWith(
          fixtures.clusterDetails.cluster.id,
        );
      });

      it('should get cluster addons', async () => {
        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </RouterWrapper>,
        );

        await waitForRender();
        expect(functions.getClusterAddOns).toHaveBeenCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get machine pools', async () => {
        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </RouterWrapper>,
        );

        await waitForRender();

        expect(functions.getMachineOrNodePools).toHaveBeenCalledWith(
          fixtures.clusterDetails.cluster.id,
          false,
          'openshift-v4.6.8',
          undefined,
        );
      });

      it('should get schedules', async () => {
        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </RouterWrapper>,
        );

        await waitForRender();
        expect(functions.getSchedules).toHaveBeenCalledWith(
          fixtures.clusterDetails.cluster.id,
          false,
        );
      });

      it('should not get on-demand metrics', async () => {
        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </RouterWrapper>,
        );

        await waitForRender();
        expect(functions.getOnDemandMetrics).toHaveBeenCalledTimes(0);
      });
    });

    it.skip('should not consider issues when cluster is installing', async () => {
      // This fails because the text "monitoring" is shown but as part of the UpgradeSettingsTab
      // What I think is the intention of this test is that the monitoring tab is not shown
      // but the actual intent is not known
      // skipping until further investigation is known

      useParams.mockReturnValue({ id: '1msoogsgTLQ4PePjrTOt3UqvMzX' });
      const installingClusterWithIssuesProps = {
        ...fixtures,
        ...functions,
        clusterDetails: {
          ...fixtures.clusterDetails,
          cluster: { ...fixtures.clusterDetails.cluster, state: clusterStates.INSTALLING },
        },
        hasIssues: true,
      };

      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails
            {...fixtures}
            {...functions}
            hasIssues
            {...installingClusterWithIssuesProps}
          />
        </RouterWrapper>,
      );

      await waitForRender();
      expect(screen.queryByText('Monitoring')).not.toBeInTheDocument();
    });
  });

  describe('OSD cluster support tab', () => {
    const functions = funcs();

    it('should present', async () => {
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...fixtures} {...functions} />
        </RouterWrapper>,
      );

      await waitForRender();
      expect(screen.getByRole('tab', { name: 'Support' })).toBeInTheDocument();
    });

    it('should be hidden when the (managed) cluster has not yet reported its cluster ID to AMS', async () => {
      const props = {
        ...fixtures,
        ...functions,
        clusterDetails: {
          ...fixtures.clusterDetails,
          cluster: {
            ...fixtures.clusterDetails.cluster,
            managed: true,
            subscription: {
              ...fixtures.clusterDetails.cluster.subscription,
              external_cluster_id: undefined,
            },
          },
        },
      };

      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      await waitForRender();
      expect(screen.queryByRole('tab', { name: 'Support' })).not.toBeInTheDocument();
    });
  });

  describe('ARO cluster', () => {
    const functions = funcs();
    const props = {
      ...fixtures,
      ...functions,
      clusterDetails: { ...fixtures.AROClusterDetails },
    };

    it('should get on-demand metrics', async () => {
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      await waitForRender();

      expect(functions.getOnDemandMetrics).toHaveBeenCalledWith(
        fixtures.AROClusterDetails.cluster.subscription.id,
      );
    });

    it('it should hide 2 tabs', async () => {
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      await waitForRender();
      expect(screen.queryByRole('tab', { name: 'Monitoring' })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Settings' })).not.toBeInTheDocument();
    });
  });

  describe('hypershift cluster', () => {
    it('should get node pools', async () => {
      const functions = funcs();
      const props = {
        ...fixtures,
        ...functions,
        clusterDetails: {
          ...fixtures.ROSAClusterDetails,
          cluster: {
            ...fixtures.ROSAClusterDetails.cluster,
            hypershift: { enabled: true },
          },
        },
      };

      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      await waitForRender();
      // Assuming `getMachineOrNodePools` is a function that should have been called on render
      expect(functions.getMachineOrNodePools).toHaveBeenCalledWith(
        fixtures.ROSAClusterDetails.cluster.id,
        true,
        'openshift-v4.6.8',
        undefined,
      );
    });

    const displayNetworkTabCases = [
      { privateLink: true, description: 'displays the network tab if private link is true' },
      { privateLink: false, description: 'displays the network tab if private link is false' },
    ];

    displayNetworkTabCases.forEach(({ privateLink, description }) => {
      it(description, async () => {
        const cluster = {
          state: clusterStates.READY,
          managed: true,
          cloud_provider: { id: 'aws' },
          ccs: { enabled: true },
          hypershift: { enabled: true },
          aws: { private_link: privateLink },
        };

        const functions = funcs();
        const props = {
          ...fixtures,
          ...functions,
          clearFiltersAndFlags: () => {},
          clusterDetails: {
            ...fixtures.ROSAClusterDetails,
            cluster: { ...fixtures.ROSAClusterDetails.cluster, cluster },
          },
        };

        withState(initialState, true).render(
          <RouterWrapper>
            <ClusterDetails {...props} />
          </RouterWrapper>,
        );

        await waitForRender();

        expect(screen.getByRole('tab', { name: /Networking/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading', () => {
    it('should render loading modal when pending', async () => {
      useParams.mockReturnValue({ id: 'ABCDEFG' });
      const functions = funcs();
      const props = { ...fixtures, ...functions };
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      expect(await screen.findByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error', () => {
    it('should render error message', async () => {
      const functions = funcs();
      const props = {
        ...fixtures,
        ...functions,
        clusterDetails: {
          ...fixtures.clusterDetails,
          error: true,
          cluster: undefined,
        },
      };
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      expect(await screen.findByText('This page is temporarily unavailable')).toBeInTheDocument();
    });

    it('should redirect back to cluster list and set global error on 404 error', async () => {
      const functions = funcs();
      const props404 = {
        ...fixtures,
        ...functions,
        clusterDetails: {
          ...fixtures.clusterDetails,
          error: true,
          errorMessage: 'This is an error message',
          errorCode: 404,
          cluster: undefined,
        },
      };
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props404} />
        </RouterWrapper>,
      );

      expect(functions.setGlobalError).toHaveBeenCalled();
    });
  });

  describe('gcp cluster details', () => {
    const functions = funcs();
    const props = {
      ...fixtures,
      ...functions,
      clusterDetails: {
        ...fixtures.clusterDetails,
        cluster: {
          ...fixtures.clusterDetails.cluster,
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
        },
      },
    };

    it('should not call get grants for gcp cluster', () => {
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      expect(functions.getGrants).not.toHaveBeenCalled();
    });
  });

  describe('tabs for OSDTrial clusters', () => {
    const functions = funcs();
    const props = {
      ...fixtures,
      ...functions,
      clusterDetails: {
        ...fixtures.clusterDetails,
        cluster: {
          ...fixtures.clusterDetails.cluster,
          canEdit: true,
          subscription: {
            ...fixtures.clusterDetails.cluster.subscription,
            status: subscriptionStatuses.ACTIVE,
            plan: {
              id: 'OSDTrial',
              kind: 'Plan',
              href: '/api/accounts_mgmt/v1/plans/OSD',
              type: 'OSDTrial',
            },
          },
        },
      },
    };
    // hide support tab for OSDTrial clusters regardless Deprovisioned/Archived or not

    it('should hide the support tab for OSDTrial cluster', () => {
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      expect(screen.queryByRole('tab', { name: 'Support' })).not.toBeInTheDocument();
    });
  });

  describe('tabs for Deprovisioned/Archived clusters', () => {
    const functions = funcs();
    const tabs = [
      'Monitoring',
      'Access Control',
      'Add-ons',
      'Networking',
      'Machine pools',
      'Settings',
    ];

    it('should show support tab for Deprovisioned clusters', async () => {
      useParams.mockReturnValue({ id: '1msoogsgTLQ4PePjrTOt3UqvMzX' });
      const osdProps = {
        ...fixtures,
        ...functions,
        clusterDetails: {
          ...fixtures.clusterDetails,
          cluster: {
            ...fixtures.clusterDetails.cluster,
            canEdit: true,
            subscription: {
              ...fixtures.clusterDetails.cluster.subscription,
              status: subscriptionStatuses.DEPROVISIONED,
            },
          },
        },
      };
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...osdProps} />
        </RouterWrapper>,
      );

      expect(await screen.findByRole('tab', { name: 'Support' })).toBeInTheDocument();
    });

    it.skip('should hide tabs for Deprovisioned clusters', () => {
      // TODO need to add render for this test
      tabs.forEach((tab) => expect(screen.queryByText(tab)).toBe(null));
    });

    const ocpProps = {
      ...fixtures,
      ...functions,
      assistedInstallerEnabled: true,
      clusterDetails: {
        ...fixtures.OCPClusterDetails,
        cluster: {
          ...fixtures.OCPClusterDetails.cluster,
          canEdit: true,
          subscription: {
            ...fixtures.OCPClusterDetails.cluster.subscription,
            status: subscriptionStatuses.ARCHIVED,
          },
          // together with assistedInstallerEnabled: true,
          // this set displayAddAssistedHosts to true if not Archived
          cloud_provider: {
            kind: 'CloudProvider',
            id: 'baremetal',
            href: '/api/clusters_mgmt/v1/cloud_providers/baremetal',
          },
        },
      },
    };

    it('should show support tab for Archived clusters', async () => {
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...ocpProps} />
        </RouterWrapper>,
      );
      // show support tab with disabled buttons (refer to Support/Support.text.jsx)
      const supportTab = await screen.findByRole('tab', { name: 'Support' });
      expect(supportTab).toBeInTheDocument();
      expect(supportTab).toHaveAttribute('aria-disabled', 'false');
    });

    it('should hide tabs for Archived clusters', async () => {
      withState(initialState, true).render(
        <RouterWrapper>
          <ClusterDetails {...ocpProps} />
        </RouterWrapper>,
      );

      tabs.forEach(async (tab) => {
        await waitFor(() => {
          expect(screen.queryByText(tab)).not.toBeInTheDocument();
        });
      });
    });
  });
});
