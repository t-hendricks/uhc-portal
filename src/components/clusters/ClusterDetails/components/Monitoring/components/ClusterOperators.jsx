import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';

import {
  OkIcon, ExclamationCircleIcon, InProgressIcon, UnknownIcon,
} from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100, global_success_color_100 } from '@patternfly/react-tokens';

import { statuses } from '../statusHelper';


function ClusterOperatorsTable({ operators = [] }) {
  const columns = [
    { title: 'Name' },
    { title: 'Status' },
    { title: 'Version' },
  ];

  const operatorStatus = (status) => {
    let icon;
    let statusStr;
    switch (status) {
      case statuses.AVAILABLE:
        icon = <OkIcon className="status-icon" color={global_success_color_100.value} size="md" />;
        statusStr = 'Available';
        break;
      case statuses.FAILING:
        icon = <ExclamationCircleIcon className="status-icon" color={global_danger_color_100.value} size="md" />;
        statusStr = 'Failing';
        break;
      case statuses.UPDATING:
        icon = <InProgressIcon className="status-icon" size="md" />;
        statusStr = 'Updating';
        break;
      default:
        icon = <UnknownIcon className="status-icon" size="md" />;
        statusStr = 'Unknown';
    }
    return (
      <React.Fragment>
        {icon}
        <span>{statusStr}</span>
        {' '}
      </React.Fragment>
    );
  };

  const rows = operators.map(operator => ([
    { title: operator.name },
    { title: operatorStatus(operator.status) },
    { title: operator.version },
  ]));

  return (
    <Table variant={TableVariant.compact} borders={false} cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
}

ClusterOperatorsTable.propTypes = {
  operators: PropTypes.array,
};

export default ClusterOperatorsTable;
