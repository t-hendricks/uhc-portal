import React from 'react';

import { Bullseye, Card, CardBody, CardTitle, Icon, Title } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { OkIcon } from '@patternfly/react-icons/dist/esm/icons/ok-icon';
import { t_global_icon_color_status_danger_default as dangerColor } from '@patternfly/react-tokens/dist/esm/t_global_icon_color_status_danger_default';
import { t_global_icon_color_status_success_default as successColor } from '@patternfly/react-tokens/dist/esm/t_global_icon_color_status_success_default';

type ClustersWithIssuesCardProps = {
  totalConnectedClusters: number;
  totalUnhealthyClusters: number;
  isError: boolean;
};

const ClustersWithIssuesCard = ({
  totalUnhealthyClusters,
  totalConnectedClusters,
  isError,
}: ClustersWithIssuesCardProps) => {
  if (isError) {
    return (
      <Card className="ocm-overview-clusters__card" data-testid="cluster-with-issues-error">
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
      <Card className="ocm-overview-clusters__card" data-testid="cluster-with-issues-no-data">
        <CardTitle>Clusters with issues</CardTitle>
        <CardBody>
          <Bullseye>
            <span className="empty-state-color">No data available</span>
          </Bullseye>
        </CardBody>
      </Card>
    );
  }

  const icon = (
    <Icon className="status-icon" size="sm">
      {totalUnhealthyClusters === 0 ? (
        <OkIcon color={successColor.value} data-testid="ok-icon" />
      ) : (
        <ExclamationCircleIcon color={dangerColor.value} data-testid="exclamation-icon" />
      )}
    </Icon>
  );

  const className =
    totalUnhealthyClusters > 0 ? 'clusters-with-issues-non-zero' : 'clusters-with-issues-zero';
  const cardContent = <span className={className}>{totalUnhealthyClusters}</span>;
  return (
    <Card className="ocm-overview-clusters__card" data-testid="cluster-with-issues-unhealthy">
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

export default ClustersWithIssuesCard;
