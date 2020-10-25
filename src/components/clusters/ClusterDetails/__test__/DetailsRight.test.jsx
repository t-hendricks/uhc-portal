import React from 'react';
import { shallow } from 'enzyme';

import DetailsRight from '../components/Overview/DetailsRight/DetailsRight';
import fixtures from './ClusterDetails.fixtures';

describe('<DetailsRight />', () => {
  const { clusterDetails } = fixtures;
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
      expect(wrapper.find('ClusterStateIcon').length).toEqual(0);
    });
  });
});
