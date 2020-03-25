import React from 'react';
import { shallow } from 'enzyme';

import MonitoringListItem from '../components/MonitoringListItem';
import { mockOSDCluserDetails } from './Monitoring.fixtures';

describe('<MonitoringListItem />', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<MonitoringListItem cluster={mockOSDCluserDetails} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
