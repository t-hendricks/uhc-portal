import React from 'react';
import { shallow } from 'enzyme';

import TabsRow from '../components/TabsRow';


describe('<TabsRow />', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    const mockRef = { current: null };
    props = {
      overviewTabRef: mockRef,
      usersTabRef: mockRef,
      logsTabRef: mockRef,
      monitoringTabRef: mockRef,
    };

    wrapper = shallow(
      <TabsRow {...props} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display users tab, monitoring tab and logs tab', () => {
    wrapper.setProps({ displayLogs: true, displayUsersTab: true }, () => {
      expect(wrapper.find('ForwardRef').length).toEqual(4);
    });
  });

  it('should hide monitoring tab if needed (eg. when we archive a cluster)', () => {
    wrapper.setProps({
      displayLogs: true,
      displayUsersTab: true,
      displayMonitoringTab: false,
    }, () => {
      expect(wrapper.find('ForwardRef').length).toEqual(3);
    });
    wrapper = shallow(<TabsRow {...props} displayMonitoringTab={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
