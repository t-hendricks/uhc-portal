import React from 'react';

import get from 'lodash/get';
import starCase from 'lodash/startCase';

import { Tooltip } from '@patternfly/react-core';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';

const skeletonRow = [
  {
    props: { colSpan: 2 },
    title: <Skeleton size="md" />,
  },
];

// define a row record for easier managing the api data and presenting to the table.
class OCMRolesRow {
  constructor(data = null, rowIdx = -1) {
    this.data = data;
    this.id = get(this.data, 'id', '');
    this.usernameValue = get(this.data, 'account.username', '');
    this.roleValue = get(this.data, 'role.id', '');
    this.email = get(this.data, 'account.email', '');
    this.rowIdx = rowIdx;

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
    const roleCol = starCase(this.roleValue);
    this.cellsData = [{ title: nameCol }, { title: roleCol }];
  }

  setIsPending(val) {
    this.isPending = val;
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
