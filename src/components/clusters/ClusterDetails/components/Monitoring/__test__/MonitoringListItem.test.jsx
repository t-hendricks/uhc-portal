import React from 'react';
import { shallow } from 'enzyme';

import MonitoringListItem from '../components/MonitoringListItem';
import { mockOCPActiveClusterDetails } from './Monitoring.fixtures';

describe('<MonitoringListItem />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<MonitoringListItem cluster={mockOCPActiveClusterDetails} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
