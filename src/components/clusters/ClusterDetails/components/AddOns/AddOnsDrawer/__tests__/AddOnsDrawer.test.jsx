import React from 'react';
import { shallow } from 'enzyme';

import { render, checkAccessibility } from '~/testUtils';
import AddOnsDrawer from '../AddOnsDrawer';
import { mockAddOns, mockClusterAddOns } from '../../__tests__/AddOns.fixtures';

import fixtures from '../../../../__tests__/ClusterDetails.fixtures';
import { addonsQuotaList } from '../../../../../common/__tests__/quota.fixtures';

describe('<AddOnsDrawer />', () => {
  let wrapper;
  const openModal = jest.fn();
  const addClusterAddOn = jest.fn();
  const updateClusterAddOn = jest.fn();
  const setAddonsDrawer = jest.fn();
  const addClusterAddOnResponse = {};
  const deleteClusterAddOnResponse = {};
  const submitClusterAddOnResponse = {};
  const drawer = {
    open: false,
    activeCard: mockAddOns.items[0],
  };

  const { clusterDetails, organization } = fixtures;

  const props = {
    addOnsList: mockAddOns.items,
    mockClusterAddOns,
    cluster: clusterDetails.cluster,
    clusterAddOns: mockClusterAddOns,
    organization,
    quota: addonsQuotaList,
    openModal,
    clusterMachinePools: {},
    addClusterAddOn,
    addClusterAddOnResponse,
    deleteClusterAddOnResponse,
    updateClusterAddOn,
    submitClusterAddOnResponse,
    setAddonsDrawer,
    drawer,
  };

  beforeEach(() => {
    wrapper = shallow(<AddOnsDrawer {...props} />);
  });
  afterEach(() => {
    openModal.mockClear();
    addClusterAddOn.mockClear();
    updateClusterAddOn.mockClear();
    setAddonsDrawer.mockClear();
  });

  it('is accessible', async () => {
    const { container } = render(<AddOnsDrawer {...props} />);
    await checkAccessibility(container);
  });

  it('expect 7 rendered cards', () => {
    const DrawerContent = wrapper.find('DrawerContentBody').props();
    expect(DrawerContent.children.props.children.length).toEqual(7);
  });

  // TODO: Update test using redux state.addOns.drawer
  xit('ensure state is set correctly and drawer is expanded when card clicked', () => {
    const activeCard = wrapper.state('activeCard');
    expect(activeCard).toEqual(null);
    expect(wrapper.state('isDrawerExpanded')).toBeFalsy();

    wrapper.find('Connect(AddOnsCard)').at(1).simulate('click');

    const updateActiveCard = wrapper.state('activeCard');
    expect(updateActiveCard?.id).toEqual('managed-integration');
    expect(wrapper.state('isDrawerExpanded')).toBeTruthy();
  });
});
