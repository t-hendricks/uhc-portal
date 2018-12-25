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
  Alert, Button, Row, Col, EmptyState, Grid, DropdownButton, MenuItem, Modal,
} from 'patternfly-react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClusterUtilizationChart from './ClusterUtilizationChart';
import LoadingModal from './LoadingModal';
import ClusterStateIcon from './ClusterStateIcon';
import Timestamp from '../Timestamp';

import EditClusterDialog from '../cluster/forms/EditClusterDialog';
import EditDisplayNameDialog from '../cluster/forms/EditDisplayNameDialog';
import DeleteClusterDialog from '../cluster/forms/DeleteClusterDialog';


import { humanizeValueWithUnit } from '../../common/unitParser';
import { fetchClusterDetails, invalidateClusters } from '../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../redux/actions/cloudProviderActions';
import RefreshBtn from './RefreshButton';

class ClusterDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clusterCreationFormVisible: false,
      editClusterDialogVisible: false,
      editDisplayNameDialogVisible: false,
      deleteClusterDialogVisible: false,
    };
  }

  componentDidMount() {
    const {
      match, fetchDetails, cloudProviders, getCloudProviders,
    } = this.props;
    const clusterID = match.params.id;

    if (clusterID !== null && clusterID !== undefined) {
      fetchDetails(clusterID);
    }

    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
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

  openEditDisplayNameDialog(cluster) {
    this.setState(prevState => (
      {
        ...prevState,
        editCluster: cluster,
        editClusterDialogVisible: false,
        editDisplayNameDialogVisible: true,
      }));
  }

  openEditClusterDialog(cluster) {
    this.setState(prevState => (
      {
        ...prevState,
        editCluster: cluster,
        editClusterDialogVisible: true,
        editDisplayNameDialogVisible: false,
      }));
  }

  openDeleteClusterDialog() {
    this.setState(prevState => (
      {
        ...prevState,
        deleteClusterDialogVisible: true,
      }));
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

  renderEditClusterDialog() {
    const {
      editCluster,
      editClusterDialogVisible,
    } = this.state;
    return (
      <Modal show={editClusterDialogVisible}>
        <EditClusterDialog
          cluster={editCluster}
          closeFunc={(updated) => {
            this.setState(prevState => (
              {
                ...prevState,
                editClusterDialogVisible: false,
              }));
            if (updated) {
              invalidateClusters();
            }
          }}
        />
      </Modal>
    );
  }

  renderEditDisplayNameDialog() {
    const {
      editCluster,
      editDisplayNameDialogVisible,
    } = this.state;
    return (
      <Modal show={editDisplayNameDialogVisible}>
        <EditDisplayNameDialog
          cluster={editCluster}
          closeFunc={(updated) => {
            this.setState(prevState => (
              {
                ...prevState,
                editDisplayNameDialogVisible: false,
              }));
            if (updated) {
              invalidateClusters();
            }
          }}
        />
      </Modal>
    );
  }

  renderDeleteClusterDialog(cluster) {
    const {
      deleteClusterDialogVisible,
    } = this.state;
    return (
      <Modal show={deleteClusterDialogVisible}>
        <DeleteClusterDialog
          clusterID={cluster.id}
          clusterName={cluster.name}
          closeFunc={(updated) => {
            this.setState(prevState => (
              {
                ...prevState,
                deleteClusterDialogVisible: false,
              }));
            if (updated) {
              invalidateClusters();
            }
          }}
        />
      </Modal>
    );
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
    const {
      cluster, error, pending, cloudProviders, fetchDetails,
    } = this.props;
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

    let cloudProvider = cluster.cloud_provider.id || 'N/A';
    let region = cluster.region.id;
    if (cloudProviders.fulfilled && cloudProviders.providers[cluster.cloud_provider.id]) {
      const providerData = cloudProviders.providers[cluster.cloud_provider.id];

      cloudProvider = providerData.display_name;
      if (!providerData.regions[region]) {
        region = providerData.regions[region].display_name;
      }
    } else {
      cloudProvider = cloudProvider.toUpperCase();
    }
    const memoryTotalWithUnit = humanizeValueWithUnit(
      cluster.memory.total.value, cluster.memory.total.unit,
    );
    const storageTotalWithUnit = humanizeValueWithUnit(
      cluster.storage.total.value, cluster.storage.total.unit,
    );

    // The trenary for consoleURL is needed because the API does not guarantee fields being present.
    // We'll have a lot of these all over the place as we grow :(
    const consoleURL = cluster.console ? cluster.console.url : false;

    const consoleBtn = consoleURL ? (
      <a href={consoleURL}>
        <Button bsStyle="primary">
          Launch Console
        </Button>
      </a>)
      : (
        <Button bsStyle="primary" disabled title="Admin console is not yet available for this cluster">
          Launch Console
        </Button>
      );

    const backBtn = (
      <Link to="/clusters">
        <Button bsStyle="default">
          Back
        </Button>
      </Link>
    );

    const editClusterItem = (
      <MenuItem onClick={() => this.openEditClusterDialog(cluster)}>
        Edit Cluster
      </MenuItem>);
    const editDisplayNameItem = (
      <MenuItem onClick={() => this.openEditDisplayNameDialog(cluster)}>
        Edit Display Name
      </MenuItem>);
    const deleteDisplayNameItem = (
      <MenuItem onClick={() => this.openDeleteClusterDialog(cluster)}>
          Delete Cluster
      </MenuItem>);

    const actionsBtn = (
      <DropdownButton
        id="actions"
        bsStyle="default"
        title="Actions"
      >
        {editDisplayNameItem}
        {editClusterItem}
        {deleteDisplayNameItem}
      </DropdownButton>
    );

    return (
      <div>
        <Grid fluid style={{ marginTop: '20px' }}>
          <Row>
            <Col sm={2}>
              {backBtn}
              <RefreshBtn id="refresh" refreshFunc={() => fetchDetails(cluster.id)} />
            </Col>
            <Col sm={2} smOffset={1}>
              <h1 style={{ marginTop: 0 }}>
                {cluster.name}
              </h1>
            </Col>
            <Col sm={1} smOffset={4}>
              {consoleBtn}
            </Col>
            <Col sm={1}>
              {actionsBtn}
            </Col>

          </Row>
        </Grid>
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
                  {region}
                </dd>
                <dt>
                  Provider
                </dt>
                <dd>
                  { cloudProvider }
                </dd>
                <dt>
                  Versions
                </dt>
                <dd>
                  <dl className="cluster-details-item-list left">
                    <dt>
                      OpenShift:
                      {' '}
                    </dt>
                    <dd>
                      {cluster.openshift_version || 'N/A'}
                    </dd>
                  </dl>
                </dd>
                <dt>
                  Created at
                </dt>
                <dd>
                  <Timestamp value={cluster.creation_timestamp || ''} />
                </dd>
                <dt>
                  Last Update
                </dt>
                <dd>
                  <Timestamp value={cluster.last_update_date || ''} />
                </dd>
              </dl>
            </Col>
            <Col sm={6}>
              <dl className="cluster-details-item left">
                <dt>
                  Status
                </dt>
                <dd style={{ textTransform: 'capitalize' }}>
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
        {this.renderEditClusterDialog()}
        {this.renderEditDisplayNameDialog()}
        {this.renderDeleteClusterDialog(cluster)}
      </div>);
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
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

const mapStateToProps = state => Object.assign(
  {},
  state.clusters.details,
  { cloudProviders: state.cloudProviders.cloudProviders },
);

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  invalidateClusters,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
