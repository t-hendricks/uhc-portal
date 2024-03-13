import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, render, TestRouter } from '~/testUtils';
import ClusterLogs from '../ClusterLogs';
import fixtures from '../../../__tests__/ClusterDetails.fixtures';

jest.mock('../toolbar', () => () => <div data-testid="toolbar">ClusterLogsToolbar</div>);

jest.mock('../LogTable', () => () => <div data-testid="logtable">LogTable</div>);

describe('<ClusterLogs />', () => {
  it('should render', async () => {
    render(
      <TestRouter>
        <CompatRouter>
          <ClusterLogs
            externalClusterID={fixtures.clusterDetails.cluster.external_id}
            clusterID={fixtures.clusterDetails.cluster.id}
            createdAt={new Date().toISOString()}
            refreshEvent={{ type: '', reset: jest.fn() }}
          />
        </CompatRouter>
      </TestRouter>,
    );
    expect(await screen.findByTestId('cluster_history_title')).toBeInTheDocument();
  });
});
