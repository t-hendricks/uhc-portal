import React from 'react';

import { render, checkAccessibility } from '~/testUtils';
import AddOns from '../AddOns';
import { mockAddOns, mockClusterAddOns } from './AddOns.fixtures';
import { addonsQuotaList } from '../../../../common/__tests__/quota.fixtures';
import fixtures from '../../../__tests__/ClusterDetails.fixtures';

describe('<AddOns />', () => {
  const getAddOns = jest.fn();
  const getClusterAddOns = jest.fn();
  const clearClusterAddOnsResponses = jest.fn();
  const addClusterAddOnResponse = {};
  const updateClusterAddOnResponse = {};
  const deleteClusterAddOnResponse = {};
  const getOrganizationAndQuota = jest.fn();
  const openModal = jest.fn();

  const { clusterDetails, organization } = fixtures;

  const props = {
    clusterID: clusterDetails.cluster.id,
    cluster: clusterDetails.cluster,
    organization,
    addOns: mockAddOns,
    clusterAddOns: mockClusterAddOns,
    clusterMachinePools: {},
    quota: addonsQuotaList,
    getOrganizationAndQuota,
    getAddOns,
    getClusterAddOns,
    addClusterAddOnResponse,
    updateClusterAddOnResponse,
    deleteClusterAddOnResponse,
    clearClusterAddOnsResponses,
    openModal,
    isHypershift: false,
  };
  afterEach(() => {
    getAddOns.mockClear();
    getClusterAddOns.mockClear();
    clearClusterAddOnsResponses.mockClear();
    getOrganizationAndQuota.mockClear();
    openModal.mockClear();
  });

  it('is accessible', async () => {
    const { container } = render(<AddOns {...props} />);
    await checkAccessibility(container);
  });
});
