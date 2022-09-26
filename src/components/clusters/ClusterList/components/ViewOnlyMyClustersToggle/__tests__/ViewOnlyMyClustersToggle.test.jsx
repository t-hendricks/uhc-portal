import React from 'react';
import { shallow } from 'enzyme';

import ViewOnlyMyClustersToggle from '../ViewOnlyMyClustersToggle';

const fakeOnShowClusters = () => {};

describe('ViewOnlyMyClustersToggle', () => {
  it('renders default state correctly', () => {
    const wrapper = shallow(<ViewOnlyMyClustersToggle onChange={fakeOnShowClusters} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders selected state correctly', () => {
    const wrapper = shallow(<ViewOnlyMyClustersToggle isChecked onChange={fakeOnShowClusters} />);
    expect(wrapper).toMatchSnapshot();
  });
});
