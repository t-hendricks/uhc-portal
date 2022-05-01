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
      insightsTabRef: mockRef,
      machinePoolsTabRef: mockRef,
      networkingTabRef: mockRef,
      supportTabRef: mockRef,
      upgradeSettingsTabRef: mockRef,
      addAssistedTabRef: mockRef,
      hasIssues: false,
      setOpenedTab: jest.fn(),
      onTabSelected: jest.fn(),
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

  it('should render monitoring tab with issues icon', () => {
    wrapper.setProps({
      hasIssues: true,
    }, () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
