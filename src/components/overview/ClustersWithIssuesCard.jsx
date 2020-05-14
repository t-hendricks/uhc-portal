import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardBody,
  Bullseye,
  EmptyStateBody,
  EmptyState,
  Title,
} from '@patternfly/react-core';

import {
  ExclamationCircleIcon,
  OutlinedQuestionCircleIcon,
  OkIcon,
} from '@patternfly/react-icons';

import {
  // eslint-disable-next-line camelcase
  global_danger_color_100,
  // eslint-disable-next-line camelcase
  global_success_color_100,
} from '@patternfly/react-tokens';


const ClustersWithIssuesCard = ({ totalUnhealthyClusters, totalConnectedClusters, isError }) => {
  if (isError) {
    return (
      <Card className="clusters-overview-card">
        <CardHeader>
            Clusters with issues
        </CardHeader>
        <CardBody>
          <EmptyState>
            <Title>
            No data available
            </Title>
            <EmptyStateBody>
            There was an error fetching the data. Try refreshing the page.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  let icon;
  if (totalUnhealthyClusters === 0) {
    icon = (totalConnectedClusters > 0)
      ? (
        <>
          <OkIcon
            className="status-icon"
            color={global_success_color_100.value}
            size="sm"
          />
        </>
      ) : (
        <OutlinedQuestionCircleIcon
          className="status-icon"
          size="md"
        />
      );
  } else {
    icon = (
      <>
        <ExclamationCircleIcon
          className="status-icon"
          color={global_danger_color_100.value}
          size="sm"
        />
      </>
    );
  }

  const cardContent = (
    <>
      <span id={totalUnhealthyClusters > 0 ? 'clusters-with-issues-non-zero' : 'clusters-with-issues-zero'}>
        { totalConnectedClusters > 0 && totalUnhealthyClusters }
      </span>
    </>
  );
  return (
    <Card className="clusters-overview-card">
      <CardHeader>
            Clusters with issues
      </CardHeader>
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
