import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  CardBody,
  Card,
  CardHeader,
  Bullseye,
  GridItem,
  EmptyStateBody,
  EmptyState,
} from '@patternfly/react-core';
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
        <Title>
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
        <GridItem md={3} sm={12}>
          <Card className="clusters-overview-card">
            <CardHeader>
                Clusters
            </CardHeader>
            { errorBody }
          </Card>
        </GridItem>
        <GridItem md={9} sm={12} rowSpan={2}>
          <Card id="metrics-charts">
            <CardHeader>
                CPU and Memory utilization
            </CardHeader>
            { errorBody }
          </Card>
        </GridItem>
        <GridItem md={3} sm={12}>
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
        <Title>
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
      <GridItem md={3} sm={12}>
        <Card className="clusters-overview-card">
          <CardHeader>
                  Clusters
          </CardHeader>
          <CardBody>
            <Bullseye>
              <Title headingLevel="h1" size="3xl">
                {totalClusters}
              </Title>
            </Bullseye>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem md={9} rowSpan={2} sm={12}>
        <Card id="metrics-charts">
          <CardHeader>
                  CPU and Memory utilization
          </CardHeader>
          { resourceUsageBody }
        </Card>
      </GridItem>
      <GridItem md={3} sm={12}>
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
