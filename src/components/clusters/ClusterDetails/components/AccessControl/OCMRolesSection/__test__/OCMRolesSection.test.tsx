import React from 'react';

import { insightsMock, render, within } from '~/testUtils';
import MockAdapter from 'axios-mock-adapter';
import apiRequest from '~/services/apiRequest';
import { OCMRoles } from './OCMRolesSection.fixture';
import OCMRolesSection from '../OCMRolesSection';

import fixtures from '../../../../__test__/ClusterDetails.fixtures';

const mock = new MockAdapter(apiRequest);
insightsMock();

describe('<OCMRolesSection />', () => {
  const props = {
    subscription: fixtures.clusterDetails.cluster.subscription,
    canEditOCMRoles: true,
    canViewOCMRoles: true,
  };

  it('should render', async () => {
    mock
      .onGet(
        `/api/accounts_mgmt/v1/subscriptions/${fixtures.clusterDetails.cluster.subscription.id}/role_bindings`,
      )
      .reply(200, OCMRoles.data);
    const { findByRole, getByRole, getAllByRole } = render(<OCMRolesSection {...props} />);
    await findByRole('grid', { name: 'OCM Roles and Access' });
    expect(getAllByRole('row')).toHaveLength(5);
    expect(getByRole('button', { name: 'Grant role' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
    const row1 = getByRole('row', { name: /Doris Hudson/ });
    within(row1).getByRole('cell', { name: 'Cluster editor' });
    within(row1)
      .getByRole('button', { name: /actions/i })
      .click();
    expect(await findByRole('menuitem', { name: 'Delete' })).toBeEnabled();
    const row2 = getByRole('row', { name: /Jak Valdez/ });
    within(row2).getByRole('cell', { name: 'Cluster viewer' });
    const row3 = getByRole('row', { name: /Olive1/ });
    within(row3).getByRole('cell', { name: 'Machine pool editor' });
    const row4 = getByRole('row', { name: /Plum/ });
    within(row4).getByRole('cell', { name: 'Identity provider editor' });
  });

  it('should disable buttons if no edit access', async () => {
    mock
      .onGet(
        `/api/accounts_mgmt/v1/subscriptions/${fixtures.clusterDetails.cluster.subscription.id}/role_bindings`,
      )
      .reply(200, OCMRoles.data);
    const { findByRole } = render(<OCMRolesSection {...props} canEditOCMRoles={false} />);
    expect(await findByRole('button', { name: 'Grant role' })).toHaveAttribute('aria-disabled');
    const row1 = await findByRole('row', { name: /Doris Hudson/ });
    within(row1).getByRole('cell', { name: /cluster editor/i });
    expect(within(row1).getByRole('button', { name: /actions/i })).toBeDisabled();
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
    mock
      .onGet(
        `/api/accounts_mgmt/v1/subscriptions/${fixtures.clusterDetails.cluster.subscription.id}/role_bindings`,
      )
      .reply(403, errorResp);
    const { findByRole } = render(<OCMRolesSection {...props} />);
    const alert = await findByRole('alert', { name: /danger alert/i });
    within(alert).getByRole('heading', { name: /error getting OCM roles and access/i });
    within(alert).getByText(/ACCT-MGMT-11/);
    within(alert).getByText(/Account with ID 123456 denied access to perform get/);
  });
});
