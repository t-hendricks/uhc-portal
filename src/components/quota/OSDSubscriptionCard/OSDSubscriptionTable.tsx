import React from 'react';
import orderBy from 'lodash/orderBy';

import { IRowCell } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';

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
      Plan type <PopoverHint hint={tipText} />
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
      <TableDeprecated aria-label="Quota Table" cells={columns} rows={sortedRows}>
        <TableHeaderDeprecated />
        <TableBodyDeprecated />
      </TableDeprecated>
      {children}
    </>
  );
};

export default OSDSubscriptionTable;
