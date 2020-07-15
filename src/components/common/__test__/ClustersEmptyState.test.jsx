import React from 'react';
import { shallow } from 'enzyme';

import ClustersEmptyState from '../ClustersEmptyState';

describe('<ClustersEmptyState />', () => {
  it('should render without register disconnected cluster button', () => {
    const wrapper = shallow(<ClustersEmptyState />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with register disconnected cluster button', () => {
    const wrapper = shallow(<ClustersEmptyState showRegisterCluster />);
    expect(wrapper).toMatchSnapshot();
  });
});
