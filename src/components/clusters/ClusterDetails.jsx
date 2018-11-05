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
  Alert, Row, Col, EmptyState, Grid,
} from 'patternfly-react';

import PropTypes from 'prop-types';
import { fetchClusterDetails } from '../../redux/actions/clusterActions';
import ClusterUtilizationChart from './ClusterUtilizationChart';
import LoadingModal from './LoadingModal';
import ClusterStateIcon from './ClusterStateIcon';
import Timestamp from '../Timestamp';
import { humanizeValueWithUnit } from '../../common/unitParser';

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
        <LoadingModal>
          Loading cluster details...
        </LoadingModal>
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
            Error retrieving cluster details:
            {' '}
            {errorMessage}
          </span>
        </Alert>
        {this.renderPendingMessage()}
      </EmptyState>
    );
  }

  renderUtilizationCharts() {
    const { cluster } = this.props;
    if (cluster.state === 'ready') {
      return (
        <React.Fragment>
          <Col xs={6} sm={3} md={3}>
            <ClusterUtilizationChart title="CPU" total={cluster.cpu.total.value} unit="Cores" used={cluster.cpu.used.value} donutId="cpu_donut" />
          </Col>
          <Col xs={6} sm={3} md={3}>
            <ClusterUtilizationChart title="MEMORY" total={cluster.memory.total} unit="GiB" used={cluster.memory.used} donutId="memory_donut" />
          </Col>
          <Col xs={6} sm={3} md={3}>
            <ClusterUtilizationChart title="STORAGE" total={cluster.storage.total} unit="GiB" used={cluster.storage.used} donutId="storage_donut" />
          </Col>
        </React.Fragment>);
    }
    return (
      <Col xs={6}>
        <p>
          This cluster is in the process of being registered so some data is not yet available.
          This may take some time.
        </p>
      </Col>
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

    const cloudProvider = cluster.cloud_provider.id || 'N/A';
    const memoryTotalWithUnit = humanizeValueWithUnit(
      cluster.memory.total.value, cluster.memory.total.unit,
    );
    const storageTotalWithUnit = humanizeValueWithUnit(
      cluster.storage.total.value, cluster.storage.total.unit,
    );

    return (
      <div>
        <h1 style={{ marginLeft: '80px' }}>
          {cluster.name}
        </h1>
        <Grid fluid>
          <Row style={{ marginTop: '20px' }}>
            {this.renderUtilizationCharts()}
          </Row>
        </Grid>
        <hr style={{ width: '96%' }} />
        <Grid fluid>
          <Row>
            <Col sm={6}>
              <dl className="cluster-details-item left">
                <dt>
                  Name
                </dt>
                <dd>
                  {cluster.name}
                </dd>
                <dt>
                  Location
                </dt>
                <dd>
                  {cluster.region}
                </dd>
                <dt>
                  Labels
                </dt>
                <dd>
                  N/A
                </dd>
                <dt>
                  Provider
                </dt>
                <dd>
                  { cloudProvider.toUpperCase() }
                </dd>
                <dt>
                  Versions
                </dt>
                <dd>
                  <dl className="cluster-details-item-list left">
                    <dt>
                      OS:
                      {' '}
                    </dt>
                    <dd>
                      {cluster.os_version || 'N/A'}
                    </dd>
                  </dl>
                  <dl className="cluster-details-item-list left">
                    <dt>
                      OpenShift:
                      {' '}
                    </dt>
                    <dd>
                      {cluster.openshift_version || 'N/A'}
                    </dd>
                  </dl>
                  <dl className="cluster-details-item-list left">
                    <dt>
                      Docker:
                      {' '}
                    </dt>
                    <dd>
                      {cluster.runtime_version || 'N/A'}
                    </dd>
                  </dl>
                </dd>
                <dt>
                  Created at
                </dt>
                <dd>
                  <Timestamp value={cluster.creation_timestamp} />
                </dd>
              </dl>
            </Col>
            <Col sm={6}>
              <dl className="cluster-details-item left">
                <dt>
                  Status
                </dt>
                <dd>
                  <ClusterStateIcon clusterState={cluster.state} />
                  {' '}
                  {cluster.state}
                </dd>
                <dt>
                  CPU
                </dt>
                <dd>
                  {cluster.cpu.total.value}
                  {' '}
                  vCPU
                </dd>
                <dt>
                  Memory
                </dt>
                <dd>
                  {memoryTotalWithUnit.value}
                  {' '}
                  {memoryTotalWithUnit.unit}
                </dd>
                <dt>
                  Storage
                </dt>
                <dd>
                  {storageTotalWithUnit.value}
                  {' '}
                  {storageTotalWithUnit.unit}
                </dd>
                <dt>
                  Nodes
                </dt>
                <dd>
                  <dl className="cluster-details-item-list left">
                    <dt>
                      Master:
                      {' '}
                    </dt>
                    <dd>
                      {cluster.nodes.master}
                    </dd>
                  </dl>
                  <dl className="cluster-details-item-list left">
                    <dt>
                      Infrastructure:
                      {' '}
                    </dt>
                    <dd>
                      {cluster.nodes.infra}
                    </dd>
                  </dl>
                  <dl className="cluster-details-item-list left">
                    <dt>
                      Compute:
                      {' '}
                    </dt>
                    <dd>
                      {cluster.nodes.compute}
                    </dd>
                  </dl>
                </dd>
              </dl>
            </Col>
          </Row>
        </Grid>
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
