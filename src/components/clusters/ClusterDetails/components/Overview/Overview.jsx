import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'patternfly-react';

import { Card, CardHeader, CardBody } from '@patternfly/react-core';
import { getClusterStateAndDescription } from '../../../common/clusterStates';

import ResourceUsage from './ResourceUsage/ResourceUsage';
import DetailsRight from './DetailsRight';
import DetailsLeft from './DetailsLeft';

function Overview({ cluster, cloudProviders, routerShards }) {
  const clusterState = getClusterStateAndDescription(cluster);
  return (
    <React.Fragment>
      <Card id="metrics-charts" className="pf4-details-card">
        <CardHeader>Resource Usage</CardHeader>
        <CardBody>
          <ResourceUsage cluster={{ ...cluster, state: clusterState }} />
        </CardBody>
      </Card>
      <Card className="pf4-details-card">
        <CardHeader>Details</CardHeader>
        <CardBody>
          <Grid fluid>
            <Row>
              <Col sm={6}>
                <DetailsLeft cluster={cluster} cloudProviders={cloudProviders} />
              </Col>
              <Col sm={6}>
                <DetailsRight
                  cluster={{ ...cluster, state: clusterState }}
                  routerShards={routerShards}
                />
              </Col>
            </Row>
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
