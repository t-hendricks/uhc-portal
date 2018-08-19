/*
 Copyright (c) 2018 Red Hat, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CardGrid, Card, CardBody, CardTitle, AggregateStatusCount,
  Alert, Row, Col, Icon, EmptyState, Modal, Grid,
} from 'patternfly-react';

import PropTypes from 'prop-types';
import { fetchClusterDetails } from '../../redux/actions/clusterActions';
import ClusterUtilizationCard from './ClusterUtilizationCard';

class ClusterDetails extends Component {
  componentDidMount() {
    const { match, fetchDetails } = this.props;
    const clusterID = match.params.id;

    if (clusterID !== null && clusterID !== undefined) {
      fetchDetails(clusterID);
    }
  }

  componentDidUpdate(prevProps) {
    const { fetchDetails, match } = this.props;
    const clusterID = match.params.id;
    const oldClusterID = prevProps.match.params.id;
    if (clusterID !== oldClusterID && clusterID !== null && clusterID !== undefined) {
      fetchDetails(clusterID);
    }
  }


  renderPendingMessage() {
    const { pending } = this.props;
    if (pending) {
      return (
        <Modal bsSize="lg" backdrop={false} show animation={false}>
          <Modal.Body>
            <div className="spinner spinner-xl" />
            <div className="text-center">
              Loading cluster details...
            </div>
          </Modal.Body>
        </Modal>
      );
    }
    return null;
  }

  renderError() {
    const { errorMessage } = this.props;
    return (
      <EmptyState>
        <Alert type="error">
          <span>
            Error retrieving clusters:
            {' '}
            {errorMessage}
          </span>
        </Alert>
        {this.renderPendingMessage()}
      </EmptyState>
    );
  }

  render() {
    const { cluster, error, pending } = this.props;
    if (error) {
      return this.renderError();
    }

    if (pending) {
      return this.renderPendingMessage();
    }

    if (cluster === null || !cluster.name) {
      return (
        <React.Fragment>
          <Grid fluid>
            <Row>
              <EmptyState className="full-page-blank-slate">
                <EmptyState.Icon name="error-circle-o" />
                <EmptyState.Title>
                  Cluster Not Found
                </EmptyState.Title>
                <EmptyState.Info>
                  Unable to retrieve details for cluster.
                </EmptyState.Info>
              </EmptyState>
            </Row>
          </Grid>
          {this.renderPendingMessage()}
        </React.Fragment>);
    }

    return (
      <div>
        <h1>
          {cluster.name}
        </h1>
        <CardGrid>
          <Row style={{ marginBottom: '20px', marginTop: '20px' }}>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="pf" name="container-node" />
                  <AggregateStatusCount>
                    {cluster.nodes.total}
                  </AggregateStatusCount>
                  Nodes
                </CardTitle>
              </Card>
            </Col>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="pf" name="users" />
                  <AggregateStatusCount>
                    ???
                  </AggregateStatusCount>
                  Users
                </CardTitle>
              </Card>
            </Col>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="pf" name="project" />
                  <AggregateStatusCount>
                    ???
                  </AggregateStatusCount>
                  Projects
                </CardTitle>
              </Card>
            </Col>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="fa" name="cubes" />
                  <AggregateStatusCount>
                    ???
                  </AggregateStatusCount>
                  Pods
                </CardTitle>
              </Card>
            </Col>
          </Row>
        </CardGrid>
        <CardGrid>
          <Row style={{ marginTop: '20px' }}>
            <Col>
              <Card>
                <CardTitle>
                  <Icon type="fa" name="tachometer" />
                  Cluster Utilization
                </CardTitle>
                <CardBody>
                  <CardGrid>
                    <Row style={{ marginTop: '20px' }}>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="CPU" total={cluster.cpu.total} unit="Cores" used={cluster.cpu.used} donutId="cpu_donut" />
                      </Col>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="Memory" total={cluster.memory.total} unit="GiB" used={cluster.memory.used} donutId="memory_donut" />
                      </Col>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="Storage" total={cluster.storage.total} unit="GiB" used={cluster.storage.used} donutId="storage_donut" />
                      </Col>
                    </Row>
                  </CardGrid>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardGrid>
        <CardGrid>
          <Row>
            <Col>
              <Card>
                <CardTitle>
                  <Icon type="pf" name="info" />
                  Cluster info
                </CardTitle>
                <CardBody>
                  <Row>
                    <Col sm={6}>
                      <dl className="dl-horizontal left">
                        <dt>
                          Status
                        </dt>
                        <dd>
                          {cluster.state}
                        </dd>
                        <dt>
                          Cluster Name
                        </dt>
                        <dd>
                          {cluster.name}
                        </dd>
                        <dt>
                          Provider
                        </dt>
                        <dd>
                          ??????
                        </dd>
                        <dt>
                          Region
                        </dt>
                        <dd>
                          {cluster.region}
                        </dd>
                        <dt>
                          OpenShift Version
                        </dt>
                        <dd>
                          ????
                        </dd>
                        <dt>
                          Container Runtime
                        </dt>
                        <dd>
                          ????
                        </dd>
                        <dt>
                          OS Version
                        </dt>
                        <dd>
                          ????
                        </dd>
                      </dl>
                    </Col>
                    <Col sm={6}>
                      <dl className="dl-horizontal left">
                        <dt>
                          Masters
                        </dt>
                        <dd>
                          {cluster.nodes.master}
                          {' '}
                          Master nodes
                        </dd>
                        <dt>
                          Infrastructure
                        </dt>
                        <dd>
                          {cluster.nodes.infra}
                          {' '}
                          Nodes
                        </dd>
                        <dt>
                          Compute
                        </dt>
                        <dd>
                          {cluster.nodes.compute}
                          {' '}
                          Nodes
                        </dd>
                        <dt>
                          vCPU
                        </dt>
                        <dd>
                          {cluster.cpu.total}
                          {' '}
                          Cores
                        </dd>
                        <dt>
                          Memory
                        </dt>
                        <dd>
                          {cluster.memory.total}
                          {' '}
                          (unit unknown)
                        </dd>
                        <dt>
                          Storage
                        </dt>
                        <dd>
                          {cluster.storage.total}
                          {' '}
                          (unit unknown)
                        </dd>
                        <dt>
                          Network
                        </dt>
                        <dd>
                          ?????????
                        </dd>
                      </dl>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardGrid>
      </div>);
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  cluster: PropTypes.any,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  pending: PropTypes.bool,
};

ClusterDetails.defaultProps = {
  cluster: undefined,
  error: false,
  errorMessage: '',
  pending: true,
};

const mapStateToProps = state => Object.assign({}, state.cluster.details);

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
