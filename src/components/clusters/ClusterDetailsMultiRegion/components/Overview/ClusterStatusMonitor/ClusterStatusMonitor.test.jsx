import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { render, screen, TestRouter, within } from '~/testUtils';

import fixtures from '../../../__tests__/ClusterDetails.fixtures';

import ClusterStatusMonitor from './ClusterStatusMonitor';

jest.useFakeTimers({
  legacyFakeTimers: true, // TODO 'modern'
});
const { clusterDetails } = fixtures;

const status = {
  pending: false,
  fulfilled: false,
  status: {
    id: clusterDetails.cluster.id,
  },
};
const inflightChecks = { fulfilled: true, pending: false, checks: [] };
const rerunInflightCheckReq = {
  fulfilled: true,
  pending: false,
};
const rerunInflightCheckRes = {
  fulfilled: true,
  pending: false,
  checks: [],
};

// TODO: These tests throw warnings due to list items not having unique keys

describe('<ClusterStatusMonitor />', () => {
  const getClusterStatus = jest.fn();
  const getInflightChecks = jest.fn();
  const resetInflightChecks = jest.fn();
  const refresh = jest.fn();
  const historyPush = jest.fn();
  const history = { push: historyPush };

  const defaultProps = {
    cluster: { ...clusterDetails.cluster, state: 'installing' },
    inflightChecks,
    getClusterStatus,
    getInflightChecks,
    resetInflightChecks,
    rerunInflightCheckReq,
    rerunInflightCheckRes,
    status,
    refresh,
    history,
  };

  afterEach(() => {
    getClusterStatus.mockClear();
    getInflightChecks.mockClear();
    refresh.mockClear();
    historyPush.mockClear();
  });

  it('calls getClusterStatus on mount', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...defaultProps} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(getClusterStatus).toBeCalledWith(clusterDetails.cluster.id);
    expect(getInflightChecks).toBeCalledWith(clusterDetails.cluster.id);
  });

  it.skip('sets the timeout when cluster is installing', () => {
    // This test throws a "not wrap in act " error indicate that the component hasn't fully rendered
    // Can't see to determine an easy way to ensure the component has fully rendered
    // so the test doesn't throw an error

    // set pending: true first since the logic depends on the pending -> fulfilled transition
    const { rerender } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor
            {...defaultProps}
            status={{
              ...status,
              pending: true,
            }}
          />
          ,
        </CompatRouter>
      </TestRouter>,
    );

    rerender(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor
            {...defaultProps}
            status={{
              fulfilled: true,
              pending: false,
              status: {
                id: clusterDetails.cluster.id,
                state: 'installing',
              },
            }}
          />
        </CompatRouter>
      </TestRouter>,
    );

    expect(setTimeout).toBeCalled();
    jest.runOnlyPendingTimers();
    expect(getClusterStatus).toHaveBeenLastCalledWith(clusterDetails.cluster.id);
    expect(getClusterStatus).toHaveBeenCalledTimes(2); // one call on mount, second on timer
    expect(refresh).not.toHaveBeenCalled();
  });

  it('renders null when no error', () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...defaultProps} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('Displays warning when install takes longer', async () => {
    const newProps = {
      ...defaultProps,
      status: {
        fulfilled: true,
        pending: false,
        status: {
          id: clusterDetails.cluster.id,
          state: 'installing',
          provision_error_code: '',
          provision_error_message: 'Install taking longer than expected',
        },
      },
    };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(
      within(screen.getByTestId('alert-long-install')).getByText(
        /Installation is taking longer than expected/,
      ),
    ).toBeInTheDocument();
  });

  it('calls refresh when the status changes', () => {
    const { rerender } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor
            {...defaultProps}
            status={{
              ...status,
              pending: true,
            }}
          />
        </CompatRouter>
      </TestRouter>,
    );
    expect(refresh).not.toHaveBeenCalled();
    rerender(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor
            {...defaultProps}
            status={{
              fulfilled: true,
              pending: false,
              status: {
                id: clusterDetails.cluster.id,
                state: 'error',
                provision_error_code: 'OCM1002',
                provision_error_message: 'Invalid AWS credentials (authentication)',
              },
            }}
          />
        </CompatRouter>
      </TestRouter>,
    );

    expect(refresh).toBeCalled();
  });

  it('renders an alert when cluster is errored', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor
            {...defaultProps}
            status={{
              fulfilled: true,
              pending: false,
              status: {
                id: clusterDetails.cluster.id,
                state: 'error',
                provision_error_code: 'OCM1002',
                provision_error_message: 'Invalid AWS credentials (authentication)',
              },
            }}
          />
        </CompatRouter>
      </TestRouter>,
    );
    expect(screen.getByText('Danger alert:')).toBeInTheDocument();
  });
});
