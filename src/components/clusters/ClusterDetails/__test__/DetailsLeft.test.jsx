import React from 'react';
import { shallow } from 'enzyme';

import DetailsLeft from '../components/Overview/DetailsLeft';
import { clusterDetails, cloudProviders } from './ClusterDetails.fixtures';

describe('<DetailsLeft />', () => {
  const wrapper = shallow(
    <DetailsLeft cluster={clusterDetails.cluster} cloudProviders={cloudProviders} />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
