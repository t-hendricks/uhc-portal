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
  Alert, Button, Row, Col, EmptyState, Grid, DropdownButton, MenuItem, Modal, ButtonGroup,
  Breadcrumb,
} from 'patternfly-react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import ClusterUtilizationChart from './ClusterUtilizationChart';
import LoadingModal from './LoadingModal';
import ClusterStateIcon from '../common/ClusterStateIcon/ClusterStateIcon';
import Timestamp from '../common/Timestamp';
import { getMetricsTimeDelta } from '../../common/helpers';
import clusterStates from '../../common/clusterStates';

import EditClusterDialog from '../cluster/forms/EditClusterDialog';
import EditDisplayNameDialog from '../cluster/forms/EditDisplayNameDialog';
import DeleteClusterDialog from '../cluster/forms/DeleteClusterDialog';
import ClusterCredentialsModal from './ClusterCredentialsModal';

import { humanizeValueWithUnit } from '../../common/unitParser';
import { fetchClusterDetails, fetchClusterCredentials, invalidateClusters } from '../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../redux/actions/cloudProviderActions';
import { modalActions } from '../common/Modal/ModalActions';

import RefreshBtn from './RefreshButton';
import ClusterBadge from './ClusterBadge';
import { metricsStatusMessages, maxMetricsTimeDelta } from './clusterDetailsConsts';

import AlphaNotice from '../common/AlphaNotice';

class ClusterDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clusterCreationFormVisible: false,
      editClusterDialogVisible: false,
      editDisplayNameDialogVisible: false,
    };
  }

  componentDidMount() {
    const {
      match, fetchDetails, fetchCredentials, cloudProviders, getCloudProviders,
    } = this.props;
    const clusterID = match.params.id;

    if (clusterID !== null && clusterID !== undefined) {
      fetchDetails(clusterID);
      fetchCredentials(clusterID);
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

  render() {
    const {
      cluster,
      error,
      errorMessage,
      pending,
      cloudProviders,
      fetchDetails,
      openModal,
      credentials,
      history,
      fetchCredentials,
    } = this.props;

    const pendingMessage = () => {
      if (pending || credentials.pending) {
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
        <Modal
          show={editClusterDialogVisible}
          onHide={() => this.setState({ editClusterDialogVisible: false })}
        >
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
                fetchDetails(editCluster.id);
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
        <Modal
          show={editDisplayNameDialogVisible}
          onHide={() => this.setState({ editDisplayNameDialogVisible: false })}
        >
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
                fetchDetails(editCluster.id);
              }
            }}
          />
        </Modal>
      );
    };

    const clusterNetwork = () => {
      if (cluster.managed && cluster.network) {
        return (
          <React.Fragment>
            <dt>Network</dt>
            <dd>
              { cluster.network.machine_cidr
              && (
              <dl className="cluster-details-item-list left">
                <dt>Machine CIDR: </dt>
                <dd>{cluster.network.machine_cidr}</dd>
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

    if (pending || credentials.pending) {
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

    const cloudProviderId = cluster.cloud_provider ? cluster.cloud_provider.id : null;
    let cloudProvider;
    let region = result(cluster, 'region.id', 'N/A');
    if (cloudProviderId && cloudProviders.fulfilled && cloudProviders.providers[cloudProviderId]) {
      const providerData = cloudProviders.providers[cloudProviderId];

      cloudProvider = providerData.display_name;
      if (providerData.regions[region]) {
        region = providerData.regions[region].display_name;
      }
    } else {
      cloudProvider = cloudProviderId ? cloudProviderId.toUpperCase() : 'N/A';
    }
    const memoryTotalWithUnit = humanizeValueWithUnit(
      cluster.memory.total.value, cluster.memory.total.unit,
    );
    const memoryUsedWithUnit = humanizeValueWithUnit(
      cluster.memory.used.value, cluster.memory.used.unit,
    );
    const storageTotalWithUnit = humanizeValueWithUnit(
      cluster.storage.total.value, cluster.storage.total.unit,
    );
    const storageUsedWithUnit = humanizeValueWithUnit(
      cluster.storage.total.value, cluster.storage.total.unit,
    );

    const metricsLatsUpdate = new Date(cluster.cpu.updated_timestamp);

    const metricsAvailable = getMetricsTimeDelta(metricsLatsUpdate) < maxMetricsTimeDelta;

    const utilizationCharts = () => (metricsAvailable ? (
      <React.Fragment>
        <Col xs={6} sm={3} md={3}>
          <ClusterUtilizationChart title="CPU" total={cluster.cpu.total.value} unit="Cores" used={cluster.cpu.used.value} donutId="cpu_donut" />
        </Col>
        <Col xs={6} sm={3} md={3}>
          <ClusterUtilizationChart title="MEMORY" total={memoryTotalWithUnit.value} unit="GiB" used={memoryUsedWithUnit.value} donutId="memory_donut" />
        </Col>
        <Col xs={6} sm={3} md={3}>
          <ClusterUtilizationChart title="STORAGE" total={storageTotalWithUnit.value} unit="GiB" used={storageUsedWithUnit.value} donutId="storage_donut" />
        </Col>
      </React.Fragment>)
      : (
        <Col xs={6}>
          <p>
            {metricsStatusMessages[cluster.state] || metricsStatusMessages.default}
          </p>
        </Col>
      ));

    // The trenary for consoleURL is needed because the API does not guarantee fields being present.
    // We'll have a lot of these all over the place as we grow :(
    const consoleURL = cluster.console ? cluster.console.url : false;
    const clusterName = cluster.display_name || cluster.name || cluster.external_id || 'Unnamed Cluster';

    const consoleBtn = consoleURL && cluster.state !== clusterStates.UNINSTALLING ? (
      <a href={consoleURL} target="_blank" rel="noreferrer" className="pull-left">
        <Button bsStyle="primary">
          Launch Console
        </Button>
      </a>)
      : (
        <Button bsStyle="primary" disabled title={cluster.state === clusterStates.UNINSTALLING ? 'The cluster is being uninstalled' : 'Admin console is not yet available for this cluster'}>
          Launch Console
        </Button>
      );

    const uninstallingProps = cluster.state === clusterStates.UNINSTALLING ? { disabled: true, title: 'The cluster is being uninstalled' } : {};

    const editClusterItem = () => {
      if (!cluster.managed) {
        return (
          <MenuItem disabled title={cluster.state === clusterStates.UNINSTALLING ? 'The cluster is being uninstalled' : 'Self managed cluster cannot be edited'}>
            Edit Cluster
          </MenuItem>
        );
      }
      if (cluster.state !== clusterStates.READY) {
        return (
          <MenuItem disabled title={cluster.state === clusterStates.UNINSTALLING ? 'The cluster is being uninstalled' : 'This cluster is not ready'}>
            Edit Cluster
          </MenuItem>
        );
      }
      return (
        <MenuItem onClick={() => this.openEditClusterDialog(cluster)} {...uninstallingProps}>
          Edit Cluster
        </MenuItem>
      );
    };

    const editDisplayNameItem = (
      <MenuItem
        onClick={() => this.openEditDisplayNameDialog(cluster)}
        {...uninstallingProps}
      >
        Edit Display Name
      </MenuItem>);


    const deleteModalData = {
      clusterID: cluster.id,
      clusterName: cluster.name,
      managed: cluster.managed,
    };

    const deleteClusterItem = cluster.state !== 'uninstalling' ? (
      <MenuItem onClick={() => openModal('delete-cluster', deleteModalData)}>
    Delete Cluster
      </MenuItem>)
      : (<MenuItem disabled title="The cluster is being uninstalled">Delete Cluster</MenuItem>);


    const actionsBtn = (
      <DropdownButton
        id="actions"
        bsStyle="default"
        title="Actions"
        pullRight
      >
        {editDisplayNameItem}
        {editClusterItem()}
        {deleteClusterItem}
      </DropdownButton>
    );

    const hasCredentials = (cluster.state === 'ready'
                            && credentials.fulfilled
                            && credentials.credentials.admin
                            && result(credentials, 'credentials.admin.password', false));

    const credentialsButton = hasCredentials ? (
      <React.Fragment>
        <Button bsStyle="default" onClick={() => { openModal('cluster-credentials'); }}>Admin Credentials</Button>
        <ClusterCredentialsModal credentials={credentials.credentials} />
      </React.Fragment>
    ) : null;

    return (
      <div>
        <AlphaNotice />
        <div id="clusterdetails-content">
          <Grid fluid>
            <Row>
              <Col sm={3}>
                <Breadcrumb>
                  <LinkContainer to="/clusters">
                    <Breadcrumb.Item href="#">
                        Clusters
                    </Breadcrumb.Item>
                  </LinkContainer>
                  <Breadcrumb.Item active>
                    {clusterName}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <h1 style={{ marginTop: 0 }}>
                  <ClusterBadge clusterName={clusterName} />
                </h1>
              </Col>
              <Col md={9} lg={5} lgOffset={4}>
                <ButtonGroup id="cl-details-btns">
                  {consoleBtn}
                  {credentialsButton}
                  {actionsBtn}
                  <RefreshBtn id="refresh" refreshFunc={() => { fetchDetails(cluster.id); fetchCredentials(cluster.id); }} />
                </ButtonGroup>
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
                    Cluster ID
                  </dt>
                  <dd>
                    {cluster.external_id || 'N/A'}
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
                    { cluster.managed ? (
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
          <DeleteClusterDialog onClose={(shouldRefresh) => {
            if (shouldRefresh) {
              invalidateClusters();
              history.push('/clusters');
            }
          }}
          />
        </div>
      </div>
    );
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  fetchCredentials: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  cluster: PropTypes.any,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  pending: PropTypes.bool,
  history: PropTypes.object,
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
  {
    cloudProviders: state.cloudProviders.cloudProviders,
    credentials: state.clusters.credentials,
  },
);

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
  fetchCredentials: clusterID => fetchClusterCredentials(clusterID),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  invalidateClusters,
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClusterDetails));
