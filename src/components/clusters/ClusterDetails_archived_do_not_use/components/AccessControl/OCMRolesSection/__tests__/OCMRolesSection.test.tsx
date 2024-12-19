import React from 'react';
import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { render, screen, waitFor, within } from '~/testUtils';
import { Subscription } from '~/types/accounts_mgmt.v1';

import fixtures from '../../../../__tests__/ClusterDetails.fixtures';
import OCMRolesSection from '../OCMRolesSection';

import { OCMRoles } from './OCMRolesSection.fixture';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('<OCMRolesSection />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const { subscription } = fixtures.clusterDetails.cluster;
  const props = {
    subscription: subscription as unknown as Subscription,
    canEditOCMRoles: true,
    canViewOCMRoles: true,
  };

  it('should render', async () => {
    apiRequestMock.get.mockResolvedValue(OCMRoles);

    const { user } = render(<OCMRolesSection {...props} />);
    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(apiRequestMock.get).toHaveBeenCalledWith(
      `/api/accounts_mgmt/v1/subscriptions/${fixtures.clusterDetails.cluster.subscription.id}/role_bindings`,
      expect.objectContaining({}),
    );

    await screen.findByRole('grid', { name: 'OCM Roles and Access' });
    expect(screen.getAllByRole('row')).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'Grant role' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
    const row1 = screen.getByRole('row', { name: /Doris Hudson/ });
    within(row1).getByRole('cell', { name: 'Cluster editor' });

    await user.click(within(row1).getByRole('button', { name: 'Kebab toggle' }));
    expect(await screen.findByRole('menuitem', { name: 'Delete' })).toBeEnabled();
    const row2 = screen.getByRole('row', { name: /Jak Valdez/ });
    within(row2).getByRole('cell', { name: 'Cluster viewer' });
    const row3 = screen.getByRole('row', { name: /Olive1/ });
    within(row3).getByRole('cell', { name: 'Machine pool editor' });
    const row4 = screen.getByRole('row', { name: /Plum/ });
    within(row4).getByRole('cell', { name: 'Identity provider editor' });
  });

  it('should disable buttons if no edit access', async () => {
    apiRequestMock.get.mockResolvedValue(OCMRoles);

    const { findByRole } = render(<OCMRolesSection {...props} canEditOCMRoles={false} />);
    expect(apiRequest.get).toHaveBeenCalledTimes(1);
    expect(apiRequest.get).toHaveBeenCalledWith(
      `/api/accounts_mgmt/v1/subscriptions/${fixtures.clusterDetails.cluster.subscription.id}/role_bindings`,
      expect.objectContaining({}),
    );

    expect(await findByRole('button', { name: 'Grant role' })).toHaveAttribute('aria-disabled');
    const row1 = await findByRole('row', { name: /Doris Hudson/ });
    within(row1).getByRole('cell', { name: /cluster editor/i });
    expect(within(row1).getByRole('button', { name: 'Kebab toggle' })).toBeDisabled();
  });

  it('should render error', async () => {
    const errorResp = {
      code: 'ACCT-MGMT-11',
      href: '/api/accounts_mgmt/v1/errors/11',
      id: '11',
      kind: 'Error',
      operation_id: 'abcdef',
      reason:
        'Account with ID 123456 denied access to perform get on Subscription with HTTP call GET /api/accounts_mgmt/v1/subscriptions/7890/role_bindings',
    };
    apiRequestMock.get.mockRejectedValue({ status: 403, response: { data: errorResp } }); // Mocks the axios format of the error

    const { getByTestId } = render(<OCMRolesSection {...props} />);
    expect(apiRequest.get).toHaveBeenCalledTimes(1);
    expect(apiRequest.get).toHaveBeenCalledWith(
      `/api/accounts_mgmt/v1/subscriptions/${fixtures.clusterDetails.cluster.subscription.id}/role_bindings`,
      expect.objectContaining({}),
    );

    await waitFor(() => expect(getByTestId('alert-error')).toBeVisible());
    const alert = getByTestId('alert-error');
    within(alert).getByRole('heading', { name: /error getting OCM roles and access/i });
    within(alert).getByText(/ACCT-MGMT-11/);
    within(alert).getByText(/Account with ID 123456 denied access to perform get/);
  });
});
