import React from 'react';

import { screen, render } from '~/testUtils';
import ClusterLogs from '../ClusterLogs';
import fixtures from '../../../__tests__/ClusterDetails.fixtures';

jest.mock('../toolbar', () => () => <div data-testid="toolbar">ClusterLogsToolbar</div>);

jest.mock('../LogTable', () => () => <div data-testid="logtable">LogTable</div>);

describe('<ClusterLogs />', () => {
  it('should render', async () => {
    render(
      <ClusterLogs
        externalClusterID={fixtures.clusterDetails.cluster.external_id}
        clusterID={fixtures.clusterDetails.cluster.id}
        createdAt={new Date().toISOString()}
        refreshEvent={{ type: '', reset: jest.fn() }}
      />,
    );
    expect(await screen.findByTestId('cluster_history_title')).toBeInTheDocument();
  });
});
