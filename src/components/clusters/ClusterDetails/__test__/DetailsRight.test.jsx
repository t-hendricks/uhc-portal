import React from 'react';
import { shallow } from 'enzyme';

import DetailsRight from '../components/Overview/DetailsRight';
import { clusterDetails, routerShards } from './ClusterDetails.fixtures';

describe('<DetailsRight />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <DetailsRight
        cluster={clusterDetails.cluster}
        routerShards={routerShards}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('Self Managed cluster', () => {
    it('should not render desired nodes when they don\'t exist', () => {
      const wrapper = shallow(
        <DetailsRight
          cluster={{ ...clusterDetails.cluster, managed: false, nodes: null }}
          routerShards={routerShards}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
