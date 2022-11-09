import React from 'react';
import { Table, TableHeader, TableBody, IRowCell } from '@patternfly/react-table';
import orderBy from 'lodash/orderBy';

import PopoverHint from '../../common/PopoverHint';

type Props = {
  rows: (React.ReactNode | IRowCell)[][];
  children?: React.ReactNode;
};

const OSDSubscriptionTable = ({ rows, children }: Props) => {
  const sortedRows = orderBy(rows, [0, 1]).map((cells) => ({ cells }));
  const tipText = (
    <>
      <p>Standard: Cluster infrastructure costs paid by Red Hat</p>
      <p>CCS: Cluster infrastructure costs paid by the customer</p>
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
    'Cluster type',
    { title: 'Used', props: { className: 'quota-table-used' } },
    'Capacity',
  ];

  return (
    <>
      <Table aria-label="Quota Table" cells={columns} rows={sortedRows}>
        <TableHeader />
        <TableBody />
      </Table>
      {children}
    </>
  );
};

export default OSDSubscriptionTable;
