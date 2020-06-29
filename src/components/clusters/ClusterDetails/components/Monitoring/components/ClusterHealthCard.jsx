import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Title,
  Split,
  SplitItem,
} from '@patternfly/react-core';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
  DisconnectedIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';

// eslint-disable-next-line camelcase
import { global_danger_color_100, global_success_color_100, global_warning_color_100 } from '@patternfly/react-tokens';

import { monitoringStatuses } from '../monitoringHelper';

function ClusterHealthCard({
  status = monitoringStatuses.NO_METRICS,
  discoveredIssues = null,
  lastCheckIn = null,
}) {
  let icon;
  let title;
  switch (status) {
    case monitoringStatuses.DISCONNECTED:
      icon = <DisconnectedIcon size="md" />;
      title = <Title headingLevel="h2" size="lg" className="card-title">Disconnected cluster</Title>;
      break;
    case monitoringStatuses.UPGRADING:
      icon = <InProgressIcon size="md" />;
      title = <Title headingLevel="h2" size="lg" className="card-title">Cluster is updating</Title>;
      break;
    case monitoringStatuses.INSTALLING:
      icon = <InProgressIcon size="md" />;
      title = <Title headingLevel="h2" size="lg" className="card-title">Installation in progress</Title>;
      break;
    case monitoringStatuses.NO_METRICS:
      icon = <ExclamationTriangleIcon size="md" color={global_warning_color_100.value} />;
      title = <Title headingLevel="h2" size="lg" className="card-title">Cluster has no metrics</Title>;
      break;
    case monitoringStatuses.HEALTHY:
      icon = <CheckCircleIcon color={global_success_color_100.value} size="md" />;
      title = <Title headingLevel="h2" size="lg" className="card-title">No issues detected</Title>;
      break;
    case monitoringStatuses.HAS_ISSUES:
      icon = <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />;
      title = (
        <Title headingLevel="h2" size="lg" className="card-title">
          {discoveredIssues}
          {' '}
          {discoveredIssues === 1 ? 'issue' : 'issues'}
          {' '}
          detected
        </Title>
      );
      break;
    default:
      icon = <UnknownIcon size="md" />;
      title = <Title headingLevel="h2" size="lg" className="card-title">Cluster health is unknown</Title>;
  }

  return (
    <Card id="cluster-health">
      <CardHeader>
        <Split>
          <SplitItem>
            {icon}
          </SplitItem>
          <SplitItem isFilled>
            {title}
          </SplitItem>
          <SplitItem>
            {status === monitoringStatuses.UNKNOWN && <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />}
            {lastCheckIn && `Last check-in: ${lastCheckIn}`}
          </SplitItem>
        </Split>
      </CardHeader>
    </Card>
  );
}

ClusterHealthCard.propTypes = {
  status: PropTypes.string,
  discoveredIssues: PropTypes.number,
  lastCheckIn: PropTypes.string,
};


export default ClusterHealthCard;
