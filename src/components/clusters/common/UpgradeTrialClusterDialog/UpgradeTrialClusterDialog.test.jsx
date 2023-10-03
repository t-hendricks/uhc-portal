import React from 'react';
import { MemoryRouter } from 'react-router';

import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';
import { emptyQuotaList } from '../__test__/quota.fixtures';
import UpgradeTrialClusterDialog from './UpgradeTrialClusterDialog';
import { render, screen } from '../../../../testUtils';

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
      <MemoryRouter>
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
        />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('no-quota-alert')).toBeInTheDocument();
  });

  it('renders error box when an erorr occurs', () => {
    render(
      <MemoryRouter>
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
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Error upgrading cluster')).toBeInTheDocument();
  });
});
