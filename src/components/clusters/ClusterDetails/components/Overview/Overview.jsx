import React from 'react';
import PropTypes from 'prop-types';

import {
  Grid, GridItem, Card, CardHeader, CardBody,
} from '@patternfly/react-core';

import { getClusterStateAndDescription } from '../../../common/clusterStates';

import ResourceUsage from './ResourceUsage/ResourceUsage';
import DetailsRight from './DetailsRight';
import DetailsLeft from './DetailsLeft';

function Overview({ cluster, cloudProviders, routerShards }) {
  const clusterState = getClusterStateAndDescription(cluster);
  return (
    <React.Fragment>
      <Card id="metrics-charts">
        <CardHeader>Resource Usage</CardHeader>
        <CardBody>
          <ResourceUsage cluster={{ ...cluster, state: clusterState }} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <Grid>
            <GridItem sm={6}>
              <DetailsLeft cluster={cluster} cloudProviders={cloudProviders} />
            </GridItem>
            <GridItem sm={6}>
              <DetailsRight
                cluster={{ ...cluster, state: clusterState }}
                routerShards={routerShards}
              />
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </React.Fragment>);
}

Overview.propTypes = {
  cluster: PropTypes.object,
  cloudProviders: PropTypes.object.isRequired,
  routerShards: PropTypes.object.isRequired,
};

export default Overview;
