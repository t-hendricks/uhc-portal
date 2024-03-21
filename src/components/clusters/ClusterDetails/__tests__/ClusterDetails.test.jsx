import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter, useParams } from 'react-router-dom-v5-compat';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';
import { render, screen } from '../../../../testUtils';
import clusterStates from '../../common/clusterStates';
import ClusterDetails from '../ClusterDetails';
import fixtures, { funcs } from './ClusterDetails.fixtures';

jest.mock('react-router-dom-v5-compat', () => ({
  ...jest.requireActual('react-router-dom-v5-compat'), // Preserve other exports from react-router-dom
  useParams: jest.fn(), // Mock useParams
}));

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
  describe('Cluster Details - OSD', () => {
    useParams.mockReturnValue({ id: '1msoogsgTLQ4PePjrTOt3UqvMzX' });
    const functions = funcs();
    render(
      <RouterWrapper>
        <ClusterDetails {...fixtures} {...functions} hasIssues />
      </RouterWrapper>,
    );

    it('should call clearGlobalError on mount', () => {
      expect(functions.clearGlobalError).toBeCalledWith('clusterDetails');
    });

    describe('fetches all relevant resources', () => {
      it('should call get grants for aws cluster', () => {
        expect(functions.getGrants).toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get IDPs', () => {
        expect(functions.getClusterIdentityProviders).toBeCalledWith(
          fixtures.clusterDetails.cluster.id,
        );
      });

      it('should get users', () => {
        expect(functions.getUsers).toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get cluster routers', () => {
        expect(functions.getClusterRouters).toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get cluster addons', () => {
        expect(functions.getClusterAddOns).toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get machine pools', () => {
        expect(functions.getMachineOrNodePools).toBeCalledWith(
          fixtures.clusterDetails.cluster.id,
          false,
          'openshift-v4.6.8',
          undefined,
        );
      });

      it('should get schedules', () => {
        expect(functions.getSchedules).toBeCalledWith(fixtures.clusterDetails.cluster.id, false);
      });

      it('should not get on-demand metrics', () => {
        expect(functions.getOnDemandMetrics).toHaveBeenCalledTimes(0);
      });
    });

    it('should not consider issues when cluster is installing', () => {
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

      render(
        <RouterWrapper>
          <ClusterDetails
            {...fixtures}
            {...functions}
            hasIssues
            {...installingClusterWithIssuesProps}
          />
        </RouterWrapper>,
      );
      expect(screen.queryByText('Monitoring')).toBe(null);
    });
  });

  describe('OSD cluster support tab', () => {
    const functions = funcs();

    it('should present', () => {
      render(
        <RouterWrapper>
          <ClusterDetails {...fixtures} {...functions} />
        </RouterWrapper>,
      );
      expect(screen.getByText('Support')).toBeVisible();
    });

    it('should be hidden when the (managed) cluster has not yet reported its cluster ID to AMS', () => {
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

      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );
      expect(screen.queryByText('Support')).toBe(null);
    });
  });

  describe('ARO cluster', () => {
    const functions = funcs();
    const props = {
      ...fixtures,
      ...functions,
      clusterDetails: { ...fixtures.AROClusterDetails },
    };

    render(
      <RouterWrapper>
        <ClusterDetails {...props} />
      </RouterWrapper>,
    );

    it('should get on-demand metrics', () => {
      expect(functions.getOnDemandMetrics).toBeCalledWith(
        fixtures.AROClusterDetails.cluster.subscription.id,
      );
    });

    it('it should hide 2 tabs', () => {
      expect(screen.queryByText('Monitoring')).toBe(null);
      expect(screen.queryByText('Settings')).toBe(null);
    });
  });

  describe('hypershift cluster', () => {
    it('should get node pools', () => {
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

      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      // Assuming `getMachineOrNodePools` is a function that should have been called on render
      expect(functions.getMachineOrNodePools).toBeCalledWith(
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
      it(description, () => {
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

        render(
          <RouterWrapper>
            <ClusterDetails {...props} />
          </RouterWrapper>,
        );

        // Assuming the network tab has a text or label identifiable to users, replace 'Network Tab' with it
        const networkTab = screen.getByText(/Networking/i); // Adjust based on actual UI
        expect(networkTab).toBeVisible(); // or `toBeInTheDocument` depending on what you're checking for
      });
    });
  });

  describe('Loading', () => {
    it('should render loading modal when pending', () => {
      useParams.mockReturnValue({ id: 'ABCDEFG' });
      const functions = funcs();
      const props = { ...fixtures, ...functions };
      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error', () => {
    it('should render error message', () => {
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
      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );
      expect(screen.getByText('This page is temporarily unavailable')).toBeInTheDocument();
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
      render(
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

    render(
      <RouterWrapper>
        <ClusterDetails {...props} />
      </RouterWrapper>,
    );

    it('should not call get grants for gcp cluster', () => {
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
    render(
      <RouterWrapper>
        <ClusterDetails {...props} />
      </RouterWrapper>,
    );
    it('should hide the support tab for OSDTrial cluster', () => {
      expect(screen.queryByText('Support')).toBe(null);
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

    it('should show support tab for Deprovisioned clusters', () => {
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
      render(
        <RouterWrapper>
          <ClusterDetails {...osdProps} />
        </RouterWrapper>,
      );
      // show support tab with disabled buttons (refer to Support/Support.text.jsx)
      const supportTab = screen.getByText('Support');
      expect(supportTab).toBeInTheDocument();
    });
    it('should hide tabs for Deprovisioned clusters', () => {
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

    it('should show support tab for Archived clusters', () => {
      render(
        <RouterWrapper>
          <ClusterDetails {...ocpProps} />
        </RouterWrapper>,
      );
      // show support tab with disabled buttons (refer to Support/Support.text.jsx)
      const supportTab = screen.getByRole('tab', { name: 'Support' });
      expect(supportTab).toBeInTheDocument();
      expect(supportTab).toHaveAttribute('aria-disabled', 'false');
    });
    it('should hide tabs for Archived clusters', () => {
      render(
        <RouterWrapper>
          <ClusterDetails {...ocpProps} />
        </RouterWrapper>,
      );
      tabs.forEach((tab) => expect(screen.queryByText(tab)).toBe(null));
    });
  });
});
