import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';
import {
  Title,
  EmptyState,
  EmptyStateIcon,
} from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100, global_warning_color_100 } from '@patternfly/react-tokens';

import {
  alertsSeverity,
  monitoringItemLinkProps,
  monitoringItemTypes,
} from '../monitoringHelper';


function AlertsTable({ alerts = [], clusterConsole }) {
  const errorIcon = (
    <>
      <ExclamationCircleIcon className="status-icon" color={global_danger_color_100.value} size="md" />
      <span>Warning</span>
    </>
  );
  const warningIcon = (
    <>
      <ExclamationTriangleIcon className="status-icon" color={global_warning_color_100.value} size="md" />
      <span>Critical</span>
    </>
  );

  const columns = [
    { title: 'Name' },
    { title: 'Severity' },
  ];

  if (alerts.length === 1 && alerts[0].name === 'Watchdog') {
    return (
      <EmptyState>
        <EmptyStateIcon icon={CheckCircleIcon} />
        <Title headingLevel="h5" size="lg">No alerts firing</Title>
      </EmptyState>
    );
  }

  const rows = alerts.map((alert) => {
    if (alert.name === 'Watchdog') {
      return null;
    }
    let severityIcon = null;
    if (alert.severity === alertsSeverity.WARNING) {
      severityIcon = warningIcon;
    }
    if (alert.severity === alertsSeverity.CRITICAL) {
      severityIcon = errorIcon;
    }
    const alertLinkProps = monitoringItemLinkProps(
      clusterConsole, monitoringItemTypes.ALERT, alert.name,
    );
    const alertName = alertLinkProps !== null
      ? (<a {...alertLinkProps}>{alert.name}</a>) : alert.name;
    return (
      {
        cells:
        [{ title: alertName }, { title: severityIcon }],
      });
  });

  return (
    <Table variant={TableVariant.compact} borders={false} cells={columns} rows={rows} aria-label="alerts">
      <TableHeader />
      <TableBody />
    </Table>
  );
}

AlertsTable.propTypes = {
  alerts: PropTypes.array,
  clusterConsole: PropTypes.object,
};

export default AlertsTable;
