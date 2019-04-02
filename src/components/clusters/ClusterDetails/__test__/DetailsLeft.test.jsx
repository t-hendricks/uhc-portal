import React from 'react';
import { shallow } from 'enzyme';

import DetailsLeft from '../components/DetailsLeft';
import { clusterDetails, cloudProviders } from './ClusterDetails.fixtures';

describe('<DetailsLeft />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <DetailsLeft cluster={clusterDetails.cluster} cloudProviders={cloudProviders} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
