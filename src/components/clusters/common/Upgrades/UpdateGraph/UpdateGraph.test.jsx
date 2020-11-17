import React from 'react';
import { shallow } from 'enzyme';

import UpdateGraph from './UpdateGraph';


describe('<Update graph />', () => {
  it('should render', () => {
    const wrapper = shallow(<UpdateGraph
      currentVersion="current version"
      updateVersion="next version"
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
