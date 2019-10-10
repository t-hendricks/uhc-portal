import PropTypes from 'prop-types';
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
} from '@patternfly/react-table';
import orderBy from 'lodash/orderBy';

import PopoverHint from '../../common/PopoverHint';


function OSDSubscriptionTable({ rows, children }) {
  const tipText = (
    <>
      <p>
      Standard: Cluster infrastructure costs paid by Red Hat
      </p>
      <p>
      BYOC: Cluster infrastructure costs paid by the customer
      </p>
    </>
  );
  const planType = (
    <>
      Plan type
      <PopoverHint hint={tipText} />
    </>
  );
  const columns = [
    'Resource type',
    'Resource name',
    'Availability',
    { title: 'Plan type', transforms: [() => ({ children: planType })] },
    'Used',
    'Max',
    'Capacity',
  ];

  return (
    <>
      <Table cells={columns} rows={orderBy(rows, [0, 1])}>
        <TableHeader />
        <TableBody />
      </Table>
      {children}
    </>
  );
}

OSDSubscriptionTable.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default OSDSubscriptionTable;
