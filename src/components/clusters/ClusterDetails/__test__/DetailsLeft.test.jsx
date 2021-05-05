import React from 'react';
import { shallow } from 'enzyme';

import DetailsLeft from '../components/Overview/DetailsLeft';
import fixtures from './ClusterDetails.fixtures';

describe('<DetailsLeft />', () => {
  const wrapper = shallow(
    <DetailsLeft
      cluster={fixtures.clusterDetails.cluster}
      cloudProviders={fixtures.cloudProviders}
    />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
