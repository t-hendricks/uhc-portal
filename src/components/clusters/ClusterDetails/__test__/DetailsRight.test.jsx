import React from 'react';
import { shallow } from 'enzyme';

import DetailsRight from '../components/Overview/DetailsRight';
import { clusterDetails, routerShards } from './ClusterDetails.fixtures';

describe('<DetailsRight />', () => {
  const wrapper = shallow(
    <DetailsRight cluster={clusterDetails.cluster} routerShards={routerShards} />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
