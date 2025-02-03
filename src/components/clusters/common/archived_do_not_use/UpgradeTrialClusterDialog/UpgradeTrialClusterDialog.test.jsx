import React from 'react';

import { render, screen } from '../../../../../testUtils';
import fixtures from '../../../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';
import { emptyQuotaList, mockQuotaList } from '../../__tests__/quota.fixtures';

import UpgradeTrialClusterDialog from './UpgradeTrialClusterDialog';

describe('<UpgradeTrialClusterDialog />', () => {
  const organizationState = {
    fulfilled: true,
    pending: false,
    quotaList: emptyQuotaList,
  };
  const { cluster } = fixtures.OSDTrialClusterDetails;
  const machineTypesByID = {
    'm5.xlarge': { id: 'm5.xlarge', generic_name: 'standard-4' },
  };
  const machinePools = [
    {
      instance_type: 'm5.xlarge',
      replicas: 3,
    },
  ];
  let closeModal;
  let onClose;
  let submit;
  let resetResponse;
  let getOrganizationAndQuota;

  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    submit = jest.fn();
    resetResponse = jest.fn();
    getOrganizationAndQuota = jest.fn();
  });

  it('renders no-quota alert when there is no quota', () => {
    render(
      <UpgradeTrialClusterDialog
        isOpen
        closeModal={closeModal}
        onClose={onClose}
        submit={submit}
        resetResponse={resetResponse}
        organization={organizationState}
        getOrganizationAndQuota={getOrganizationAndQuota}
        clusterID="some-cluster-id"
        cluster={cluster}
        machineTypesByID={machineTypesByID}
        upgradeTrialClusterResponse={{ errorMessage: '', error: false, fulfilled: false }}
        machinePools={machinePools}
      />,
    );
    expect(screen.getByTestId('no-quota-alert')).toBeInTheDocument();
    expect(screen.getByText('Contact sales')).toBeInTheDocument();
    // when there's no quota there is only a single action button, so we can use a small PF modal
    expect(screen.getByRole('dialog')).toHaveClass('pf-m-sm');
  });

  it('allows upgrade via marketplace billing', () => {
    const orgState = {
      fulfilled: true,
      pending: false,
      quotaList: mockQuotaList,
    };
    render(
      <UpgradeTrialClusterDialog
        isOpen
        closeModal={closeModal}
        onClose={onClose}
        submit={submit}
        resetResponse={resetResponse}
        organization={orgState}
        getOrganizationAndQuota={getOrganizationAndQuota}
        clusterID="some-cluster-id"
        cluster={cluster}
        machineTypesByID={machineTypesByID}
        upgradeTrialClusterResponse={{ errorMessage: '', error: false, fulfilled: false }}
        machinePools={[
          {
            instance_type: 'm5.xlarge',
            replicas: 140,
          },
        ]}
      />,
    );

    expect(screen.queryByTestId('no-quota-alert')).not.toBeInTheDocument();
    expect(screen.getByText('Upgrade using Marketplace billing')).toBeInTheDocument();
    expect(screen.queryByText('Upgrade using quota')).not.toBeInTheDocument();
    // when it's possible to upgrade, we have to make room for all the action buttons and use a bigger PF modal
    expect(screen.getByRole('dialog')).toHaveClass('pf-m-md');
  });

  it('allows upgrade via standard or marketplace billing', () => {
    const orgState = {
      fulfilled: true,
      pending: false,
      quotaList: mockQuotaList,
    };
    render(
      <UpgradeTrialClusterDialog
        isOpen
        closeModal={closeModal}
        onClose={onClose}
        submit={submit}
        resetResponse={resetResponse}
        organization={orgState}
        getOrganizationAndQuota={getOrganizationAndQuota}
        clusterID="some-cluster-id"
        cluster={cluster}
        machineTypesByID={machineTypesByID}
        upgradeTrialClusterResponse={{ errorMessage: '', error: false, fulfilled: false }}
        machinePools={[
          {
            instance_type: 'm5.xlarge',
            replicas: 130,
          },
        ]}
      />,
    );
    expect(screen.queryByTestId('no-quota-alert')).not.toBeInTheDocument();
    expect(screen.getByText('Upgrade using Marketplace billing')).toBeInTheDocument();
    expect(screen.getByText('Upgrade using quota')).toBeInTheDocument();
  });

  it('renders error box when an error occurs', () => {
    render(
      <UpgradeTrialClusterDialog
        isOpen
        closeModal={closeModal}
        onClose={onClose}
        submit={submit}
        resetResponse={resetResponse}
        organization={organizationState}
        getOrganizationAndQuota={getOrganizationAndQuota}
        clusterID="some-cluster-id"
        cluster={cluster}
        machineTypesByID={machineTypesByID}
        upgradeTrialClusterResponse={{ error: true, errorMessage: 'this is an error' }}
        machinePools={machinePools}
      />,
    );

    expect(screen.getByText('Error upgrading cluster')).toBeInTheDocument();
  });
});
