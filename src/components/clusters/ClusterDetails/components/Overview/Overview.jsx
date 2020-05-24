import React from 'react';
import PropTypes from 'prop-types';

import {
  Grid, GridItem, Card, CardHeader, CardBody, Title,
} from '@patternfly/react-core';

import get from 'lodash/get';
import clusterStates, { getClusterStateAndDescription } from '../../../common/clusterStates';


import ResourceUsage from '../../../common/ResourceUsage/ResourceUsage';
import DetailsRight from './DetailsRight';
import DetailsLeft from './DetailsLeft';
import SubscriptionSettings from './SubscriptionSettings';
import ClusterLogs from '../ClusterLogs';
import InstallationLogView from './InstallationLogView';
import { metricsStatusMessages } from '../../../common/ResourceUsage/ResourceUsage.consts';
import { hasResourceUsageMetrics } from '../Monitoring/monitoringHelper';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';

function Overview({
  cluster, cloudProviders, history, displayClusterLogs,
}) {
  const clusterState = getClusterStateAndDescription(cluster);
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const metricsAvailable = hasResourceUsageMetrics(cluster);
  const metricsStatusMessage = isArchived ? metricsStatusMessages.archived
    : metricsStatusMessages[cluster.state] || metricsStatusMessages.default;
  const shouldShowLogs = cluster.managed
                      && (cluster.state === clusterStates.PENDING
                      || cluster.state === clusterStates.INSTALLING
                      || cluster.state === clusterStates.ERROR);

  return (
    <>
      { shouldShowLogs
        ? (
          <InstallationLogView clusterID={cluster.id} />
        ) : (
          <Card id="metrics-charts">
            <CardHeader>
              <Title headingLevel="h2" size="lg" className="card-title">Resource Usage</Title>
            </CardHeader>
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
        <CardHeader>
          <Title headingLevel="h2" size="lg" className="card-title">Details</Title>
        </CardHeader>
        <CardBody>
          <Grid>
            <GridItem sm={6}>
              <DetailsLeft cluster={cluster} cloudProviders={cloudProviders} />
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
      {displayClusterLogs && cluster.managed && (
      <Card>
        <CardHeader>
          <Title headingLevel="h2" size="md" className="card-title">Cluster History</Title>
        </CardHeader>
        <CardBody>
          <ClusterLogs externalClusterID={cluster.external_id} history={history} />
        </CardBody>
      </Card>
      )}
    </>
  );
}

Overview.propTypes = {
  cluster: PropTypes.object,
  cloudProviders: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  displayClusterLogs: PropTypes.bool.isRequired,
};

export default Overview;
