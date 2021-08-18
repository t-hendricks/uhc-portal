import React from 'react';
import { shallow } from 'enzyme';

import MonitoringList from '../components/MonitoringList';

describe('<MonitoringList />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<MonitoringList />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
