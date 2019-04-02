import React from 'react';
import { shallow } from 'enzyme';

import ResourceUsage from '../components/ResourceUsage/ResourceUsage';
import { clusterDetails } from './ClusterDetails.fixtures';

describe('<ResourceUsage />', () => {
  const { cluster } = clusterDetails;
  it('should render', () => {
    cluster.cpu.updated_timestamp = Date.now();
    const wrapper = shallow(<ResourceUsage cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render status message when metrics are not available', () => {
    cluster.cpu.updated_timestamp = new Date(0);
    const wrapper = shallow(<ResourceUsage cluster={clusterDetails.cluster} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('p').length).toEqual(1);
  });
});
