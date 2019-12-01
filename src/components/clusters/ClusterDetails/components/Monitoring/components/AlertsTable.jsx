import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';

import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100, global_warning_color_100 } from '@patternfly/react-tokens';

import { alertsSeverity } from '../monitoringHelper';


function AlertsTable({ alerts = [] }) {
  const errorIcon = <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />;
  const warningIcon = <ExclamationTriangleIcon color={global_warning_color_100.value} size="md" />;

  const columns = [
    { title: 'Name' },
    { title: 'Severity' },
  ];

  const rows = alerts.map((alert) => {
    let severityIcon = null;
    if (alert.severity === alertsSeverity.WARNING) {
      severityIcon = warningIcon;
    }
    if (alert.severity === alertsSeverity.CRITICAL) {
      severityIcon = errorIcon;
    }
    return ([{ title: alert.name }, { title: severityIcon }]);
  });

  return (
    <Table variant={TableVariant.compact} cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
}

AlertsTable.propTypes = {
  alerts: PropTypes.array,
};

export default AlertsTable;
