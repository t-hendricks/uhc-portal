import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import clusterService from '~/services/clusterService';
import accountsService from '~/services/accountsService';
import AWSCLITab from './AWSCLITab';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

jest.mock('~/services/clusterService');
clusterService.getOperatorRoleCommands = jest.fn();
clusterService.getOperatorRoleCommands.mockResolvedValue({
  data: { commands: ['command 1', 'commend 2'] },
});

jest.mock('~/services/accountsService');
accountsService.getPolicies = jest.fn();
accountsService.getPolicies.mockResolvedValue({
  data: {
    items: [{ id: 'operator_iam_role_policy', details: 'Some details' }],
  },
});

accountsService.getCredentialRequests = jest.fn();
accountsService.getCredentialRequests.mockResolvedValue({
  data: {
    items: [
      {
        operator: {
          name: 'myrole',
          namespace: 'openshift-machine-api',
          service_accounts: ['account1', 'account2'],
        },
      },
    ],
  },
});

describe('<AWSCLITab />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is accessible when pending', async () => {
    const { container } = render(<AWSCLITab cluster={fixtures.ROSAManualClusterDetails.cluster} />);

    expect(await screen.findByText('Preparing .zip')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('is accessible when complete', async () => {
    const { container } = render(<AWSCLITab cluster={fixtures.ROSAManualClusterDetails.cluster} />);

    expect(await screen.findByText('Download .zip')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
