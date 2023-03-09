import React from 'react';
import { shallow } from 'enzyme';

import DetailsRight from '../components/Overview/DetailsRight/DetailsRight';
import fixtures from './ClusterDetails.fixtures';
import { getClusterStateAndDescription } from '../../common/clusterStates';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';
import { screen, render } from '~/testUtils';

describe('<DetailsRight />', () => {
  let { clusterDetails } = fixtures;
  clusterDetails = {
    ...clusterDetails,
    cluster: {
      ...clusterDetails.cluster,
      state: getClusterStateAndDescription(clusterDetails.cluster),
    },
  };

  it('should render when autoscale disabled', () => {
    const wrapper = shallow(
      <DetailsRight
        cluster={clusterDetails.cluster}
        totalDesiredComputeNodes={clusterDetails.cluster.nodes.compute}
        autoscaleEnabled={false}
        totalActualNodes={clusterDetails.cluster.metrics.nodes.compute}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when autoscale enabled', () => {
    const wrapper = shallow(
      <DetailsRight
        cluster={clusterDetails.cluster}
        totalDesiredComputeNodes={clusterDetails.cluster.nodes.compute}
        autoscaleEnabled
        totalMinNodesCount={2}
        totalMaxNodesCount={4}
        totalActualNodes={clusterDetails.cluster.metrics.nodes.compute}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('Self Managed cluster', () => {
    it("should not render desired nodes when they don't exist", () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{ ...clusterDetails.cluster, managed: false, nodes: null }}
          autoscaleEnabled={false}
          totalActualNodes={clusterDetails.cluster.metrics.nodes.compute}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render status correctly for archived cluster', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{
            ...clusterDetails.cluster,
            managed: false,
            subscription: { status: 'Archived' },
          }}
          autoscaleEnabled={false}
          totalActualNodes={clusterDetails.cluster.metrics.nodes.compute}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render status correctly for deprovisioned cluster', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{
            ...clusterDetails.cluster,
            managed: true,
            subscription: { status: 'Deprovisioned' },
          }}
          autoscaleEnabled={false}
          totalActualNodes={clusterDetails.cluster.metrics.nodes.compute}
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
          autoscaleEnabled={false}
          totalActualNodes={clusterDetails.cluster.metrics.nodes.compute}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('AWS Account', () => {
    it('should not be rendered for OSD clusters', () => {
      render(
        <DetailsRight
          cluster={clusterDetails.cluster}
          cloudProviders={fixtures.cloudProviders}
          autoscaleEnabled={false}
        />,
      );
      expect(screen.queryByTestId('aws-account')).not.toBeInTheDocument();
    });

    it('should be rendered for ROSA / Hypershift ROSA clusters', () => {
      render(
        <DetailsRight
          cluster={fixtures.ROSAManualClusterDetails.cluster}
          cloudProviders={fixtures.cloudProviders}
          autoscaleEnabled={false}
        />,
      );
      const awsElem = screen.getByTestId('aws-account');
      expect(awsElem).toContainHTML('Infrastructure AWS account');
      expect(awsElem).toContainHTML('123456789012');
    });
  });

  describe('CCS clusters', () => {
    it('should not render storage quota', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{
            ...clusterDetails.cluster,
            managed: true,
            ccs: { enabled: true },
            storage_quota: null,
          }}
          autoscaleEnabled={false}
          totalActualNodes={clusterDetails.cluster.metrics.nodes.compute}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('AI clusters', () => {
    it('should render the "created at" and "owner" detail', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={fixtures.AIClusterDetails.cluster}
          totalActualNodes={fixtures.AIClusterDetails.cluster.metrics.nodes.compute}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
