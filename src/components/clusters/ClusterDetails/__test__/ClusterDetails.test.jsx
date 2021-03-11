import React from 'react';
import { shallow } from 'enzyme';

import ClusterDetails from '../ClusterDetails';
import fixtures, { funcs } from './ClusterDetails.fixtures';
import clusterStates from '../../common/clusterStates';

describe('<ClusterDetails />', () => {
  describe('Cluster Details - OSD', () => {
    const functions = funcs();
    const wrapper = shallow(<ClusterDetails {...fixtures} {...functions} hasIssues />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should call clearGlobalError on mount', () => {
      expect(functions.clearGlobalError).toBeCalledWith('clusterDetails');
    });

    describe('fetches all relevant resources', () => {
      it('should call get grants for aws cluster', () => {
        expect(functions.getGrants).toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get IDPs', () => {
        expect(functions.getClusterIdentityProviders)
          .toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get users', () => {
        expect(functions.getUsers)
          .toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get cluster routers', () => {
        expect(functions.getClusterRouters)
          .toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get cluster addons', () => {
        expect(functions.getClusterAddOns)
          .toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get machine pools', () => {
        expect(functions.getMachinePools)
          .toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should get schedules', () => {
        expect(functions.getSchedules)
          .toBeCalledWith(fixtures.clusterDetails.cluster.id);
      });

      it('should not get alerts', () => {
        expect(functions.getAlerts).toHaveBeenCalledTimes(0);
      });

      it('should not get nodes', () => {
        expect(functions.getNodes).toHaveBeenCalledTimes(0);
      });

      it('should not get cluster operators', () => {
        expect(functions.getClusterOperators).toHaveBeenCalledTimes(0);
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

      wrapper.setProps(installingClusterWithIssuesProps);
      expect(wrapper.find('TabsRow').props().hasIssues).toBe(false);
    });
  });


  describe('OCP cluster', () => {
    const functions = funcs();
    const props = { ...fixtures, ...functions, clusterDetails: { ...fixtures.OCPClusterDetails } };
    shallow(<ClusterDetails {...props} />);

    it('should get alerts', () => {
      expect(functions.getAlerts)
        .toBeCalledWith(fixtures.OCPClusterDetails.cluster.id);
    });

    it('should get nodes', () => {
      expect(functions.getNodes)
        .toBeCalledWith(fixtures.OCPClusterDetails.cluster.id);
    });

    it('should get cluster operators', () => {
      expect(functions.getClusterOperators)
        .toBeCalledWith(fixtures.OCPClusterDetails.cluster.id);
    });
  });

  describe('ARO cluster', () => {
    const functions = funcs();
    const props = {
      ...fixtures,
      ...functions,
      clusterDetails: { ...fixtures.AROClusterDetails },
    };
    const wrapper = shallow(<ClusterDetails {...props} />);

    it('should get alerts', () => {
      expect(functions.getAlerts)
        .toBeCalledWith(fixtures.AROClusterDetails.cluster.id);
    });

    it('should get nodes', () => {
      expect(functions.getNodes)
        .toBeCalledWith(fixtures.AROClusterDetails.cluster.id);
    });

    it('should get cluster operators', () => {
      expect(functions.getClusterOperators)
        .toBeCalledWith(fixtures.AROClusterDetails.cluster.id);
    });

    it('it should hide 2 tabs', () => {
      expect(wrapper.find('TabsRow').props().displayMonitoringTab).toBe(false);
      expect(wrapper.find('TabsRow').props().displayInsightsTab).toBe(false);
    });
  });


  describe('Loading', () => {
    const functions = funcs();
    const props = { ...fixtures, ...functions, match: { params: { id: '1234' } } };
    const wrapper = shallow(<ClusterDetails {...props} />);

    it('should render loading modal when pending', () => {
      expect(wrapper).toMatchSnapshot();
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
      expect(wrapper).toMatchSnapshot();
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
});
