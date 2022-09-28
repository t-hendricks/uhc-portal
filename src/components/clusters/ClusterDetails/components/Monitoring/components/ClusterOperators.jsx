import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';

import {
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';

import {
  operatorsStatuses,
  monitoringItemLinkProps,
  monitoringItemTypes,
} from '../monitoringHelper';

function ClusterOperatorsTable({ operators = [], clusterConsole }) {
  const columns = [{ title: 'Name' }, { title: 'Status' }, { title: 'Version' }];

  const operatorStatus = (status) => {
    let icon;
    let statusStr;
    switch (status) {
      case operatorsStatuses.AVAILABLE:
        icon = <CheckCircleIcon className="status-icon success" />;
        statusStr = 'Available';
        break;
      case operatorsStatuses.FAILING:
        icon = <ExclamationCircleIcon className="status-icon danger" />;
        statusStr = 'Failing';
        break;
      case operatorsStatuses.UPGRADING:
        icon = <InProgressIcon className="status-icon" />;
        statusStr = 'Updating';
        break;
      case operatorsStatuses.DEGRADED:
        icon = <ExclamationTriangleIcon className="status-icon warning" />;
        statusStr = 'Degraded';
        break;
      default:
        icon = <UnknownIcon className="status-icon" />;
        statusStr = 'Unknown';
    }
    return (
      <>
        {icon}
        <span>{statusStr}</span>{' '}
      </>
    );
  };

  const rows = operators.map((operator) => {
    const operatorLinkProps = monitoringItemLinkProps(
      clusterConsole,
      monitoringItemTypes.OPERATOR,
      operator.name,
    );
    const operatorName =
      operatorLinkProps !== null ? <a {...operatorLinkProps}>{operator.name}</a> : operator.name;
    return {
      cells: [
        { title: operatorName },
        { title: operatorStatus(operator.condition) },
        { title: operator.version },
      ],
    };
  });

  return (
    <Table
      variant={TableVariant.compact}
      borders={false}
      cells={columns}
      rows={rows}
      aria-label="operators"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}

ClusterOperatorsTable.propTypes = {
  operators: PropTypes.array,
  clusterConsole: PropTypes.object,
};

export default ClusterOperatorsTable;
