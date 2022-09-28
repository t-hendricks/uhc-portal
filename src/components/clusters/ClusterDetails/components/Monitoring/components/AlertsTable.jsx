import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { Title, EmptyState, EmptyStateIcon } from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
// eslint-disable-next-line camelcase

import { alertsSeverity, monitoringItemLinkProps, monitoringItemTypes } from '../monitoringHelper';

function AlertsTable({ alerts = [], clusterConsole }) {
  const errorIcon = (
    <>
      <ExclamationCircleIcon className="status-icon danger" />
      <span>Critical</span>
    </>
  );
  const warningIcon = (
    <>
      <ExclamationTriangleIcon className="status-icon warning" />
      <span>Warning</span>
    </>
  );

  const infoIcon = (
    <>
      <InfoCircleIcon className="status-icon info" />
      <span>Info</span>
    </>
  );

  const columns = [{ title: 'Name' }, { title: 'Severity' }];

  const isNotRealAlert = (name) => name === 'Watchdog' || name === 'DeadMansSwitch';

  if (alerts.every((alert) => isNotRealAlert(alert.name))) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={CheckCircleIcon} />
        <Title headingLevel="h5" size="lg">
          No alerts firing
        </Title>
      </EmptyState>
    );
  }

  const rows = alerts
    .map((alert) => {
      if (isNotRealAlert(alert.name)) {
        return null;
      }
      let severityIcon = null;
      if (alert.severity === alertsSeverity.WARNING) {
        severityIcon = warningIcon;
      }
      if (alert.severity === alertsSeverity.CRITICAL) {
        severityIcon = errorIcon;
      }
      if (alert.severity === alertsSeverity.INFO) {
        severityIcon = infoIcon;
      }

      const alertLinkProps = monitoringItemLinkProps(
        clusterConsole,
        monitoringItemTypes.ALERT,
        alert.name,
      );
      const alertName =
        alertLinkProps !== null ? <a {...alertLinkProps}>{alert.name}</a> : alert.name;
      return {
        cells: [{ title: alertName }, { title: severityIcon }],
      };
    })
    .filter(Boolean);

  return (
    <Table
      variant={TableVariant.compact}
      borders={false}
      cells={columns}
      rows={rows}
      aria-label="alerts"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}

AlertsTable.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      severity: PropTypes.string,
    }),
  ),
  clusterConsole: PropTypes.shape({
    url: PropTypes.string,
  }),
};

export default AlertsTable;
