import { mount, shallow } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';
import { withState } from '../../../../testUtils';
import clusterStates from '../../common/clusterStates';
import ClusterDetails from '../ClusterDetails';
import fixtures, { funcs } from './ClusterDetails.fixtures';

jest.mock('../components/TabsRow/TabsRow', () => (props) => (
  <div className="tabsrowclassname" {...props}>
    TabsRow
  </div>
));

jest.mock('../components/UpgradeSettings/UpgradeSettingsTab', () => () => <div />);
jest.mock('../components/Overview/ClusterVersionInfo', () => () => <div />);
jest.mock('../components/MachinePools', () => () => <div />);
jest.mock('../components/AddOns', () => () => <div />);
// to avoid "React does not recognize the `isDisabled` prop on a DOM element" warning
// eslint-disable-next-line react/prop-types
jest.mock('../components/Support', () => ({ isDisabled, ...props }) => (
  <div data-testid="support" disabled={isDisabled} {...props} />
));
jest.mock('../components/ClusterLogs/ClusterLogs', () => () => <div />);
jest.mock('../components/AccessControl/AccessControl', () => () => <div />);
jest.mock('../components/Support/components/AddNotificationContactDialog', () => (props) => (
  <div {...props} />
));
describe('<ClusterDetails />', () => {
  // eslint-disable-next-line react/prop-types
  const RouterWrapper = ({ children }) => (
    <MemoryRouter keyLength={0} initialEntries={[{ pathname: '/details/s/:id', key: 'testKey' }]}>
      {children}
    </MemoryRouter>
  );

  // TODO: By testing presentation half ClusterDetails.jsx without index.js redux connect(),
  //   we mostly got away with passing fixtures by props without setting up redux state.
  //   However many sub-components mounted by mount() and render() do connect() to redux,
  //   and will see a different picture from what the top ClusterDetails sees...
  describe('Cluster Details - OSD', () => {
    const functions = funcs();
    const { Wrapper } = withState({});
    mount(
      <Wrapper>
        <RouterWrapper>
          <CompatRouter>
            <ClusterDetails {...fixtures} {...functions} hasIssues />
          </CompatRouter>
        </RouterWrapper>
      </Wrapper>,
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
      const installingClusterWithIssuesProps = {
        ...fixtures,
        ...functions,
        clusterDetails: {
          ...fixtures.clusterDetails,
          cluster: { ...fixtures.clusterDetails.cluster, state: clusterStates.INSTALLING },
        },
        hasIssues: true,
      };

      const { Wrapper } = withState({});
      const wrapper = mount(
        <Wrapper>
          <RouterWrapper>
            <CompatRouter>
              <ClusterDetails
                {...fixtures}
                {...functions}
                hasIssues
                {...installingClusterWithIssuesProps}
              />
            </CompatRouter>
          </RouterWrapper>
        </Wrapper>,
      );
      expect(wrapper.find('.tabsrowclassname').props().tabsInfo.monitoring.hasIssues).toBe(false);
    });
  });

  describe('OSD cluster support tab', () => {
    const functions = funcs();

    it('should present', () => {
      const { Wrapper } = withState({});
      const wrapper = mount(
        <Wrapper>
          <RouterWrapper>
            <CompatRouter>
              <ClusterDetails {...fixtures} {...functions} />
            </CompatRouter>
          </RouterWrapper>
        </Wrapper>,
      );
      expect(wrapper.find('.tabsrowclassname').props().tabsInfo.support.show).toBe(true);
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
      const { Wrapper } = withState({});
      const wrapper = mount(
        <Wrapper>
          <RouterWrapper>
            <CompatRouter>
              <ClusterDetails {...props} />
            </CompatRouter>
          </RouterWrapper>
        </Wrapper>,
      );
      expect(wrapper.find('.tabsrowclassname').props().tabsInfo.support.show).toBe(false);
    });
  });

  describe('ARO cluster', () => {
    const functions = funcs();
    const props = {
      ...fixtures,
      ...functions,
      clusterDetails: { ...fixtures.AROClusterDetails },
    };
    const { Wrapper } = withState({});
    const wrapper = mount(
      <Wrapper>
        <RouterWrapper>
          <CompatRouter>
            <ClusterDetails {...props} />
          </CompatRouter>
        </RouterWrapper>
      </Wrapper>,
    );

    it('should get on-demand metrics', () => {
      expect(functions.getOnDemandMetrics).toBeCalledWith(
        fixtures.AROClusterDetails.cluster.subscription.id,
      );
    });

    it('it should hide 1 tab', () => {
      expect(wrapper.find('.tabsrowclassname').props().tabsInfo.monitoring.show).toBe(false);
    });
  });

  describe('hypershift cluster', () => {
    const { Wrapper } = withState({});

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
        'openshift-v4.6.8',
        undefined,
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

      const wrapper = mount(
        <Wrapper>
          <RouterWrapper>
            <CompatRouter>
              <ClusterDetails {...props} />
            </CompatRouter>
          </RouterWrapper>
        </Wrapper>,
      );

      expect(wrapper.find('.tabsrowclassname').props().tabsInfo.networking.show).toBe(true);
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

      const wrapper = mount(
        <Wrapper>
          <RouterWrapper>
            <CompatRouter>
              <ClusterDetails {...props} />
            </CompatRouter>
          </RouterWrapper>
        </Wrapper>,
      );

      expect(wrapper.find('.tabsrowclassname').props().tabsInfo.networking.show).toBe(true);
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
    const { Wrapper } = withState({});
    const wrapper = mount(
      <Wrapper>
        <RouterWrapper>
          <CompatRouter>
            <ClusterDetails {...props} />
          </CompatRouter>
        </RouterWrapper>
      </Wrapper>,
    );
    it('should hide the support tab for OSDTrial cluster', () => {
      expect(wrapper.find('.tabsrowclassname').props().tabsInfo.support.show).toBe(false);
    });
  });

  describe('tabs for Deprovisioned/Archived clusters', () => {
    const functions = funcs();
    const { Wrapper } = withState({});

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
      <Wrapper>
        <RouterWrapper>
          <CompatRouter>
            <ClusterDetails {...osdProps} />
          </CompatRouter>
        </RouterWrapper>
      </Wrapper>,
    );
    it('should show support tab for Deprovisioned clusters', () => {
      // show support tab with disabled buttons (refer to Support/Support.text.jsx)
      expect(osdWrapper.find('.tabsrowclassname').props().tabsInfo.support.show).toBe(true);
      expect(osdWrapper.find({ 'data-testid': 'support' }).props().disabled).toBe(true);
    });
    it('should hide tabs for Deprovisioned clusters', () => {
      expect(osdWrapper.find('.tabsrowclassname').props().tabsInfo.monitoring.show).toBe(false);
      expect(osdWrapper.find('.tabsrowclassname').props().tabsInfo.accessControl.show).toBe(false);
      expect(osdWrapper.find('.tabsrowclassname').props().tabsInfo.addOns.show).toBe(false);
      expect(osdWrapper.find('.tabsrowclassname').props().tabsInfo.networking.show).toBe(false);
      expect(osdWrapper.find('.tabsrowclassname').props().tabsInfo.machinePools.show).toBe(false);
      expect(osdWrapper.find('.tabsrowclassname').props().tabsInfo.upgradeSettings.show).toBe(
        false,
      );
      expect(osdWrapper.find('.tabsrowclassname').props().tabsInfo.addAssisted.show).toBe(false);
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
      <Wrapper>
        <RouterWrapper>
          <CompatRouter>
            <ClusterDetails {...ocpProps} />
          </CompatRouter>
        </RouterWrapper>
      </Wrapper>,
    );
    it('should show support tab for Archived clusters', () => {
      // show support tab with disabled buttons (refer to Support/Support.text.jsx)
      expect(ocpWrapper.find('.tabsrowclassname').props().tabsInfo.support.show).toBe(true);
      expect(osdWrapper.find({ 'data-testid': 'support' }).props().disabled).toBe(true);
    });
    it('should hide tabs for Archived clusters', () => {
      expect(ocpWrapper.find('.tabsrowclassname').props().tabsInfo.monitoring.show).toBe(false);
      expect(ocpWrapper.find('.tabsrowclassname').props().tabsInfo.accessControl.show).toBe(false);
      expect(ocpWrapper.find('.tabsrowclassname').props().tabsInfo.addOns.show).toBe(false);
      expect(ocpWrapper.find('.tabsrowclassname').props().tabsInfo.networking.show).toBe(false);
      expect(ocpWrapper.find('.tabsrowclassname').props().tabsInfo.machinePools.show).toBe(false);
      expect(ocpWrapper.find('.tabsrowclassname').props().tabsInfo.upgradeSettings.show).toBe(
        false,
      );
      expect(ocpWrapper.find('.tabsrowclassname').props().tabsInfo.addAssisted.show).toBe(false);
    });
  });
});
