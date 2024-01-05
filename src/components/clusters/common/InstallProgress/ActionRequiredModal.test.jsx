import React from 'react';
import { render, checkAccessibility, screen } from '~/testUtils';
import clusterService from '~/services/clusterService';
import accountsService from '~/services/accountsService';
import ActionRequiredModal from './ActionRequiredModal';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

// Service mocks are needed for child components
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

describe('<ActionRequiredModal />', () => {
  const onClose = jest.fn();

  const defaultProps = {
    cluster: fixtures.ROSAManualClusterDetails.cluster,
    isOpen: true,
    onClose,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    // Note this test throws warnings into the console because
    // a div is inside a paragraph
    // this appears to be a problem in  PF ClipboardCopy

    const { container } = render(<ActionRequiredModal {...defaultProps} />);

    expect(await screen.findByText('AWS CLI')).toBeInTheDocument();
    expect(await screen.findByRole('tabpanel')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
