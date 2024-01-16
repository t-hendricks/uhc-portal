import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardBody, Bullseye, Title, Icon } from '@patternfly/react-core';

import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { OkIcon } from '@patternfly/react-icons/dist/esm/icons/ok-icon';

import {
  // eslint-disable-next-line camelcase
  global_danger_color_100,
} from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import {
  // eslint-disable-next-line camelcase
  global_success_color_100,
} from '@patternfly/react-tokens/dist/esm/global_success_color_100';

const ClustersWithIssuesCard = ({ totalUnhealthyClusters, totalConnectedClusters, isError }) => {
  if (isError) {
    return (
      <Card className="ocm-overview-clusters__card">
        <CardTitle>Clusters with issues</CardTitle>
        <CardBody>
          <Bullseye>
            <Title headingLevel="h2">No data available</Title>
            <span className="empty-state-color">
              There was an error fetching the data. Try refreshing the page.
            </span>
          </Bullseye>
        </CardBody>
      </Card>
    );
  }

  if (!totalConnectedClusters) {
    return (
      <Card className="ocm-overview-clusters__card">
        <CardTitle>Clusters with issues</CardTitle>
        <CardBody>
          <Bullseye>
            <span className="empty-state-color">No data available</span>
          </Bullseye>
        </CardBody>
      </Card>
    );
  }

  const icon =
    totalUnhealthyClusters === 0 ? (
      <>
        <Icon className="status-icon" size="sm">
          <OkIcon color={global_success_color_100.value} />
        </Icon>
      </>
    ) : (
      <>
        <Icon className="status-icon" size="sm">
          <ExclamationCircleIcon color={global_danger_color_100.value} />
        </Icon>
      </>
    );

  const cardContent = (
    <>
      <span
        className={
          totalUnhealthyClusters > 0 ? 'clusters-with-issues-non-zero' : 'clusters-with-issues-zero'
        }
      >
        {totalUnhealthyClusters}
      </span>
    </>
  );
  return (
    <Card className="ocm-overview-clusters__card">
      <CardTitle>Clusters with issues</CardTitle>
      <CardBody>
        <Bullseye>
          {cardContent}
          {icon}
        </Bullseye>
      </CardBody>
    </Card>
  );
};

ClustersWithIssuesCard.propTypes = {
  totalConnectedClusters: PropTypes.number.isRequired,
  totalUnhealthyClusters: PropTypes.number.isRequired,
  isError: PropTypes.bool.isRequired,
};

export default ClustersWithIssuesCard;
