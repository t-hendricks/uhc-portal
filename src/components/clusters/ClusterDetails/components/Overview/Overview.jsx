import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';

import { Alert, Card, CardBody, CardTitle, Grid, GridItem, Title } from '@patternfly/react-core';

import * as OCM from '@openshift-assisted/ui-lib/ocm';
import { subscriptionStatuses } from '~/common/subscriptionTypes';
import { ASSISTED_INSTALLER_FEATURE } from '~/redux/constants/featureConstants';
import { isRestrictedEnv } from '~/restrictedEnv';
import isAssistedInstallSubscription, {
  isAvailableAssistedInstallCluster,
  isUninstalledAICluster,
} from '../../../../../common/isAssistedInstallerCluster';
import withFeatureGate from '../../../../features/with-feature-gate';
import HibernatingClusterCard from '../../../common/HibernatingClusterCard/HibernatingClusterCard';
import ResourceUsage from '../../../common/ResourceUsage/ResourceUsage';
import { metricsStatusMessages } from '../../../common/ResourceUsage/ResourceUsage.consts';
import clusterStates, {
  getClusterAIPermissions,
  getClusterStateAndDescription,
  isHibernating,
} from '../../../common/clusterStates';
import { hasResourceUsageMetrics } from '../Monitoring/monitoringHelper';
import ClusterProgressCard from './ClusterProgressCard';
import ClusterStatusMonitor from './ClusterStatusMonitor';
import CostBreakdownCard from './CostBreakdownCard';
import DetailsLeft from './DetailsLeft';
import DetailsRight from './DetailsRight';
import InsightsAdvisor from './InsightsAdvisor/InsightsAdvisor';
import { shouldShowLogs } from './InstallationLogView';
import SubscriptionSettings from './SubscriptionSettings';

import './Overview.scss';

const { AssistedInstallerDetailCard, AssistedInstallerExtraDetailCard } = OCM;
const GatedAIDetailCard = withFeatureGate(
  AssistedInstallerDetailCard,
  ASSISTED_INSTALLER_FEATURE,
  () => false,
);
const GatedAIExtraDetailCard = withFeatureGate(
  AssistedInstallerExtraDetailCard,
  ASSISTED_INSTALLER_FEATURE,
  () => false,
);

class Overview extends React.Component {
  state = {
    showInstallSuccessAlert: false,
  };

  componentDidUpdate(prevProps) {
    const { cluster } = this.props;
    if (
      (prevProps.cluster.state === clusterStates.INSTALLING ||
        prevProps.cluster.state === clusterStates.PENDING ||
        prevProps.cluster.state === clusterStates.WAITING) &&
      cluster.state === clusterStates.READY &&
      cluster.managed &&
      prevProps.cluster.id === cluster.id
    ) {
      // we only want to show this alert if the cluster transitioned from installing/pending
      // to Ready while the page was open.

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ showInstallSuccessAlert: true });
    }
  }

  render() {
    const { cluster, cloudProviders, history, refresh, openModal, insightsData, userAccess } =
      this.props;
    let topCard;

    const { showInstallSuccessAlert } = this.state;
    const clusterState = getClusterStateAndDescription(cluster);
    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
    const isDeprovisioned =
      get(cluster, 'subscription.status', false) === subscriptionStatuses.DEPROVISIONED;
    const metricsAvailable =
      hasResourceUsageMetrics(cluster) &&
      (cluster.canEdit ||
        (cluster.state !== clusterStates.WAITING &&
          cluster.state !== clusterStates.PENDING &&
          cluster.state !== clusterStates.INSTALLING));
    const metricsStatusMessage = isArchived
      ? metricsStatusMessages.archived
      : metricsStatusMessages[cluster.state] || metricsStatusMessages.default;

    const shouldMonitorStatus =
      cluster.state === clusterStates.WAITING ||
      cluster.state === clusterStates.PENDING ||
      cluster.state === clusterStates.INSTALLING ||
      cluster.state === clusterStates.UNINSTALLING;

    const showInsightsAdvisor =
      insightsData?.status === 200 && insightsData?.data && !isDeprovisioned && !isArchived;
    const showResourceUsage =
      !isHibernating(cluster.state) &&
      !isAssistedInstallSubscription(cluster.subscription) &&
      !shouldShowLogs(cluster) &&
      !isDeprovisioned &&
      !isArchived;
    const showCostBreakdown =
      !cluster.managed &&
      userAccess.fulfilled &&
      userAccess.data !== undefined &&
      userAccess.data === true &&
      !isDeprovisioned &&
      !isArchived;
    const showSidePanel = showInsightsAdvisor || showCostBreakdown;
    const showAssistedInstallerDetailCard = isAvailableAssistedInstallCluster(cluster);
    const showDetailsCard = !cluster.aiCluster || !isUninstalledAICluster(cluster);
    const showSubscriptionSettings = !isDeprovisioned && !isArchived;

    if (isHibernating(cluster.state)) {
      topCard = <HibernatingClusterCard cluster={cluster} openModal={openModal} />;
    } else if (!isAssistedInstallSubscription(cluster.subscription) && shouldShowLogs(cluster)) {
      topCard = <ClusterProgressCard cluster={cluster} refresh={refresh} history={history} />;
    }

    const resourceUsage = (
      <Card className="ocm-c-overview-resource-usage__card">
        <CardTitle className="ocm-c-overview-resource-usage__card--header">
          <Title headingLevel="h2" className="card-title">
            Resource usage
          </Title>
          {shouldMonitorStatus && (
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
        <GridItem xl2={showSidePanel ? 9 : 12}>
          <Grid hasGutter>
            {showInstallSuccessAlert && (
              <Alert variant="success" isInline title="Cluster installed successfully" />
            )}
            {topCard}
            {showAssistedInstallerDetailCard && (
              <GatedAIDetailCard
                permissions={getClusterAIPermissions(cluster)}
                aiClusterId={cluster.aiCluster.id}
              />
            )}
            {showResourceUsage && !showSidePanel && resourceUsage}
            {showDetailsCard && (
              <Card className="ocm-c-overview-details__card">
                <CardTitle className="ocm-c-overview-details__card--header">
                  <Title headingLevel="h2" className="card-title">
                    Details
                  </Title>
                </CardTitle>
                <CardBody className="ocm-c-overview-details__card--body">
                  <Grid>
                    <GridItem sm={6}>
                      <DetailsLeft
                        cluster={cluster}
                        cloudProviders={cloudProviders}
                        showAssistedId={showAssistedInstallerDetailCard}
                      />
                    </GridItem>
                    <GridItem sm={6}>
                      <DetailsRight cluster={{ ...cluster, state: clusterState }} />
                    </GridItem>
                  </Grid>
                  {showAssistedInstallerDetailCard && <GatedAIExtraDetailCard />}
                </CardBody>
              </Card>
            )}
            {showSubscriptionSettings && <SubscriptionSettings />}
          </Grid>
        </GridItem>
        {showSidePanel && (
          <GridItem xl2={3}>
            <Grid hasGutter>
              {showResourceUsage && (
                <GridItem sm={6} xl2={12}>
                  {resourceUsage}
                </GridItem>
              )}
              {showInsightsAdvisor && (
                <GridItem sm={6} xl2={12}>
                  <Card className="ocm-c-overview-advisor--card" ouiaId="insightsAdvisor">
                    <CardBody>
                      <InsightsAdvisor
                        insightsData={insightsData}
                        externalId={cluster?.external_id}
                      />
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
      </Grid>
    );
  }
}

Overview.propTypes = {
  cluster: PropTypes.object,
  cloudProviders: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
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
