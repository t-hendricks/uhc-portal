import React from 'react';
import PropTypes from 'prop-types';

import {
  Title,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core';

import { ExclamationTriangleIcon } from '@patternfly/react-icons';

function MonitoringEmptyState(
  {
    children = null, hideLastCheckIn = false, lastCheckInText = null, hideIcon = false,
  },
) {
  return (
    <EmptyState>
      {!hideIcon && <EmptyStateIcon icon={ExclamationTriangleIcon} />}
      <Title headingLevel="h5" size="lg">Monitoring Data is not available</Title>
      <EmptyStateBody>
        {children}
        {!hideLastCheckIn && <p>{lastCheckInText}</p>}
      </EmptyStateBody>
    </EmptyState>
  );
}

MonitoringEmptyState.propTypes = {
  children: PropTypes.node,
  hideLastCheckIn: PropTypes.bool,
  lastCheckInText: PropTypes.string,
  hideIcon: PropTypes.bool,
};

export default MonitoringEmptyState;
