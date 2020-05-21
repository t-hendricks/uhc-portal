import React from 'react';
import { shallow } from 'enzyme';
import { Tab } from '@patternfly/react-core';

import TabsRow from '../components/TabsRow';


describe('<TabsRow />', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    const mockRef = { current: null };
    props = {
      overviewTabRef: mockRef,
      accessControlTabRef: mockRef,
      monitoringTabRef: mockRef,
      addOnsTabRef: mockRef,
    };

    wrapper = shallow(
      <TabsRow {...props} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display access control tab, monitoring tab and add-ons tab', () => {
    wrapper.setProps({
      displayAccessControlTab: true, displayAddOnsTab: true,
    }, () => {
      expect(wrapper.find(Tab).length).toEqual(4);
    });
  });

  it('should hide monitoring and add-ons tabs if needed (eg. when we archive a cluster)', () => {
    wrapper.setProps({
      displayAccessControlTab: true,
      displayMonitoringTab: false,
      displayAddOnsTab: false,
    }, () => {
      expect(wrapper.find(Tab).length).toEqual(2);
    });
    wrapper = shallow(<TabsRow {...props} displayMonitoringTab={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
