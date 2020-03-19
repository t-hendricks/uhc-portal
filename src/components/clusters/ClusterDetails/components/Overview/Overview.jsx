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
import getClusterName from '../../../../../common/getClusterName';

function Overview({ cluster, cloudProviders, history }) {
  const clusterState = getClusterStateAndDescription(cluster);
  const externalClusterID = getClusterName(cluster);

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
      <Card>
        <CardHeader>
          <Title headingLevel="h2" size="3xl">Cluster History</Title>
        </CardHeader>
        <CardBody>
          <ClusterLogs externalClusterID={externalClusterID} history={history} />
        </CardBody>
      </Card>
    </>
  );
}

Overview.propTypes = {
  cluster: PropTypes.object,
  cloudProviders: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Overview;
