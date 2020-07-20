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
  const clearAddOnsResponses = jest.fn();
  const addClusterAddOnResponse = jest.fn();
  const getOrganizationAndQuota = jest.fn();

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
      clearAddOnsResponses={clearAddOnsResponses}
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
