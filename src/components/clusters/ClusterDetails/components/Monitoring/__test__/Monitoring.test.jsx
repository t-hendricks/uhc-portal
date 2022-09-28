import React from 'react';
import { shallow } from 'enzyme';

import Monitoring from '../Monitoring';
import { monitoringStatuses } from '../monitoringHelper';

describe('<Monitoring />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Monitoring
        cluster={{}}
        alerts={{}}
        nodes={{}}
        operators={{}}
        lastCheckIn={new Date('2020-02-02')}
        discoveredIssues={0}
      />,
    );
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
