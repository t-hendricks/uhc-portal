import React from 'react';
import PropTypes from 'prop-types';

import { EmptyState, EmptyStateHeader, EmptyStateIcon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { TableVariant } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';

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
        <EmptyStateHeader
          titleText="No alerts firing"
          icon={<EmptyStateIcon icon={CheckCircleIcon} />}
          headingLevel="h5"
        />
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
    <TableDeprecated
      variant={TableVariant.compact}
      borders={false}
      cells={columns}
      rows={rows}
      aria-label="alerts"
    >
      <TableHeaderDeprecated />
      <TableBodyDeprecated />
    </TableDeprecated>
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
