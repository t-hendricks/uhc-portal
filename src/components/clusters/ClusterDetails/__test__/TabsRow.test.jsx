import React from 'react';
import { shallow } from 'enzyme';

import TabsRow from '../components/TabsRow';

describe('<TabsRow />', () => {
  let wrapper;
  beforeEach(() => {
    const mockRef = { current: null };
    const props = { overviewTabRef: mockRef, usersTabRef: mockRef, logsTabRef: mockRef };

    wrapper = shallow(
      <TabsRow {...props} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display users tab and logs tab', () => {
    wrapper.setProps({ displayLogs: true, displayUsersTab: true }, () => {
      expect(wrapper.find('ForwardRef').length).toEqual(4);
    });
  });
});
