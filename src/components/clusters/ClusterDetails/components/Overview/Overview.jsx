import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  Grid, GridItem, Card, CardBody, Title, Alert, CardTitle,
} from '@patternfly/react-core';

import { OCM } from 'openshift-assisted-ui-lib';
import clusterStates, { getClusterStateAndDescription, isHibernating } from '../../../common/clusterStates';

import ResourceUsage from '../../../common/ResourceUsage/ResourceUsage';
import DetailsRight from './DetailsRight';
import DetailsLeft from './DetailsLeft';
import SubscriptionSettings from './SubscriptionSettings';
import ClusterLogs from '../ClusterLogs';
import HibernatingClusterCard from '../../../common/HibernatingClusterCard/HibernatingClusterCard';
import InstallationLogView, { shouldShowLogs } from './InstallationLogView';
import ClusterStatusMonitor from './ClusterStatusMonitor';
import { metricsStatusMessages } from '../../../common/ResourceUsage/ResourceUsage.consts';
import { hasResourceUsageMetrics } from '../Monitoring/monitoringHelper';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import InstallProgress from '../../../common/InstallProgress/InstallProgress';
import UninstallProgress from '../../../common/UninstallProgress';
import InsightsAdvisor from './InsightsAdvisor/InsightsAdvisor';
import CostBreakdownCard from './CostBreakdownCard';
import isAssistedInstallSubscription, { isUninstalledAICluster } from '../../../../../common/isAssistedInstallerCluster';

import './Overview.scss';

const { AssistedInstallerDetailCard } = OCM;
class Overview extends React.Component {
  state = {
    showInstallSuccessAlert: false,
  }

  componentDidUpdate(prevProps) {
    const { cluster } = this.props;
    if ((prevProps.cluster.state === clusterStates.INSTALLING
      || prevProps.cluster.state === clusterStates.PENDING)
        && cluster.state === clusterStates.READY
        && cluster.managed
        && prevProps.cluster.id === cluster.id) {
      // we only want to show this alert if the cluster transitioned from installing/pending
      // to Ready while the page was open.

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ showInstallSuccessAlert: true });
    }
  }

  render() {
    const {
      cluster,
      cloudProviders,
      history,
      displayClusterLogs,
      refresh,
      openModal,
      insightsData,
      userAccess,
    } = this.props;
    let topCard;

    const { showInstallSuccessAlert } = this.state;
    const clusterState = getClusterStateAndDescription(cluster);
    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
    const isDeprovisioned = get(cluster, 'subscription.status', false) === subscriptionStatuses.DEPROVISIONED;
    const metricsAvailable = hasResourceUsageMetrics(cluster)
      && (cluster.canEdit
          || (cluster.state !== clusterStates.PENDING
              && cluster.state !== clusterStates.INSTALLING));
    const metricsStatusMessage = isArchived ? metricsStatusMessages.archived
      : metricsStatusMessages[cluster.state] || metricsStatusMessages.default;

    const shouldMonitorStatus = cluster.state === clusterStates.PENDING
                             || cluster.state === clusterStates.INSTALLING
                             || cluster.state === clusterStates.UNINSTALLING;

    const showInsightsAdvisor = insightsData?.status === 200
                              && insightsData?.data && !cluster.managed
                              && !isDeprovisioned && !isArchived;
    const showResourceUsage = !isHibernating(cluster.state)
      && !isAssistedInstallSubscription(cluster.subscription)
      && !shouldShowLogs(cluster) && !isDeprovisioned && !isArchived;
    const showCostBreakdown = !cluster.managed && userAccess.fulfilled
      && userAccess.data !== undefined && userAccess.data === true
      && !isDeprovisioned && !isArchived;
    const showSidePanel = showInsightsAdvisor || showCostBreakdown;
    const showAssistedInstallerDetailCard = cluster.aiCluster && !isArchived
      && isAssistedInstallSubscription(cluster.subscription);
    const showDetailsCard = !cluster.aiCluster || !isUninstalledAICluster(cluster);
    const showSubscriptionSettings = !isDeprovisioned && !isArchived;

    if (isHibernating(cluster.state)) {
      topCard = (
        <HibernatingClusterCard cluster={cluster} openModal={openModal} />
      );
    } else if (cluster.state === clusterStates.UNINSTALLING) {
      topCard = !isAssistedInstallSubscription(cluster.subscription) && shouldShowLogs(cluster) && (
      <>
        <UninstallProgress cluster={cluster}>
          <ClusterStatusMonitor cluster={cluster} refresh={refresh} history={history} />
          <InstallationLogView
            cluster={cluster}
          />
        </UninstallProgress>
      </>
      );
    } else {
      topCard = !isAssistedInstallSubscription(cluster.subscription) && shouldShowLogs(cluster) && (
        <>
          <InstallProgress cluster={cluster}>
            <ClusterStatusMonitor cluster={cluster} refresh={refresh} history={history} />
            <InstallationLogView
              cluster={cluster}
            />
          </InstallProgress>
        </>
      );
    }

    const resourceUsage = (
      <Card className="ocm-c-overview-resource-usage__card">
        <CardTitle className="ocm-c-overview-resource-usage__card--header">
          <Title headingLevel="h2" className="card-title">Resource usage</Title>
          { showInstallSuccessAlert && <Alert variant="success" isInline title="Cluster installed successfully" />}
          { shouldMonitorStatus && (
          <ClusterStatusMonitor refresh={refresh} cluster={cluster} history={history} />
          )}
        </CardTitle>
        <CardBody className="ocm-c-overview-resource-usage__card--body">
          <ResourceUsage
            metricsAvailable={metricsAvailable}
            metricsStatusMessage={metricsStatusMessage}
            cpu={{
              used: cluster.metrics.cpu.used,
              total: cluster.metrics.cpu.total,
            }}
            memory={{
              used: cluster.metrics.memory.used,
              total: cluster.metrics.memory.total,
            }}
            type="threshold"
          />
        </CardBody>
      </Card>
    );

    return (
      <Grid hasGutter>
        <GridItem sm={12} xl2={showSidePanel ? 9 : 12}>
          <Grid hasGutter>
            { topCard }
            {showAssistedInstallerDetailCard && (
            <AssistedInstallerDetailCard aiClusterId={cluster.aiCluster.id} />
            )}
            { (showResourceUsage && !showSidePanel) && resourceUsage}
            {showDetailsCard && (
            <Card className="ocm-c-overview-details__card">
              <CardTitle className="ocm-c-overview-details__card--header">
                <Title headingLevel="h2" className="card-title">Details</Title>
              </CardTitle>
              <CardBody className="ocm-c-overview-details__card--body">
                <Grid>
                  <GridItem sm={6}>
                    <DetailsLeft
                      cluster={cluster}
                      cloudProviders={cloudProviders}
                    />
                  </GridItem>
                  <GridItem sm={6}>
                    <DetailsRight
                      cluster={{ ...cluster, state: clusterState }}
                    />
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
            )}
            {showSubscriptionSettings && <SubscriptionSettings />}
          </Grid>
        </GridItem>
        {showSidePanel && (
          <GridItem sm={12} xl2={3}>
            <Grid hasGutter>
              {showResourceUsage && (
              <GridItem sm={6} xl2={12}>
                {resourceUsage}
              </GridItem>
              )}
              {showInsightsAdvisor && (
              <GridItem sm={6} xl2={12}>
                <Card className="ocm-c-overview-advisor--card">
                  <CardBody>
                    <InsightsAdvisor insightsData={insightsData} />
                  </CardBody>
                </Card>
              </GridItem>
              )}
              {showCostBreakdown && (
                <GridItem sm={6} xl2={12}>
                  <CostBreakdownCard clusterId={cluster.external_id} />
                </GridItem>
              )}
            </Grid>
          </GridItem>
        )}
        {displayClusterLogs && (
          <GridItem sm={12}>
            <ClusterLogs externalClusterID={cluster.external_id} history={history} />
          </GridItem>
        )}
      </Grid>
    );
  }
}

Overview.propTypes = {
  cluster: PropTypes.object,
  cloudProviders: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  displayClusterLogs: PropTypes.bool.isRequired,
  refresh: PropTypes.func,
  openModal: PropTypes.func.isRequired,
  insightsData: PropTypes.object,
  userAccess: PropTypes.shape({
    data: PropTypes.bool,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
};

export default Overview;
