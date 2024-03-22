import React from 'react';

import { CompatRouter } from 'react-router-dom-v5-compat';
import { render, checkAccessibility, TestRouter, screen, within } from '~/testUtils';
import ClusterDetailsTop from '../components/ClusterDetailsTop';
import fixtures, { funcs } from './ClusterDetails.fixtures';
import clusterStates from '../../common/clusterStates';

describe('<ClusterDetailsTop />', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  const functions = funcs();

  const props = {
    cluster: fixtures.clusterDetails.cluster,
    openModal: functions.openModal,
    pending: fixtures.clusterDetails.pending,
    refreshFunc: functions.refreshFunc,
    clusterIdentityProviders: fixtures.clusterIdentityProviders,
    organization: fixtures.organization,
    canSubscribeOCP: fixtures.canSubscribeOCP,
    canTransferClusterOwnership: fixtures.canTransferClusterOwnership,
    canHibernateCluster: fixtures.canHibernateCluster,
    toggleSubscriptionReleased: functions.toggleSubscriptionReleased,
    showPreviewLabel: true,
  };

  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...props} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('should show refresh button', async () => {
    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...props} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('should enable open console button when cluster has console url and cluster is not uninstalling', async () => {
    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...props} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(await screen.findByRole('button', { name: 'Open console' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });

  it('should disable open console button when console url is missing', async () => {
    const cluster = { ...fixtures.clusterDetails.cluster, console: { url: '' } };

    const newProps = { ...props, cluster };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(await screen.findByRole('button', { name: 'Open console' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('should disable open console button when cluster is unistalling', async () => {
    const cluster = { ...fixtures.clusterDetails.cluster, state: clusterStates.UNINSTALLING };
    const newProps = { ...props, cluster };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(await screen.findByRole('button', { name: 'Open console' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('should show error icon if an error occurred', async () => {
    const newProps = { ...props, error: true, errorMessage: 'I am an error message' };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByLabelText('Warning')).toBeInTheDocument();
  });

  it('should show only Unarchive button if the cluster is archived', async () => {
    const cluster = {
      ...fixtures.clusterDetails.cluster,
      subscription: { status: 'Archived', id: 'fake' },
    };

    const newProps = { ...props, cluster };

    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );

    const unArchiveButton = await screen.findByRole('button', { name: 'Unarchive' });

    expect(unArchiveButton).toBeInTheDocument();
    expect(unArchiveButton).toHaveClass('pf-m-secondary');
    expect(screen.queryByRole('button', { name: 'Refresh' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.click(unArchiveButton);

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });

  it('should show expiration alert based on expiration_time', async () => {
    const { cluster } = fixtures.OSDTrialClusterDetails;
    const expDate = new Date();
    expDate.setDate(expDate.getDate() - (365 * 2 + 1)); // should have expired 2 years ago

    const expirationTimestamp = expDate.toISOString();
    cluster.subscription.trial_end_date = '';
    cluster.subscription.billing_expiration_date = '';
    cluster.expiration_timestamp = expirationTimestamp;

    const newProps = { ...props, cluster };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('Warning alert', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('This cluster should have been deleted', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it('should show expiration alert for OSDTrial', async () => {
    const { cluster } = fixtures.OSDTrialClusterDetails;
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 1); // now + 1 day
    cluster.subscription.trial_end_date = expDate.toISOString();
    cluster.subscription.billing_expiration_date = '';
    cluster.expiration_timestamp = '';

    const newProps = { ...props, cluster };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('Danger alert', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('This cluster will be deleted in a day', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it('should show expiration alert for OSD RHM', async () => {
    const { cluster } = fixtures.OSDRHMClusterDetails;
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 1); // now + 1 day
    cluster.subscription.trial_end_date = '';
    cluster.subscription.billing_expiration_date = expDate.toISOString();
    cluster.expiration_timestamp = '';

    const newProps = { ...props, cluster };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('Danger alert', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('This cluster will be deleted in a day', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it('should show non-editable alert for AI clusters', async () => {
    const { cluster } = fixtures.AIClusterDetails;
    const newProps = { ...props, cluster };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('Info alert', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText(
        'To get permission to edit, contact the Cluster Owner or Organization Admin',
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument();
  });

  it('should not show non-editable alert for non-AI clusters', async () => {
    const { cluster } = fixtures.clusterDetails;

    const newProps = { ...props, cluster };

    render(
      <TestRouter>
        <CompatRouter>
          <ClusterDetailsTop {...newProps} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
