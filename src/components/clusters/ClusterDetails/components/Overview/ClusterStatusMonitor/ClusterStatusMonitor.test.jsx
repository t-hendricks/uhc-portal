import React from 'react';

import { render, screen, within } from '~/testUtils';

import fixtures from '../../../__tests__/ClusterDetails.fixtures';

import ClusterStatusMonitor from './ClusterStatusMonitor';

jest.useFakeTimers({
  legacyFakeTimers: true, // TODO 'modern'
});
const { clusterDetails, OSDGCPClusterDetails } = fixtures;

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
    render(<ClusterStatusMonitor {...defaultProps} />);
    expect(getClusterStatus).toBeCalledWith(clusterDetails.cluster.id);
    expect(getInflightChecks).toBeCalledWith(clusterDetails.cluster.id);
  });

  it.skip('sets the timeout when cluster is installing', () => {
    // This test throws a "not wrap in act " error indicate that the component hasn't fully rendered
    // Can't see to determine an easy way to ensure the component has fully rendered
    // so the test doesn't throw an error

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
    };

    render(<ClusterStatusMonitor {...newProps} />);

    expect(
      within(screen.getByTestId('alert-long-install')).getByText(
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
      />,
    );
    expect(screen.getByText('Danger alert:')).toBeInTheDocument();
  });

  it('renders URLs embedded in alerts as links', () => {
    render(
      <ClusterStatusMonitor
        {...defaultProps}
        status={{
          fulfilled: true,
          pending: false,
          status: {
            id: clusterDetails.cluster.id,
            state: 'error',
            description: 'wut wut.',
            provision_error_code: 'OCM3055',
            provision_error_message:
              "Your cluster's installation role does not have permissions to use the default KMS key in your AWS account. Ensure that the installation role has permissions to use this key and try again. If you're using a custom KMS key, ensure the key exists. Learn more: https://access.redhat.com/solutions/7048553",
          },
        }}
      />,
    );
    expect(screen.getByText('Danger alert:')).toBeInTheDocument();
    expect(
      screen.getByText(/Your cluster's installation role does not have permissions/),
    ).toBeInTheDocument();
    expect(screen.getByText(/wut wut./)).toBeInTheDocument();
    expect(screen.getByText('https://access.redhat.com/solutions/7048553')).toHaveRole('link');
    expect(screen.getByText('https://access.redhat.com/solutions/7048553')).toHaveAttribute('href');
  });

  describe('GCP clusters shared VPC permissions alert', () => {
    const prepareProps = (stateDescription) => ({
      ...defaultProps,
      cluster: {
        ...OSDGCPClusterDetails.cluster,
        gcp_network: {
          vpc_project_id: 'ocm-ui-dev',
        },
        state: 'waiting',
        status: {
          state: 'waiting',
          description: stateDescription,
          dns_ready: false,
          oidc_ready: false,
          provision_error_message: '',
          provision_error_code: '',
          configuration_mode: 'full',
          limited_support_reason_count: 0,
        },
      },
    });
    const alertTitle = 'Permissions needed:';

    it('includes the affected service account', () => {
      const description =
        'User action required: Could not validate the shared subnets in the host project ocm-ui-dev. Make sure the following service account(s) [my-account-1@example-proj-4.iam.gserviceaccount.com] defined in the service project ocm-ui-dev, has been granted the Compute Network Admin, Compute Security Admin, and DNS Administrator roles via the host project IAM.';
      const props = prepareProps(description);
      render(<ClusterStatusMonitor {...props} />);

      expect(screen.getByText(alertTitle)).toBeInTheDocument();
      expect(screen.queryByText('unknown')).not.toBeInTheDocument();
      expect(
        screen.getByText('my-account-1@example-proj-4.iam.gserviceaccount.com'),
      ).toBeInTheDocument();
    });

    it('includes multiple affected service accounts', () => {
      const description =
        'User action required: Could not validate the shared subnets in the host project ocm-ui-dev. Make sure the following service account(s) [my-role-1@example-proj-4.gserviceaccount.com my-role-2@example-proj-4.gserviceaccount.com my-role-3@example-proj-4.gserviceaccount.com] defined in the service project ocm-ui-dev, has been granted the Compute Network Admin, Compute Security Admin, and DNS Administrator roles via the host project IAM.';
      const props = prepareProps(description);
      render(<ClusterStatusMonitor {...props} />);

      expect(screen.getByText(alertTitle)).toBeInTheDocument();
      expect(screen.queryByText('unknown')).not.toBeInTheDocument();
      expect(
        screen.getByText('my-role-1@example-proj-4.gserviceaccount.com'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('my-role-2@example-proj-4.gserviceaccount.com'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('my-role-3@example-proj-4.gserviceaccount.com'),
      ).toBeInTheDocument();
    });

    it('includes "unknown" if no service accounts are found', () => {
      const description =
        'User action required: Could not validate the shared subnets in the host project ocm-ui-dev.';
      const props = prepareProps(description);
      render(<ClusterStatusMonitor {...props} />);

      expect(screen.getByText(alertTitle)).toBeInTheDocument();
      expect(screen.getByText('unknown')).toBeInTheDocument();
    });
  });
});
