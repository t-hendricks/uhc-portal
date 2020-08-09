import React from 'react';
import { shallow } from 'enzyme';

import Monitoring from '../Monitoring';
import { monitoringStatuses } from '../monitoringHelper';

describe('<Monitoring />', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<Monitoring
      cluster={{}}
      alerts={{}}
      nodes={{}}
      operators={{}}
      lastCheckIn={new Date('2020-02-02')}
      healthStatus={monitoringStatuses.HEALTHY}
      discoveredIssues={0}
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
