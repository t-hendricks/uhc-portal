import React from 'react';
import { render, screen, within } from '~/testUtils';
import ClusterStatusMonitor from './ClusterStatusMonitor';
import fixtures from '../../../__test__/ClusterDetails.fixtures';

jest.useFakeTimers('legacy'); // TODO 'modern'

const { clusterDetails, inflightChecks } = fixtures;

const status = {
  pending: false,
  fulfilled: false,
  status: {
    id: clusterDetails.cluster.id,
  },
};

// TODO: These tests throw warnings due to list items not having unique keys

describe('<ClusterStatusMonitor />', () => {
  const getClusterStatus = jest.fn();
  const getInflightChecks = jest.fn();
  const refresh = jest.fn();
  const historyPush = jest.fn();
  const history = { push: historyPush };

  const defaultProps = {
    cluster: { ...clusterDetails.cluster, state: 'installing' },
    inflightChecks,
    getClusterStatus,
    getInflightChecks,
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
    render(<ClusterStatusMonitor {...defaultProps} />);
    expect(getClusterStatus).toBeCalledWith(clusterDetails.cluster.id);
    expect(getInflightChecks).toBeCalledWith(clusterDetails.cluster.id);
  });

  it('sets the timeout when cluster is installing', () => {
    // set pending: true first since the logic depends on the pending -> fulfilled transition
    const { rerender } = render(
      <ClusterStatusMonitor
        {...defaultProps}
        status={{
          ...status,
          pending: true,
        }}
      />,
    );

    rerender(
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
        inflightChecks={{ fulfilled: true, pending: false, checks: [] }}
      />,
    );

    expect(setTimeout).toBeCalled();
    jest.runOnlyPendingTimers();
    expect(getClusterStatus).toHaveBeenLastCalledWith(clusterDetails.cluster.id);
    expect(getClusterStatus).toHaveBeenCalledTimes(2); // one call on mount, second on timer
    expect(refresh).not.toHaveBeenCalled();
  });

  it('renders null when no error', () => {
    const { container } = render(<ClusterStatusMonitor {...defaultProps} />);
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
      inflightChecks: {
        fulfilled: true,
        pending: false,
        checks: [],
      },
    };

    render(<ClusterStatusMonitor {...newProps} />);

    expect(
      within(screen.getByLabelText('Warning Alert')).getByText(
        /Installation is taking longer than expected/,
      ),
    ).toBeInTheDocument();
  });

  it('calls refresh when the status changes', () => {
    const { rerender } = render(
      <ClusterStatusMonitor
        {...defaultProps}
        status={{
          ...status,
          pending: true,
        }}
        inflightChecks={{
          pending: true,
          checks: [],
        }}
      />,
    );
    expect(refresh).not.toHaveBeenCalled();
    rerender(
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
        inflightChecks={{
          fulfilled: true,
          pending: false,
          checks: [],
        }}
      />,
    );

    expect(refresh).toBeCalled();
  });

  it('renders an alert when cluster is errored', () => {
    render(
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
        inflightChecks={{
          fulfilled: true,
          pending: false,
          checks: [],
        }}
      />,
    );
    expect(screen.getByLabelText('Danger Alert')).toBeInTheDocument();
  });
});
