import React from 'react';
import { shallow } from 'enzyme';

import MonitoringListItem from '../components/MonitoringListItem';

describe('<MonitoringListItem />', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<MonitoringListItem />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
