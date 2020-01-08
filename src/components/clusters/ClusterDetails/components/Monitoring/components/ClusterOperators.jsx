import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';

import {
  ExclamationCircleIcon, InProgressIcon, UnknownIcon, CheckCircleIcon, ExclamationTriangleIcon,
} from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_success_color_100, global_warning_color_100, global_danger_color_100 } from '@patternfly/react-tokens';

import {
  operatorsStatuses,
  monitoringItemLinkProps,
  monitoringItemTypes,
} from '../monitoringHelper';

function ClusterOperatorsTable({ operators = [], clusterConsole }) {
  const columns = [
    { title: 'Name' },
    { title: 'Status' },
    { title: 'Version' },
  ];

  const operatorStatus = (status) => {
    let icon;
    let statusStr;
    switch (status) {
      case operatorsStatuses.AVAILABLE:
        icon = <CheckCircleIcon className="status-icon" color={global_success_color_100.value} size="md" />;
        statusStr = 'Available';
        break;
      case operatorsStatuses.FAILING:
        icon = <ExclamationCircleIcon className="status-icon" color={global_danger_color_100.value} size="md" />;
        statusStr = 'Failing';
        break;
      case operatorsStatuses.UPGRADING:
        icon = <InProgressIcon className="status-icon" size="md" />;
        statusStr = 'Updating';
        break;
      case operatorsStatuses.DEGRADED:
        icon = <ExclamationTriangleIcon className="status-icon" size="md" color={global_warning_color_100.value} />;
        statusStr = 'Degraded';
        break;
      default:
        icon = <UnknownIcon className="status-icon" size="md" />;
        statusStr = 'Unknown';
    }
    return (
      <>
        {icon}
        <span>{statusStr}</span>
        {' '}
      </>
    );
  };

  const rows = operators.map((operator) => {
    const operatorLinkProps = monitoringItemLinkProps(
      clusterConsole, monitoringItemTypes.OPERATOR, operator.name,
    );
    const operatorName = operatorLinkProps !== null
      ? (<a {...operatorLinkProps}>{operator.name}</a>) : operator.name;
    return (
      {
        cells: [
          { title: operatorName },
          { title: operatorStatus(operator.condition) },
          { title: operator.version },
        ],
      }
    );
  });

  return (
    <Table variant={TableVariant.compact} borders={false} cells={columns} rows={rows} aria-label="operators">
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
