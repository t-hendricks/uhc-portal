import React from 'react';
import { shallow } from 'enzyme';

import UninstallProgress from './UninstallProgress';

import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';
import { mockAddOns, mockClusterAddOnsWithExternalResources } from '../../ClusterDetails/components/AddOns/__test__/AddOns.fixtures';
import AddOnsConstants from '../../ClusterDetails/components/AddOns/AddOnsConstants';

describe('<UninstallProgress />', () => {
  let wrapper;
  const getClusterAddOns = jest.fn();

  const { clusterDetails } = fixtures;

  beforeEach(() => {
    wrapper = shallow(<UninstallProgress
      cluster={clusterDetails.cluster}
      getClusterAddOns={getClusterAddOns}
      addOns={mockAddOns}
      clusterAddOns={mockClusterAddOnsWithExternalResources}
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should be pending when an addon is ready', () => {
    const DescriptionList = wrapper.find('DescriptionList').props();
    expect(DescriptionList.children[0].props.children[1].props.children[1]).toEqual('Pending');
  });

  it('should be removing add-ons when an addon is deleting', () => {
    mockClusterAddOnsWithExternalResources.items[0].state = AddOnsConstants
      .INSTALLATION_STATE.DELETING;
    wrapper.setProps({
      clusterAddOns: mockClusterAddOnsWithExternalResources,
    });
    const DescriptionList = wrapper.find('DescriptionList').props();
    expect(DescriptionList.children[0].props.children[1].props.children[1]).toEqual('Uninstalling');
  });

  it('should be completed when addon is deleted', () => {
    mockClusterAddOnsWithExternalResources.items[0].state = AddOnsConstants
      .INSTALLATION_STATE.DELETED;
    wrapper.setProps({
      clusterAddOns: mockClusterAddOnsWithExternalResources,
    });
    const DescriptionList = wrapper.find('DescriptionList').props();
    expect(DescriptionList.children[0].props.children[1].props.children[1]).toEqual('Completed');
  });

  it('should be completed when no addons installed', () => {
    wrapper.setProps({
      clusterAddOns: {
        items: [],
      },
    });
    const DescriptionList = wrapper.find('DescriptionList').props();
    expect(DescriptionList.children[0].props.children[1].props.children[1]).toEqual('Completed');
  });
});
