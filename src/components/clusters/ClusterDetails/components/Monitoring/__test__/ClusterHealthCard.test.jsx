import React from 'react';
import { shallow } from 'enzyme';
import { monitoringStatuses } from '../monitoringHelper';
import ClusterHealthCard from '../components/ClusterHealthCard';

describe('<ClusterHealthCard />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ClusterHealthCard />);
  });

  it('should render correctly with every health status', () => {
    Object.keys(monitoringStatuses).forEach((status) => {
      wrapper.setProps({
        healthStatus: monitoringStatuses[status],
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
