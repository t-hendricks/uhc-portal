import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  PageSection,
  CardTitle,
  CardBody,
  EmptyState,
  EmptyStateBody,
  Card,
  Grid,
  GridItem,
} from '@patternfly/react-core';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';

import ConnectedModal from '../common/Modal/ConnectedModal';
import SmallClusterChart from '../clusters/common/ResourceUsage/SmallClusterChart';
import OverviewEmptyState from './OverviewEmptyState';
import ExpiredTrialsCard from './ExpiredTrialsCard';
import ClustersWithIssuesTableCard from './ClustersWithIssuesTableCard';
import CostCard from './CostCard';
import EditSubscriptionSettingsDialog from '../clusters/common/EditSubscriptionSettingsDialog';
import ArchiveClusterDialog from '../clusters/common/ArchiveClusterDialog';
import TopOverviewSection from './TopOverviewSection/TopOverviewSection';
import { createOverviewQueryObject } from '../../common/queryHelpers';
import Unavailable from '../common/Unavailable';
import InsightsAdvisorCard from './InsightsAdvisorCard/InsightsAdvisorCard';

import './Overview.scss';

class Overview extends Component {
  componentDidMount() {
    const {
      summaryDashboard,
      getSummaryDashboard,
      unhealthyClusters,
      getUnhealthyClusters,
      getUserAccess,
      viewOptions,
      fetchInsightsGroups,
      insightsGroups,
      getOrganizationAndQuota,
      organization,
    } = this.props;
    document.title = 'Overview | Red Hat OpenShift Cluster Manager';

    if (!summaryDashboard.fulfilled && !summaryDashboard.pending) {
      getSummaryDashboard();
    }

    if (!unhealthyClusters.fulfilled && !unhealthyClusters.pending) {
      getUnhealthyClusters(createOverviewQueryObject(viewOptions));
    }

    if (!insightsGroups.pending && !insightsGroups.fulfilled) {
      fetchInsightsGroups();
    }

    if (!organization.pending && !organization.fulfilled) {
      getOrganizationAndQuota();
    }
    getUserAccess({ type: 'OCP' });
  }

  componentDidUpdate() {
    const {
      fetchOrganizationInsights,
      insightsOverview,
      organization,
    } = this.props;

    if (!insightsOverview.rejected
      && !insightsOverview.pending
      && !insightsOverview.fulfilled
      && organization.fulfilled) {
      fetchOrganizationInsights(organization.details.data.id);
    }
  }

  render() {
    const {
      summaryDashboard,
      unhealthyClusters,
      viewOptions,
      invalidateSubscriptions,
      totalClusters,
      totalConnectedClusters,
      totalUnhealthyClusters,
      totalCPU,
      usedCPU,
      totalMem,
      usedMem,
      upToDate,
      upgradeAvailable,
      insightsGroups,
      insightsOverview,
      userAccess,
    } = this.props;

    const isError = (summaryDashboard.error || unhealthyClusters.error);
    const isPending = (!summaryDashboard.fulfilled || summaryDashboard.pending
       || !unhealthyClusters.fulfilled || unhealthyClusters.pending);
    // TODO: should show only when at least one cluster is connected and sends Insights
    const showInsightsAdvisorWidget = insightsOverview.fulfilled && insightsOverview.overview;

    if (isError) {
      let errorSource;
      if (summaryDashboard.error) {
        errorSource = summaryDashboard;
      } else {
        errorSource = unhealthyClusters;
      }
      const { errorMessage, errorCode, operationID } = errorSource;
      const response = { errorMessage, errorCode, operationID };
      return (
        <Unavailable
          response={response}
        />
      );
    }

    // Show spinner if while waiting for responses.
    if (isPending && !isError) {
      return (
        <EmptyState>
          <EmptyStateBody>
            <Spinner centered />
          </EmptyStateBody>
        </EmptyState>
      );
    }

    // Revert to an "empty" state if there are no clusters to show.
    if (summaryDashboard.fulfilled && !totalClusters) {
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
          <Grid hasGutter className="ocm-c-overview">
            <TopOverviewSection
              isError={summaryDashboard.error}
              totalClusters={totalClusters}
              totalUnhealthyClusters={totalUnhealthyClusters}
              totalConnectedClusters={totalConnectedClusters}
              totalCPU={totalCPU}
              usedCPU={usedCPU}
              totalMem={totalMem}
              usedMem={usedMem}
            />
            {totalConnectedClusters > 0 && (
            <GridItem md={6} sm={12}>
              <ClustersWithIssuesTableCard
                unhealthyClusters={unhealthyClusters}
                viewOptions={viewOptions}
              />
            </GridItem>
            )}
            {showInsightsAdvisorWidget && (
              <GridItem md={6} sm={12}>
                <InsightsAdvisorCard
                  overview={insightsOverview.overview}
                  groups={insightsGroups.groups}
                />
              </GridItem>
            )}
            <GridItem md={6} sm={12}>
              <Card className="ocm-overview-clusters__card">
                <CardTitle>
                  Telemetry
                </CardTitle>
                <CardBody>
                  {!totalConnectedClusters && !totalClusters ? (
                    <EmptyState>
                      <EmptyStateBody>
                        No data available
                      </EmptyStateBody>
                    </EmptyState>
                  ) : (
                    <SmallClusterChart
                      donutId="connected_clusters_donut"
                      used={totalConnectedClusters}
                      total={totalClusters}
                      availableTitle="Not checking in"
                      usedTitle="Connected"
                      unit="clusters"
                    />
                  )}
                </CardBody>
              </Card>
            </GridItem>
            {userAccess.fulfilled && userAccess.data !== undefined && userAccess.data === true && (
              <GridItem md={6} sm={12}>
                <CostCard />
              </GridItem>
            )}
            <GridItem md={6} sm={12}>
              <Card className="ocm-overview-clusters__card">
                <CardTitle>
                  Update status
                </CardTitle>
                <CardBody>
                  {!upgradeAvailable.value && !upToDate.value
                    ? (
                      <EmptyState>
                        <EmptyStateBody>
                          No data available
                        </EmptyStateBody>
                      </EmptyState>
                    )
                    : (
                      <SmallClusterChart
                        donutId="update_available_donut"
                        used={upToDate.value}
                        total={upgradeAvailable.value + upToDate.value}
                        unit="clusters"
                        availableTitle="Update available"
                        usedTitle="Up-to-date"
                      />
                    )}
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12}>
              <ExpiredTrialsCard />
            </GridItem>
          </Grid>
          <ConnectedModal
            ModalComponent={EditSubscriptionSettingsDialog}
            onClose={invalidateSubscriptions}
          />
          <ConnectedModal ModalComponent={ArchiveClusterDialog} onClose={invalidateSubscriptions} />
        </PageSection>
      </>
    );
  }
}

Overview.propTypes = {
  getSummaryDashboard: PropTypes.func.isRequired,
  getUserAccess: PropTypes.func.isRequired,
  invalidateSubscriptions: PropTypes.func.isRequired,
  summaryDashboard: PropTypes.object.isRequired,
  getUnhealthyClusters: PropTypes.func.isRequired,
  unhealthyClusters: PropTypes.shape({
    clusters: PropTypes.array,
    error: PropTypes.bool,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
  viewOptions: PropTypes.shape({
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  totalClusters: PropTypes.number.isRequired,
  totalConnectedClusters: PropTypes.number.isRequired,
  totalUnhealthyClusters: PropTypes.number.isRequired,
  totalCPU: PropTypes.object.isRequired,
  usedCPU: PropTypes.object.isRequired,
  totalMem: PropTypes.object.isRequired,
  usedMem: PropTypes.object.isRequired,
  upToDate: PropTypes.object.isRequired,
  upgradeAvailable: PropTypes.object.isRequired,
  fetchInsightsGroups: PropTypes.func.isRequired,
  fetchOrganizationInsights: PropTypes.func.isRequired,
  insightsGroups: PropTypes.object.isRequired,
  insightsOverview: PropTypes.object.isRequired,
  userAccess: PropTypes.shape({
    data: PropTypes.bool,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
};

export default Overview;
