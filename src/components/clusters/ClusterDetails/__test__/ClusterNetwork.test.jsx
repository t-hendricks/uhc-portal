import React from 'react';
import { shallow } from 'enzyme';

import ClusterNetwork from '../components/Overview/ClusterNetwork';
import { clusterDetails, routerShards } from './ClusterDetails.fixtures';

describe('<ClusterNetwork />', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallow(
      <ClusterNetwork cluster={clusterDetails.cluster} routerShards={routerShards} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render router shards when they don\'t exist', () => {
    wrapper.setProps({ routerShards: {} }, () => {
      expect(wrapper.find('li').length).toEqual(0);
    });
  });
});
