import React from 'react';
import { shallow } from 'enzyme';

import AddOns from '../AddOns';
import { mockAddOns, mockClusterAddOns, mockQuota } from './AddOns.fixtures';
import fixtures from '../../../__test__/ClusterDetails.fixtures';

describe('<AddOns />', () => {
  let wrapper;
  const getAddOns = jest.fn();
  const getClusterAddOns = jest.fn();
  const addClusterAddOn = jest.fn();
  const clearClusterAddOnsResponses = jest.fn();
  const addClusterAddOnResponse = {};
  const deleteClusterAddOnResponse = {};
  const getOrganizationAndQuota = jest.fn();
  const openModal = jest.fn();

  const { clusterDetails, organization } = fixtures;

  beforeAll(() => {
    wrapper = shallow(<AddOns
      clusterID={clusterDetails.cluster.id}
      cluster={clusterDetails.cluster}
      organization={organization}
      addOns={mockAddOns}
      clusterAddOns={mockClusterAddOns}
      quota={mockQuota}
      getAddOns={getAddOns}
      getOrganizationAndQuota={getOrganizationAndQuota}
      getClusterAddOns={getClusterAddOns}
      addClusterAddOn={addClusterAddOn}
      addClusterAddOnResponse={addClusterAddOnResponse}
      deleteClusterAddOnResponse={deleteClusterAddOnResponse}
      clearClusterAddOnsResponses={clearClusterAddOnsResponses}
      openModal={openModal}
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
