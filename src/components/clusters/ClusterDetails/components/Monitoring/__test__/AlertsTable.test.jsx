import React from 'react';
import { shallow } from 'enzyme';

import AlertsTable from '../components/AlertsTable';
import { mockWatchdog, mockAlerts } from './Monitoring.fixtures';

describe('<AlertsTable />', () => {
  let wrapper;

  it('should render empty state when there are no alerts', () => {
    wrapper = shallow(<AlertsTable alerts={mockWatchdog} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render table when there are alerts', () => {
    wrapper = shallow(<AlertsTable alerts={mockAlerts.data} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render table with links there are alerts and a console URL', () => {
    wrapper = shallow(
      <AlertsTable clusterConsole={{ url: 'http://example.com/' }} alerts={mockAlerts.data} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
