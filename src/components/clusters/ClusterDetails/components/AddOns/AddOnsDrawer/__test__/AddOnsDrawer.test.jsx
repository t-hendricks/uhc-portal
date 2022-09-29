import React from 'react';
import { shallow } from 'enzyme';

import AddOnsDrawer from '../AddOnsDrawer';
import { mockAddOns, mockClusterAddOns } from '../../__test__/AddOns.fixtures';

import fixtures from '../../../../__test__/ClusterDetails.fixtures';
import { addonsQuota } from '../../../../../common/__test__/quota.fixtures';

describe('<AddOnsDrawer />', () => {
  let wrapper;
  const openModal = jest.fn();
  const addClusterAddOn = jest.fn();
  const addClusterAddOnResponse = {};
  const deleteClusterAddOnResponse = {};
  const clearClusterAddOnsResponses = {};
  const submitClusterAddOnResponse = {};

  const { clusterDetails, organization } = fixtures;

  beforeEach(() => {
    wrapper = shallow(
      <AddOnsDrawer
        addOnsList={mockAddOns.items}
        mockClusterAddOns={mockClusterAddOns}
        cluster={clusterDetails.cluster}
        clusterAddOns={mockClusterAddOns}
        organization={organization}
        quota={addonsQuota}
        openModal={openModal}
        clusterMachinePools={{}}
        addClusterAddOn={addClusterAddOn}
        addClusterAddOnResponse={addClusterAddOnResponse}
        deleteClusterAddOnResponse={deleteClusterAddOnResponse}
        clearClusterAddOnsResponses={clearClusterAddOnsResponses}
        submitClusterAddOnResponse={submitClusterAddOnResponse}
      />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('expect 7 rendered cards', () => {
    const DrawerContent = wrapper.find('DrawerContentBody').props();
    expect(DrawerContent.children.props.children.length).toEqual(7);
  });

  it('ensure state is set correctly and drawer is expanded when card clicked', () => {
    const activeCard = wrapper.state('activeCard');
    expect(activeCard).toEqual(null);
    expect(wrapper.state('isDrawerExpaned')).toBeFalsy();

    wrapper.find('Connect(AddOnsCard)').at(1).simulate('click');

    const updateActiveCard = wrapper.state('activeCard');
    expect(updateActiveCard?.id).toEqual('managed-integration');
    expect(wrapper.state('isDrawerExpanded')).toBeTruthy();
  });
});
