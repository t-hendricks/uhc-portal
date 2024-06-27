import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { useFetchClusterStatus } from '~/queries/ClusterDetailsQueries/ClusterStatusMonitor/useFetchClusterStatus';
import {
  useFetchInflightChecks,
  useFetchRerunInflightChecks,
  useMutateRerunInflightChecks,
} from '~/queries/ClusterDetailsQueries/ClusterStatusMonitor/useFetchInflightChecks';
import { render, screen, TestRouter, within } from '~/testUtils';

import fixtures from '../../../__tests__/ClusterDetails.fixtures';

import ClusterStatusMonitor from './ClusterStatusMonitor';

jest.mock('~/queries/ClusterDetailsQueries/ClusterStatusMonitor/useFetchClusterStatus', () => ({
  useFetchClusterStatus: jest.fn(),
  useInvalidateFetchClusterStatus: jest.fn(),
}));
jest.mock('~/queries/ClusterDetailsQueries/ClusterStatusMonitor/useFetchInflightChecks', () => ({
  useFetchInflightChecks: jest.fn(),
  useFetchRerunInflightChecks: jest.fn(),
  useMutateRerunInflightChecks: jest.fn(),
  useInvalidateFetchInflightChecks: jest.fn(),
}));

const { clusterDetails } = fixtures;

// TODO: These tests throw warnings due to list items not having unique keys

describe('<ClusterStatusMonitor />', () => {
  const useFetchClusterStatusMock = useFetchClusterStatus;
  const useFetchInflightChecksMock = useFetchInflightChecks;
  const useFetchRerunInflightChecksMock = useFetchRerunInflightChecks;
  const useMutateRerunInflightChecksMock = useMutateRerunInflightChecks;

  const refresh = jest.fn();

  const defaultProps = {
    cluster: { ...clusterDetails.cluster, state: 'installing' },
    refresh,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls getClusterStatus on mount without region', () => {
    useFetchClusterStatusMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
    });
    useMutateRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...defaultProps} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(useFetchClusterStatusMock).toBeCalledWith(clusterDetails.cluster.id, undefined, false);
    expect(useFetchInflightChecksMock).toBeCalledWith(
      clusterDetails.cluster.id,
      undefined,
      false,
      'fetchClusterStatusMonitorInflightChecks',
    );
  });

  it('calls getClusterStatus on mount with region', () => {
    useFetchClusterStatusMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
    });
    useMutateRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...defaultProps} region="aws.ap-southeast-1.stage" />
        </CompatRouter>
      </TestRouter>,
    );
    expect(useFetchClusterStatusMock).toBeCalledWith(
      clusterDetails.cluster.id,
      'aws.ap-southeast-1.stage',
      false,
    );
    expect(useFetchInflightChecksMock).toBeCalledWith(
      clusterDetails.cluster.id,
      'aws.ap-southeast-1.stage',
      false,
      'fetchClusterStatusMonitorInflightChecks',
    );
  });

  it('sets the timeout when cluster is installing', () => {
    useFetchClusterStatusMock.mockReturnValue({
      isLoading: false,
      data: {
        state: 'waiting',
      },
      isError: false,
      error: null,
    });
    useFetchInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
    });
    useMutateRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });

    // set pending: true first since the logic depends on the pending -> fulfilled transition
    const { rerender } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...defaultProps} />,
        </CompatRouter>
      </TestRouter>,
    );

    rerender(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...defaultProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(useFetchClusterStatusMock).toHaveBeenLastCalledWith(
      clusterDetails.cluster.id,
      undefined,
      false,
    );
    expect(useFetchClusterStatusMock).toHaveBeenCalledTimes(2); // one call on mount, second on timer
    expect(refresh).not.toHaveBeenCalled();
  });

  it('renders null when no error', () => {
    useFetchClusterStatusMock.mockReturnValue({
      isLoading: false,
      data: {
        state: 'installing',
      },
      isError: false,
      error: null,
    });
    useFetchInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
    });
    useMutateRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });

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
    useFetchClusterStatusMock.mockReturnValue({
      isLoading: false,
      data: {
        state: 'installing',
        id: clusterDetails.cluster.id,
        provision_error_code: '',
        provision_error_message: 'Install taking longer than expected',
      },
      isError: false,
      error: null,
    });
    useFetchInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
    });
    useMutateRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });

    const newProps = {
      ...defaultProps,
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
    useMutateRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchClusterStatusMock.mockReturnValueOnce({
      isLoading: false,
      data: {
        id: clusterDetails.cluster.id,
        status: 'installing',
      },
      isError: false,
      error: null,
    });
    useFetchClusterStatusMock.mockReturnValue({
      isLoading: false,
      data: {
        id: clusterDetails.cluster.id,
        state: 'error',
        provision_error_code: 'OCM1002',
        provision_error_message: 'Invalid AWS credentials (authentication)',
      },
      isError: false,
      error: null,
    });
    useFetchInflightChecksMock.mockReturnValueOnce({
      isLoading: false,
      checks: null,
    });

    useFetchInflightChecksMock.mockReturnValue({
      isLoading: false,
      checks: {
        items: [{ state: 'running' }],
      },
    });
    const { rerender } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...defaultProps} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(refresh).not.toHaveBeenCalled();

    rerender(
      <TestRouter>
        <CompatRouter>
          <ClusterStatusMonitor {...defaultProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(refresh).toBeCalled();
  });

  it('renders an alert when cluster is errored', () => {
    useFetchClusterStatusMock.mockReturnValue({
      isLoading: false,
      data: {
        id: clusterDetails.cluster.id,
        state: 'error',
        provision_error_code: 'OCM1002',
        provision_error_message: 'Invalid AWS credentials (authentication)',
      },
      isError: false,
      error: null,
    });
    useFetchInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
    });
    useMutateRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });
    useFetchRerunInflightChecksMock.mockReturnValue({
      isLoading: false,
      data: null,
      isError: false,
      error: null,
    });

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
