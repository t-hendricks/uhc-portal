import React from 'react';

import get from 'lodash/get';
import startCase from 'lodash/startCase';

import { Tooltip } from '@patternfly/react-core';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import { IRow } from '@patternfly/react-table';
import { ocmRoles } from '~/common/subscriptionTypes';

const skeletonRow: IRow['cells'] = [
  {
    props: { colSpan: 2 },
    title: <Skeleton size="md" />,
  },
];

// define a row record for easier managing the api data and presenting to the table.
class OCMRolesRow implements IRow {
  public id: string;

  public isCreating: boolean;

  public usernameValue: string;

  public roleValue: string;

  private data: any;

  private email: string;

  private isPending: boolean;

  private cellsData: IRow['cells'];

  constructor(data: any = null, rowIdx: string) {
    this.data = data;
    this.id = get(this.data, 'id', '');
    this.usernameValue = get(this.data, 'account.username', '');
    this.roleValue = get(this.data, 'role.id', '');
    this.email = get(this.data, 'account.email', '');

    // whether it is creating a new row
    this.isCreating = data === null;

    // whether it is pending for some change
    this.isPending = false;

    // prepare the cell data
    const nameCol = (
      <Tooltip content={this.email} key={`ocm-roles-username-tooltip-${rowIdx}`}>
        <span className="hand-pointer">{this.usernameValue}</span>
      </Tooltip>
    );
    const roleCol =
      Object.values(ocmRoles).find((role) => role.id === this.roleValue)?.name ||
      startCase(this.roleValue);
    this.cellsData = [{ title: nameCol }, { title: roleCol }];
  }

  setIsPending(isPending: boolean) {
    this.isPending = isPending;
  }

  // implement the interface property required by PF Table
  get cells() {
    // return skeleton if it's pending
    if (this.isPending) {
      return skeletonRow;
    }
    return this.cellsData;
  }
}

export { OCMRolesRow };

export default OCMRolesRow;
