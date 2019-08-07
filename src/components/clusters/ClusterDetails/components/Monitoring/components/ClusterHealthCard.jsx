import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardBody,
  Title,
  Split,
  SplitItem,
} from '@patternfly/react-core';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';

// eslint-disable-next-line camelcase
import { global_danger_color_100, global_success_color_100 } from '@patternfly/react-tokens';

import { statuses } from '../statusHelper';

function ClusterHealthCard({ status = 'UNKNOWN', discoveredIssues = null, lastCheckIn = null }) {
  let icon;
  let title;
  switch (status) {
    case statuses.HEALTHY:
      icon = <CheckCircleIcon color={global_success_color_100.value} size="md" />;
      title = <Title headingLevel="h2" size="3xl">Cluster is healthy</Title>;
      break;
    case statuses.HAS_ISSUES:
      icon = <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />;
      title = <Title headingLevel="h2" size="3xl">Issues detected</Title>;
      break;
    case statuses.UPDATING:
      icon = <InProgressIcon size="md" />;
      title = <Title headingLevel="h2" size="3xl">Cluster is updating</Title>;
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
      <CardBody>
        {discoveredIssues && (
        <span>
          {discoveredIssues}
          {' '}
          discovered issues
        </span>
        )}
      </CardBody>
    </Card>
  );
}

ClusterHealthCard.propTypes = {
  status: PropTypes.string,
  discoveredIssues: PropTypes.number,
  lastCheckIn: PropTypes.string,
};


export default ClusterHealthCard;
