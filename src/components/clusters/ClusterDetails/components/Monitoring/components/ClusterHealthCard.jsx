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
  WarningTriangleIcon,
} from '@patternfly/react-icons';

// eslint-disable-next-line camelcase
import { global_danger_color_100, global_success_color_100, global_warning_color_100 } from '@patternfly/react-tokens';

import { statuses } from '../statusHelper';

function ClusterHealthCard({
  status = statuses.NO_METRICS,
  discoveredIssues = null,
  lastCheckIn = null,
}) {
  let icon;
  let title;
  switch (status) {
    case statuses.HEALTHY:
      icon = <CheckCircleIcon color={global_success_color_100.value} size="md" />;
      title = <Title headingLevel="h2" size="3xl">No Issues Detected</Title>;
      break;
    case statuses.HAS_ISSUES:
      icon = <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />;
      title = (
        <Title headingLevel="h2" size="3xl">
          {discoveredIssues}
          {' '}
          Issues detected
        </Title>
      );
      break;
    case statuses.INSTALLING:
      icon = <InProgressIcon size="md" />;
      title = <Title headingLevel="h2" size="3xl">Installation in progress</Title>;
      break;
    case statuses.UPDATING:
      icon = <InProgressIcon size="md" />;
      title = <Title headingLevel="h2" size="3xl">Cluster is updating</Title>;
      break;
    case statuses.DISCONNECTED:
      icon = <DisconnectedIcon size="md" />;
      title = <Title headingLevel="h2" size="3xl">Disconnected cluster</Title>;
      break;
    case statuses.NO_METRICS:
      icon = <WarningTriangleIcon size="md" color={global_warning_color_100.value} />;
      title = <Title headingLevel="h2" size="3xl">Cluster has no metrics</Title>;
      break;
    default:
      icon = <UnknownIcon size="md" />;
      title = <Title headingLevel="h2" size="3xl">Cluster health is unknown</Title>;
  }

  return (
    <Card id="cluster-health">
      <CardHeader>
        <Split>
          <SplitItem isFilled>
            <Split>
              <SplitItem>
                {icon}
              </SplitItem>
              <SplitItem>
                {title}
              </SplitItem>
            </Split>
          </SplitItem>
          <SplitItem>
            {status === statuses.UNKNOWN && <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />}
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
