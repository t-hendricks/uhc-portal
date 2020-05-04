import React, { Component } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import {
  PageHeader, PageHeaderTitle, Spinner,
} from '@redhat-cloud-services/frontend-components';

import {
  PageSection,
  Title,
  CardBody,
  EmptyState,
  EmptyStateBody,
  Card,
  CardHeader,
  Bullseye,
  Grid,
  GridItem,
} from '@patternfly/react-core';

import {
  ExclamationCircleIcon,
} from '@patternfly/react-icons';

import {
  // eslint-disable-next-line camelcase
  global_danger_color_100,
} from '@patternfly/react-tokens';
import SmallClusterChart from '../clusters/common/ResourceUsage/SmallClusterChart';
import ResourceUsage from '../clusters/common/ResourceUsage/ResourceUsage';
import OverviewEmptyState from './OverviewEmptyState';
import ExpiredTrialsCard from './ExpiredTrialsCard';
import ClustersWithIssuesTableCard from './ClustersWithIssuesTableCard';
import EditSubscriptionSettingsDialog from '../clusters/common/EditSubscriptionSettingsDialog';
import ArchiveClusterDialog from '../clusters/common/ArchiveClusterDialog';

class Overview extends Component {
  componentDidMount() {
    const {
      dashboards,
      getSummaryDashboard,
    } = this.props;
    if (!dashboards.fulfilled && !dashboards.pending) {
      getSummaryDashboard();
    }
  }

  componentDidUpdate() {
    const {
      dashboards,
      getSummaryDashboard,
    } = this.props;
    if (!dashboards.fulfilled && !dashboards.pending) {
      getSummaryDashboard();
    }
  }

  render() {
    const {
      dashboards,
      invalidateSubscriptions,
    } = this.props;
    if (!dashboards.fulfilled || dashboards.pending) {
      return (
        <EmptyState>
          <EmptyStateBody>
            <Spinner centered />
          </EmptyStateBody>
        </EmptyState>
      );
    }

    // summary dashboard contain only one {time, value} pair - the current value.
    const summaryDashboard = dashboards.summary;
    const totalClusters = get(summaryDashboard, 'clusters_total[0].value', 0);
    const totalConnectedClusters = get(summaryDashboard, 'connected_clusters_total[0].value', 0);
    const totalClustersWithIssues = get(summaryDashboard, 'clusters_with_issues_total[0].value', 0);
    const totalCPU = get(summaryDashboard, 'sum_total_cpu[0]', { value: 0 });
    const usedCPU = get(summaryDashboard, 'sum_used_cpu[0]', { value: 0 });
    const totalMem = get(summaryDashboard, 'sum_total_memory[0]', { value: 0 });
    const usedMem = get(summaryDashboard, 'sum_used_memory[0]', { value: 0 });
    const upToDate = get(summaryDashboard, 'clusters_up_to_date_total[0]', { value: 0 });
    const upgradeAvailable = get(summaryDashboard, 'clusters_upgrade_available_total[0]', { value: 0 });

    // Revert to an "empty" state if there are no clusters to show.
    if (!totalClusters) {
      return (
        <PageSection>
          <OverviewEmptyState />
        </PageSection>
      );
    }

    return (
      <>
        <PageHeader>
          <PageHeaderTitle title="Overview" className="page-title" />
        </PageHeader>
        <PageSection>
          <Grid gutter="sm" id="overview-grid">
            <GridItem span={3}>
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
            <GridItem span={9} rowSpan={2}>
              <Card id="metrics-charts">
                <CardHeader>
                  CPU and Memory utilization
                </CardHeader>
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
              </Card>
            </GridItem>
            <GridItem span={3}>
              <Card className="clusters-overview-card">
                <CardHeader>
                  Clusters with issues
                </CardHeader>
                <CardBody>
                  <Bullseye>
                    <Title headingLevel="h1" size="3xl" id="clusters-with-issues">
                      { totalClustersWithIssues }
                    </Title>
                    <ExclamationCircleIcon
                      className="status-icon"
                      color={global_danger_color_100.value}
                      size="sm"
                    />
                  </Bullseye>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12}>
              <ClustersWithIssuesTableCard />
            </GridItem>
            <GridItem span={6}>
              <Card className="clusters-overview-card">
                <CardHeader>
                    Update status
                </CardHeader>
                <CardBody>
                  <SmallClusterChart
                    donutId="update_available_donut"
                    used={upToDate.value}
                    total={upgradeAvailable.value + upToDate.value}
                    unit="clusters"
                    availableTitle="Update available"
                    usedTitle="Up-to-date"
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={6}>
              <Card className="clusters-overview-card">
                <CardHeader>
                    Telemetry
                </CardHeader>
                <CardBody>
                  <SmallClusterChart
                    donutId="connected_clusters_donut"
                    used={totalConnectedClusters}
                    total={totalClusters}
                    availableTitle="Not checking in"
                    usedTitle="Connected"
                    unit="clusters"
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12}>
              <ExpiredTrialsCard />
            </GridItem>
          </Grid>
          <EditSubscriptionSettingsDialog onClose={invalidateSubscriptions} />
          <ArchiveClusterDialog onClose={invalidateSubscriptions} />
        </PageSection>
      </>
    );
  }
}

Overview.propTypes = {
  getSummaryDashboard: PropTypes.func.isRequired,
  invalidateSubscriptions: PropTypes.func.isRequired,
  dashboards: PropTypes.object.isRequired,
};

export default Overview;
