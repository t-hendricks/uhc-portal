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

import result from 'lodash/result';

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

  render() {
    const {
      cluster, error, errorMessage, pending, cloudProviders, fetchDetails,
    } = this.props;

    const pendingMessage = () => {
      if (pending) {
        return (
          <LoadingModal>
            Loading cluster details...
          </LoadingModal>
        );
      }
      return null;
    };

    const errorState = () => (
      <EmptyState>
        <Alert type="error">
          <span>{`Error retrieving cluster details: ${errorMessage}`}</span>
        </Alert>
        {pendingMessage()}
      </EmptyState>
    );

    const editClusterDialog = () => {
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
    };

    const editDisplayNameDialog = () => {
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
    };

    const deleteClusterDialog = () => {
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
    };

    const utilizationCharts = () => {
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
    };

    const clusterNetwork = () => {
      if (cluster.dedicated && cluster.network) {
        return (
          <React.Fragment>
            <dt>Network</dt>
            <dd>
              { cluster.aws && cluster.aws.vpc_cidr
              && (
              <dl className="cluster-details-item-list left">
                <dt>VPC CIDR: </dt>
                <dd>{cluster.aws.vpc_cidr}</dd>
              </dl>
              )
              }
              { cluster.network.service_cidr
              && (
              <dl className="cluster-details-item-list left">
                <dt>Service CIDR: </dt>
                <dd>{cluster.network.service_cidr}</dd>
              </dl>
              )
              }
              { cluster.network.pod_cidr
              && (
              <dl className="cluster-details-item-list left">
                <dt>Pod CIDR: </dt>
                <dd>{cluster.network.pod_cidr}</dd>
              </dl>
              )
              }
            </dd>
          </React.Fragment>
        );
      }
      return null;
    };

    if (error) {
      return errorState();
    }

    if (pending) {
      return pendingMessage();
    }

    if (cluster === null || !cluster.id) {
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
          {pendingMessage()}
        </React.Fragment>);
    }

    let cloudProvider = cluster.cloud_provider.id || 'N/A';
    let region = result(cluster, 'region.id', 'N/A');
    if (cloudProviders.fulfilled && cloudProviders.providers[cluster.cloud_provider.id]) {
      const providerData = cloudProviders.providers[cluster.cloud_provider.id];

      cloudProvider = providerData.display_name;
      if (providerData.regions[region]) {
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
      <a href={consoleURL} target="_blank" rel="noreferrer">
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

    const editClusterItem = () => {
      if (!cluster.dedicated) {
        return (
          <MenuItem disabled title="Self managed cluster cannot be edited">
            Edit Cluster
          </MenuItem>
        );
      }
      if (cluster.state !== 'ready') {
        return (
          <MenuItem disabled title="This cluster is not ready">
            Edit Cluster
          </MenuItem>
        );
      }
      return (
        <MenuItem onClick={() => this.openEditClusterDialog(cluster)}>
          Edit Cluster
        </MenuItem>
      );
    };

    const editDisplayNameItem = (
      <MenuItem onClick={() => this.openEditDisplayNameDialog(cluster)}>
        Edit Display Name
      </MenuItem>);

    const deleteClusterItem = cluster.dedicated ? (
      <MenuItem onClick={() => this.openDeleteClusterDialog(cluster)}>
        Delete Cluster
      </MenuItem>)
      : (
        <MenuItem disabled title="Self managed cluster cannot be deleted">
          Delete Cluster
        </MenuItem>
      );

    const actionsBtn = (
      <DropdownButton
        id="actions"
        bsStyle="default"
        title="Actions"
      >
        {editDisplayNameItem}
        {editClusterItem()}
        {deleteClusterItem}
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
                {cluster.display_name || cluster.name}
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
            {utilizationCharts()}
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
                  Version
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
                  Last Updated
                </dt>
                <dd>
                  <Timestamp value={cluster.last_update_timestamp || ''} />
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
                  Total CPU
                </dt>
                <dd>
                  {cluster.cpu.total.value}
                  {' '}
                  vCPU
                </dd>
                <dt>
                  Total Memory
                </dt>
                <dd>
                  {memoryTotalWithUnit.value}
                  {' '}
                  {memoryTotalWithUnit.unit}
                </dd>
                <dt>
                  Total Storage
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
                  { cluster.dedicated ? (
                    <dl className="cluster-details-item-list left">
                      <dt>
                        Infrastructure:
                        {' '}
                      </dt>
                      <dd>
                        {cluster.nodes.infra}
                      </dd>
                    </dl>
                  ) : null }
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
                {clusterNetwork()}
              </dl>
            </Col>
          </Row>
        </Grid>
        {editClusterDialog()}
        {editDisplayNameDialog()}
        {deleteClusterDialog()}
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
