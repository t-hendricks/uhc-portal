import React from 'react';
import PropTypes from 'prop-types';

import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { UnknownIcon } from '@patternfly/react-icons/dist/esm/icons/unknown-icon';
import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import {
  monitoringItemLinkProps,
  monitoringItemTypes,
  operatorsStatuses,
} from '../monitoringHelper';

function ClusterOperatorsTable({ operators = [], clusterConsole }) {
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
    const operatorCondition = operatorStatus(operator.condition);
    const operatorVersion = operator.version;
    const operatorKey = operator.name;

    return {
      operatorName,
      operatorCondition,
      operatorVersion,
      operatorKey,
    };
  });

  return (
    <Table variant={TableVariant.compact} borders={false} aria-label="operators">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Version</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.operatorKey}>
            <Td>{row.operatorName}</Td>
            <Td>{row.operatorCondition}</Td>
            <Td>{row.operatorVersion}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

ClusterOperatorsTable.propTypes = {
  operators: PropTypes.array,
  clusterConsole: PropTypes.object,
};

export default ClusterOperatorsTable;
