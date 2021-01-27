import React from 'react';
import { shallow } from 'enzyme';

import DetailsRight from '../components/Overview/DetailsRight/DetailsRight';
import fixtures from './ClusterDetails.fixtures';
import { getClusterStateAndDescription } from '../../common/clusterStates';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';

describe('<DetailsRight />', () => {
  let { clusterDetails } = fixtures;
  clusterDetails = {
    ...clusterDetails,
    cluster: {
      ...clusterDetails.cluster,
      state: getClusterStateAndDescription(clusterDetails.cluster),
    },
  };

  it('should render', () => {
    const wrapper = shallow(
      <DetailsRight
        cluster={clusterDetails.cluster}
        totalDesiredComputeNodes={clusterDetails.cluster.nodes.compute}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('Self Managed cluster', () => {
    it('should not render desired nodes when they don\'t exist', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{ ...clusterDetails.cluster, managed: false, nodes: null }}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render status correctly for archived cluster', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{ ...clusterDetails.cluster, managed: false, subscription: { status: 'Archived' } }}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render status correctly for deprovisioned cluster', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{ ...clusterDetails.cluster, managed: true, subscription: { status: 'Deprovisioned' } }}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render vcpu and memory for disconnected clusters', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{
            ...clusterDetails.cluster,
            subscription: { status: subscriptionStatuses.DISCONNECTED },
            managed: false,
            nodes: null,
          }}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('CCS clusters', () => {
    it('should not render storage quota', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{
            ...clusterDetails.cluster, managed: true, byoc: true, storage_quota: null,
          }}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
