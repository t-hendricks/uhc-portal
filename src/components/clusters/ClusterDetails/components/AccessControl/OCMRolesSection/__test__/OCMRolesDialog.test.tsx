import React from 'react';
import { checkAccessibility, render } from '~/testUtils';
import modals from '~/components/common/Modal/modals';
import { ocmRoles } from '~/common/subscriptionTypes';
import { row } from './OCMRolesDialog.fixture';
import { OCMRolesDialog } from '../OCMRolesDialog';
import { OCMRolesRow } from '../OCMRolesRow';

describe('<OCMRolesDialog />', () => {
  it('should render in create mode', async () => {
    const rolesRow = new OCMRolesRow(null, '0');
    const submit = jest.fn();
    const { container, user, getByRole } = render(
      <OCMRolesDialog onSubmit={submit} row={rolesRow} />,
      {},
      { modal: { modalName: modals.OCM_ROLES } },
    );
    expect(getByRole('heading')).toHaveTextContent('Grant role');
    expect(getByRole('textbox', { name: /username/i })).toHaveTextContent('');
    await user.type(getByRole('textbox', { name: /username/i }), 'user@example.com');
    await user.click(getByRole('button', { name: /grant role/i }));
    expect(submit).toHaveBeenCalledWith(rolesRow, 'user@example.com', ocmRoles.CLUSTER_EDITOR.id);
    checkAccessibility(container);
  });
  it('should render in edit mode', async () => {
    const rolesRow = new OCMRolesRow(row.data, '1');
    const submit = jest.fn();
    const { user, getByText, getByRole } = render(
      <OCMRolesDialog onSubmit={submit} row={rolesRow} />,
      {},
      { modal: { modalName: modals.OCM_ROLES } },
    );
    expect(getByRole('heading')).toHaveTextContent('Edit role');
    expect(getByRole('textbox', { name: /username/i })).toHaveValue('Doris Hudson');
    await user.click(getByText(/cluster viewer/i));
    await user.click(getByText(/^machine pool editor$/i));
    await user.click(getByRole('button', { name: /edit role/i }));
    expect(submit).toHaveBeenCalledWith(rolesRow, 'Doris Hudson', ocmRoles.MACHINE_POOL_EDITOR.id);
  });
});
