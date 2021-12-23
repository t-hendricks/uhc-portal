import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  CardBody,
  Card,
  Bullseye,
  GridItem,
  EmptyStateBody,
  EmptyState, CardTitle,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import ResourceUsage from '../../clusters/common/ResourceUsage/ResourceUsage';
import ClustersWithIssuesCard from '../ClustersWithIssuesCard';

const TopOverviewSection = ({
  totalClusters,
  totalUnhealthyClusters,
  totalConnectedClusters,
  totalCPU,
  usedCPU,
  totalMem,
  usedMem,
  isError,
}) => {
  const errorBody = (
    <CardBody>
      <EmptyState>
        <Title headingLevel="h2">
          No data available
        </Title>
        <EmptyStateBody>
          There was an error fetching the data. Try refreshing the page.
        </EmptyStateBody>
      </EmptyState>
    </CardBody>
  );

  if (isError) {
    return (
      <>
        <GridItem md={3}>
          <Card className="ocm-overview-clusters__card">
            <CardTitle>
              Clusters
            </CardTitle>
            { errorBody }
          </Card>
        </GridItem>
        <GridItem md={9} rowSpan={2}>
          <Card className="ocm-c-metrics-charts__card">
            <CardTitle>
              CPU and Memory utilization
            </CardTitle>
            { errorBody }
          </Card>
        </GridItem>
        <GridItem md={3}>
          <ClustersWithIssuesCard
            isError={isError}
            totalUnhealthyClusters={totalUnhealthyClusters}
            totalConnectedClusters={totalConnectedClusters}
          />
        </GridItem>
      </>
    );
  }

  const dataAvailable = (totalConnectedClusters > 0 && (totalCPU > 0 || totalMem.value > 0));

  const resourceUsageBody = dataAvailable ? (
    <CardBody>
      <ResourceUsage
        cpu={{
          total: totalCPU,
          used: usedCPU,
        }}
        memory={{
          total: {
            value: totalMem.value,
            unit: 'B',
          },
          used: {
            value: usedMem.value,
            unit: 'B',
          },
        }}
        metricsAvailable
        type="legend"
      />
    </CardBody>
  ) : (
    <CardBody>
      <EmptyState>
        <Title headingLevel="h2">
          No data available
        </Title>
        <EmptyStateBody>
          Check individual clusters web console if you expect that they should be sending metrics.
          Note that data is not available for clusters that are installing.
        </EmptyStateBody>
      </EmptyState>
    </CardBody>
  );

  return (
    <>
      <GridItem md={3}>
        <Link to="/" className="overview-clusters-link">
          <Card className="ocm-overview-clusters__card">
            <CardTitle>
              Clusters
            </CardTitle>
            <CardBody>
              <Bullseye>
                <Title headingLevel="h1" size="3xl">
                  {totalClusters}
                </Title>
              </Bullseye>
            </CardBody>
          </Card>
        </Link>
      </GridItem>
      <GridItem md={9} rowSpan={2}>
        <Card className="ocm-c-metrics-charts__card">
          <CardTitle>
            CPU and Memory utilization
          </CardTitle>
          { resourceUsageBody }
        </Card>
      </GridItem>
      <GridItem md={3}>
        <ClustersWithIssuesCard
          isError={isError}
          totalUnhealthyClusters={totalUnhealthyClusters}
          totalConnectedClusters={totalConnectedClusters}
        />
      </GridItem>
    </>
  );
};

TopOverviewSection.propTypes = {
  totalClusters: PropTypes.number.isRequired,
  totalUnhealthyClusters: PropTypes.number.isRequired,
  totalConnectedClusters: PropTypes.number.isRequired,
  totalCPU: PropTypes.object.isRequired,
  usedCPU: PropTypes.object.isRequired,
  totalMem: PropTypes.object.isRequired,
  usedMem: PropTypes.object.isRequired,
  isError: PropTypes.bool.isRequired,
};

export default TopOverviewSection;
