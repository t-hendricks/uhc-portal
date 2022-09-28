import React from 'react';
import { shallow } from 'enzyme';

import AddOns from '../AddOns';
import { mockAddOns, mockClusterAddOns } from './AddOns.fixtures';
import { addonsQuota } from '../../../../common/__test__/quota.fixtures';
import fixtures from '../../../__test__/ClusterDetails.fixtures';

describe('<AddOns />', () => {
  let wrapper;
  const getClusterAddOns = jest.fn();
  const clearClusterAddOnsResponses = jest.fn();
  const addClusterAddOnResponse = {};
  const updateClusterAddOnResponse = {};
  const deleteClusterAddOnResponse = {};
  const getOrganizationAndQuota = jest.fn();
  const openModal = jest.fn();

  const { clusterDetails, organization } = fixtures;

  beforeEach(() => {
    wrapper = shallow(
      <AddOns
        clusterID={clusterDetails.cluster.id}
        cluster={clusterDetails.cluster}
        organization={organization}
        addOns={mockAddOns}
        clusterAddOns={mockClusterAddOns}
        clusterMachinePools={{}}
        quota={addonsQuota}
        getOrganizationAndQuota={getOrganizationAndQuota}
        getClusterAddOns={getClusterAddOns}
        addClusterAddOnResponse={addClusterAddOnResponse}
        updateClusterAddOnResponse={updateClusterAddOnResponse}
        deleteClusterAddOnResponse={deleteClusterAddOnResponse}
        clearClusterAddOnsResponses={clearClusterAddOnsResponses}
        openModal={openModal}
      />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
