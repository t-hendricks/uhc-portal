import React from 'react';
import { shallow } from 'enzyme';

import ClusterListEmptyState from '../ClusterListEmptyState';

describe('<ClusterListEmptyState />', () => {
  it('renders correctly with no quota', () => {
    const wrapper = shallow(<ClusterListEmptyState hasQuota={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with quota', () => {
    const wrapper = shallow(<ClusterListEmptyState hasQuota />);
    expect(wrapper).toMatchSnapshot();
  });
});
