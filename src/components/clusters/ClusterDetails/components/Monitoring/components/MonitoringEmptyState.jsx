import React from 'react';
import PropTypes from 'prop-types';

import {
  Title,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core';

import { ExclamationTriangleIcon } from '@patternfly/react-icons';

import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

function MonitoringEmptyState(
  {
    children = null,
    hideLastCheckIn = false,
    lastCheckIn = null,
    hideIcon = false,
    title = 'Monitoring data is not available',
  },
) {
  return (
    <EmptyState>
      {!hideIcon && <EmptyStateIcon icon={ExclamationTriangleIcon} />}
      <Title headingLevel="h5" size="lg">{title}</Title>
      <EmptyStateBody>
        {children}
        {!hideLastCheckIn && (
          <p>
            Last Check-in:
            {' '}
            <DateFormat date={lastCheckIn} type="relative" />
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
