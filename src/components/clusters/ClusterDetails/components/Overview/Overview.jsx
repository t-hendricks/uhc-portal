import React from 'react';
import PropTypes from 'prop-types';

import {
  Grid, GridItem, Card, CardBody, Title, Alert, CardTitle,
} from '@patternfly/react-core';

import get from 'lodash/get';
import clusterStates, { getClusterStateAndDescription } from '../../../common/clusterStates';

import ResourceUsage from '../../../common/ResourceUsage/ResourceUsage';
import DetailsRight from './DetailsRight';
import DetailsLeft from './DetailsLeft';
import SubscriptionSettings from './SubscriptionSettings';
import ClusterLogs from '../ClusterLogs';
import InstallationLogView, { shouldShowLogs } from './InstallationLogView';
import ClusterStatusMonitor from './ClusterStatusMonitor';
import { metricsStatusMessages } from '../../../common/ResourceUsage/ResourceUsage.consts';
import { hasResourceUsageMetrics } from '../Monitoring/monitoringHelper';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import InstallProgress from '../../../common/InstallProgress/InstallProgress';

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
      cluster, cloudProviders, history, displayClusterLogs, refresh,
    } = this.props;
    const { showInstallSuccessAlert } = this.state;
    const clusterState = getClusterStateAndDescription(cluster);
    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
    const metricsAvailable = hasResourceUsageMetrics(cluster)
      && (cluster.canEdit
          || (cluster.state !== clusterStates.PENDING
              && cluster.state !== clusterStates.INSTALLING));
    const metricsStatusMessage = isArchived ? metricsStatusMessages.archived
      : metricsStatusMessages[cluster.state] || metricsStatusMessages.default;

    const shouldMonitorStatus = cluster.state === clusterStates.PENDING
                             || cluster.state === clusterStates.INSTALLING
                             || cluster.state === clusterStates.UNINSTALLING;

    return (
      <>
        { shouldShowLogs(cluster)
          ? (
            <InstallProgress cluster={cluster}>
              <ClusterStatusMonitor cluster={cluster} refresh={refresh} history={history} />
              <InstallationLogView
                cluster={cluster}
                isExpandable={cluster.state !== clusterStates.UNINSTALLING}
              />
            </InstallProgress>
          ) : (
            <Card id="metrics-charts">
              <CardTitle>
                <Title headingLevel="h2" size="lg" className="card-title">Resource usage</Title>
                { showInstallSuccessAlert && <Alert variant="success" isInline title="Cluster installed successfully" />}
                { shouldMonitorStatus && (
                  <ClusterStatusMonitor refresh={refresh} cluster={cluster} history={history} />
                )}
              </CardTitle>
              <CardBody>
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
          )}
        <Card>
          <CardTitle>
            <Title headingLevel="h2" size="lg" className="card-title">Details</Title>
          </CardTitle>
          <CardBody>
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
        <SubscriptionSettings />
        {displayClusterLogs && (
        <Card>
          <CardTitle>
            <Title headingLevel="h2" size="lg" className="card-title">Cluster history</Title>
          </CardTitle>
          <CardBody>
            <ClusterLogs externalClusterID={cluster.external_id} history={history} />
          </CardBody>
        </Card>
        )}
      </>
    );
  }
}

Overview.propTypes = {
  cluster: PropTypes.object,
  cloudProviders: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  displayClusterLogs: PropTypes.bool.isRequired,
  refresh: PropTypes.func,
};

export default Overview;
