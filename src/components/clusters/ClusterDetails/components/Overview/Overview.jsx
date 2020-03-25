import React from 'react';
import PropTypes from 'prop-types';

import {
  Grid, GridItem, Card, CardHeader, CardBody, Title,
} from '@patternfly/react-core';

import { getClusterStateAndDescription } from '../../../common/clusterStates';

import ResourceUsage from './ResourceUsage/ResourceUsage';
import DetailsRight from './DetailsRight';
import DetailsLeft from './DetailsLeft';
import SubscriptionSettings from './SubscriptionSettings';
import ClusterLogs from '../ClusterLogs';

function Overview({
  cluster, cloudProviders, history, displayClusterLogs,
}) {
  const clusterState = getClusterStateAndDescription(cluster);

  return (
    <>
      <Card id="metrics-charts">
        <CardHeader>
          <Title headingLevel="h2" size="md" className="card-title">Resource Usage</Title>
        </CardHeader>
        <CardBody>
          <ResourceUsage
            cluster={{
              ...cluster,
              state: clusterState,
            }}
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <Title headingLevel="h2" size="md" className="card-title">Details</Title>
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
      {displayClusterLogs && (
      <Card>
        <CardHeader>
          <Title headingLevel="h2" size="3xl">Cluster History</Title>
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
