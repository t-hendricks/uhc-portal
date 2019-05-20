import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'patternfly-react';

import { getClusterStateAndDescription } from '../../../common/clusterStates';

import ResourceUsage from './ResourceUsage/ResourceUsage';
import DetailsRight from './DetailsRight';
import DetailsLeft from './DetailsLeft';

function Overview({ cluster, cloudProviders, routerShards }) {
  const clusterState = getClusterStateAndDescription(cluster);
  return (
    <React.Fragment>
      <ResourceUsage cluster={{ ...cluster, state: clusterState }} />
      <Grid fluid>
        <div className="cl-details-card">
          <div className="cl-details-card-title"><h3>Details</h3></div>
          <div className="cl-details-card-body">
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
          </div>
        </div>
      </Grid>
    </React.Fragment>);
}

Overview.propTypes = {
  cluster: PropTypes.object,
  cloudProviders: PropTypes.object.isRequired,
  routerShards: PropTypes.object.isRequired,
};

export default Overview;
