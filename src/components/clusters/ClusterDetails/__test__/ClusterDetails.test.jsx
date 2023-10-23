import { mount, shallow } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';
import { TestWrapper, mockRestrictedEnv, render, screen } from '../../../../testUtils';
import clusterStates from '../../common/clusterStates';
import ClusterDetails from '../ClusterDetails';
import fixtures, { funcs } from './ClusterDetails.fixtures';

describe('<ClusterDetails />', () => {
  // eslint-disable-next-line react/prop-types
  const RouterWrapper = ({ children }) => (
    <TestWrapper>
      <MemoryRouter keyLength={0} initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}>
        {children}
      </MemoryRouter>
    </TestWrapper>
  );

  describe('Cluster Details - OSD', () => {
    const functions = funcs();
    mount(
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
      const installingClusterWithIssuesProps = {
        ...fixtures,
        ...functions,
        clusterDetails: {
          ...fixtures.clusterDetails,
          cluster: { ...fixtures.clusterDetails.cluster, state: clusterStates.INSTALLING },
        },
        hasIssues: true,
      };

      const wrapper = mount(
        <RouterWrapper>
          <ClusterDetails
            {...fixtures}
            {...functions}
            hasIssues
            {...installingClusterWithIssuesProps}
          />
        </RouterWrapper>,
      );
      expect(wrapper.find('TabsRow').props().hasIssues).toBe(false);
    });
  });

  describe('OSD cluster support tab', () => {
    const functions = funcs();

    it('should present', () => {
      const wrapper = mount(
        <RouterWrapper>
          <ClusterDetails {...fixtures} {...functions} />
        </RouterWrapper>,
      );
      expect(wrapper.find('TabsRow').props().displaySupportTab).toBe(true);
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
      const wrapper = mount(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );
      expect(wrapper.find('TabsRow').props().displaySupportTab).toBe(false);
    });
  });

  describe('ARO cluster', () => {
    const functions = funcs();
    const props = {
      ...fixtures,
      ...functions,
      clusterDetails: { ...fixtures.AROClusterDetails },
    };
    const wrapper = mount(
      <RouterWrapper>
        <ClusterDetails {...props} />
      </RouterWrapper>,
    );

    it('should get on-demand metrics', () => {
      expect(functions.getOnDemandMetrics).toBeCalledWith(
        fixtures.AROClusterDetails.cluster.subscription.id,
      );
    });

    it('it should hide 1 tab', () => {
      expect(wrapper.find('TabsRow').props().displayMonitoringTab).toBe(false);
    });
  });

  describe('hypershift cluster', () => {
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
    shallow(<ClusterDetails {...props} />);

    it('should get node pools', () => {
      expect(functions.getMachineOrNodePools).toBeCalledWith(
        fixtures.ROSAClusterDetails.cluster.id,
        true,
      );
    });

    it('displays the network tab if private link is true', () => {
      const cluster = {
        state: clusterStates.READY,
        managed: true,
        cloud_provider: { id: 'aws' },
        ccs: { enabled: true },
        hypershift: { enabled: true },
        aws: { private_link: true },
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

      expect(screen.getByRole('tab', { name: 'Networking' })).toBeInTheDocument();
    });

    it('displays the network tab if private link is false', () => {
      const cluster = {
        state: clusterStates.READY,
        managed: true,
        cloud_provider: { id: 'aws' },
        ccs: { enabled: true },
        hypershift: { enabled: true },
        aws: { private_link: false },
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

      expect(screen.getByRole('tab', { name: 'Networking' })).toBeInTheDocument();
    });
  });

  describe('Loading', () => {
    const functions = funcs();
    const props = { ...fixtures, ...functions, match: { params: { id: '1234' } } };
    const wrapper = shallow(<ClusterDetails {...props} />);

    it('should render loading modal when pending', () => {
      expect(wrapper.find('.cluster-loading-container').length).toEqual(1);
    });
  });

  describe('Error', () => {
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
    const wrapper = shallow(<ClusterDetails {...props} />);

    it('should render error message', () => {
      expect(wrapper.find('Unavailable').length).toEqual(1);
    });

    it('should redirect back to cluster list and set global error on 404 error', () => {
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
      const wrapper404 = shallow(<ClusterDetails {...props404} />);

      expect(functions.setGlobalError).toBeCalled();
      expect(wrapper404.find('Redirect').length).toEqual(1);
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

    shallow(<ClusterDetails {...props} />);

    it('should not call get grants for gcp cluster', () => {
      expect(functions.getGrants).not.toBeCalled();
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
    const wrapper = mount(
      <RouterWrapper>
        <ClusterDetails {...props} />
      </RouterWrapper>,
    );
    it('should hide the support tab for OSDTrial cluster', () => {
      expect(wrapper.find('TabsRow').props().displaySupportTab).toBe(false);
    });
  });

  describe('tabs for Deprovisioned/Archived clusters', () => {
    const functions = funcs();
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
    const osdWrapper = mount(
      <RouterWrapper>
        <ClusterDetails {...osdProps} />
      </RouterWrapper>,
    );
    it('should show support tab for Deprovisioned clusters', () => {
      // show support tab with disabled buttons (refer to Support/Support.text.jsx)
      expect(osdWrapper.find('TabsRow').props().displaySupportTab).toBe(true);
      expect(osdWrapper.find('Connect(Support)').props().isDisabled).toBe(true);
    });
    it('should hide tabs for Deprovisioned clusters', () => {
      expect(osdWrapper.find('TabsRow').props().displayMonitoringTab).toBe(false);
      expect(osdWrapper.find('TabsRow').props().displayAccessControlTab).toBe(false);
      expect(osdWrapper.find('TabsRow').props().displayAddOnsTab).toBe(false);
      expect(osdWrapper.find('TabsRow').props().displayNetworkingTab).toBe(false);
      expect(osdWrapper.find('TabsRow').props().displayMachinePoolsTab).toBe(false);
      expect(osdWrapper.find('TabsRow').props().displayUpgradeSettingsTab).toBe(false);
      expect(ocpWrapper.find('TabsRow').props().addHostTabDetails.showTab).toBe(false);
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
    const ocpWrapper = mount(
      <RouterWrapper>
        <ClusterDetails {...ocpProps} />
      </RouterWrapper>,
    );
    it('should show support tab for Archived clusters', () => {
      // show support tab with disabled buttons (refer to Support/Support.text.jsx)
      expect(ocpWrapper.find('TabsRow').props().displaySupportTab).toBe(true);
      expect(ocpWrapper.find('Connect(Support)').props().isDisabled).toBe(true);
    });
    it('should hide tabs for Archived clusters', () => {
      expect(ocpWrapper.find('TabsRow').props().displayMonitoringTab).toBe(false);
      expect(ocpWrapper.find('TabsRow').props().displayAccessControlTab).toBe(false);
      expect(ocpWrapper.find('TabsRow').props().displayAddOnsTab).toBe(false);
      expect(ocpWrapper.find('TabsRow').props().displayNetworkingTab).toBe(false);
      expect(ocpWrapper.find('TabsRow').props().displayMachinePoolsTab).toBe(false);
      expect(ocpWrapper.find('TabsRow').props().displayUpgradeSettingsTab).toBe(false);
      expect(ocpWrapper.find('TabsRow').props().addHostTabDetails.showTab).toBe(false);
    });
  });

  describe('Restricted env details', () => {
    const isRestrictedEnv = mockRestrictedEnv();

    beforeEach(() => {
      isRestrictedEnv.mockReturnValue(true);
    });

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('hides tabs in restricted env', () => {
      const functions = funcs();
      const props = {
        ...fixtures,
        ...functions,
        clearFiltersAndFlags: () => {},
        clusterDetails: {
          ...fixtures.ROSAClusterDetails,
          cluster: {
            ...fixtures.ROSAClusterDetails.cluster,
            hypershift: { enabled: true },
            canEdit: true,
          },
        },
        isAROCluster: false,
        isArchived: false,
        displayClusterLogs: true,
      };
      render(
        <RouterWrapper>
          <ClusterDetails {...props} />
        </RouterWrapper>,
      );

      expect(screen.queryByRole('tab', { name: 'Monitoring' })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Add-ons' })).not.toBeInTheDocument();

      expect(screen.queryByRole('tab', { name: 'Support' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Settings' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Cluster history' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Access control' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Networking' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Machine pools' })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    });
  });
});
