import React from 'react';
import PropTypes from 'prop-types';

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

function MonitoringEmptyState({
  children = null,
  hideLastCheckIn = false,
  lastCheckIn = null,
  hideIcon = false,
  title = 'Monitoring data is not available',
}) {
  return (
    <EmptyState>
      {!hideIcon && <EmptyStateIcon icon={ExclamationTriangleIcon} />}
      <EmptyStateHeader titleText={title} headingLevel="h5" />
      <EmptyStateBody>
        {children}
        {!hideLastCheckIn && (
          <p>
            Last Check-in: <DateFormat date={lastCheckIn} type="relative" />
          </p>
        )}
      </EmptyStateBody>
    </EmptyState>
  );
}

MonitoringEmptyState.propTypes = {
  children: PropTypes.node,
  hideLastCheckIn: PropTypes.bool,
  lastCheckIn: PropTypes.instanceOf(Date),
  hideIcon: PropTypes.bool,
  title: PropTypes.string,
};

export default MonitoringEmptyState;
