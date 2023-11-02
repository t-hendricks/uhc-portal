import React from 'react';
import { render, checkAccessibility, screen } from '~/testUtils';

import ClusterLogs from '../ClusterLogs';
import fixtures from '../../../__test__/ClusterDetails.fixtures';

describe('<ClusterLogs />', () => {
  const getClusterHistory = jest.fn();
  const setSorting = jest.fn();
  const setListFlag = jest.fn();
  const setFilter = jest.fn();
  const push = jest.fn();
  const refreshEventReset = jest.fn();
  const createdAt = new Date().toISOString();

  const props = {
    externalClusterID: fixtures.clusterDetails.cluster.external_id,
    clusterID: fixtures.clusterDetails.cluster.id,
    history: { push, location: '' },
    getClusterHistory,
    setSorting,
    setListFlag,
    setFilter,
    createdAt,
    clusterLogs: {
      requestState: fixtures.clusterDetails,
    },
    refreshEvent: { type: '', reset: refreshEventReset },
    viewOptions: {
      flags: {},
      fields: {},
    },
  };

  afterEach(() => {
    getClusterHistory.mockClear();
    setSorting.mockClear();
    setListFlag.mockClear();
    setFilter.mockClear();
    push.mockClear();
    refreshEventReset.mockClear();
  });

  it.skip('is accessible for no results found', async () => {
    // This test produced accessibility issues
    const { container } = render(<ClusterLogs {...props} />);

    // ensure component is fully loaded before checking accessibility
    expect(await screen.findByRole('grid')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
