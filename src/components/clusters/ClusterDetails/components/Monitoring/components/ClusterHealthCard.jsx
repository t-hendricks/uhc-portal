import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, Split, SplitItem, Title } from '@patternfly/react-core';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
  DisconnectedIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';

// eslint-disable-next-line camelcase
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { monitoringStatuses } from '../monitoringHelper';

function ClusterHealthCard({
  status = monitoringStatuses.NO_METRICS,
  discoveredIssues = null,
  lastCheckIn,
}) {
  let icon;
  let title;
  switch (status) {
    case monitoringStatuses.DISCONNECTED:
      icon = <DisconnectedIcon />;
      title = <Title headingLevel="h2">Disconnected cluster</Title>;
      break;
    case monitoringStatuses.UPGRADING:
      icon = <InProgressIcon />;
      title = <Title headingLevel="h2">Cluster is updating</Title>;
      break;
    case monitoringStatuses.NO_METRICS:
      icon = <ExclamationTriangleIcon className="warning" />;
      title = <Title headingLevel="h2">Cluster has no metrics</Title>;
      break;
    case monitoringStatuses.HEALTHY:
      icon = <CheckCircleIcon className="success" />;
      title = <Title headingLevel="h2">No issues detected</Title>;
      break;
    case monitoringStatuses.HAS_ISSUES:
      icon = <ExclamationCircleIcon className="status-icon danger" />;
      title = (
        <Title headingLevel="h2">
          {discoveredIssues} {discoveredIssues === 1 ? 'issue' : 'issues'} detected
        </Title>
      );
      break;
    default:
      icon = <UnknownIcon />;
      title = <Title headingLevel="h2">Cluster health is unknown</Title>;
  }

  return (
    <Card className="ocm-c-monitoring-health__card">
      <CardTitle className="ocm-c-monitoring-health__card--header">
        <Split>
          <SplitItem>{icon}</SplitItem>
          <SplitItem isFilled>{title}</SplitItem>
          <SplitItem className="last-checkin">
            {status === monitoringStatuses.UNKNOWN && (
              <ExclamationCircleIcon className="danger" size="md" />
            )}
            {lastCheckIn !== undefined && (
              <>
                Last check-in: <DateFormat date={lastCheckIn} type="relative" />
              </>
            )}
          </SplitItem>
        </Split>
      </CardTitle>
    </Card>
  );
}

ClusterHealthCard.propTypes = {
  status: PropTypes.string,
  discoveredIssues: PropTypes.number,
  lastCheckIn: PropTypes.instanceOf(Date),
};

export default ClusterHealthCard;
