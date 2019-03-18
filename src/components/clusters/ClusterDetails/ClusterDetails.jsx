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
  Alert, Button, Row, Col, EmptyState, Grid, DropdownButton, ButtonGroup,
  Breadcrumb, Spinner,
} from 'patternfly-react';

import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';

import ClusterUtilizationChart from './components/ClusterUtilizationChart';
import LoadingModal from '../../common/LoadingModal';
import ClusterStateIcon from '../common/ClusterStateIcon/ClusterStateIcon';
import Timestamp from '../../common/Timestamp';
import { getMetricsTimeDelta } from '../../../common/helpers';
import clusterStates from '../common/clusterStates';
import ClusterActionsDropdown from '../common/ClusterActionsDropdown';

import EditClusterDialog from '../common/EditClusterDialog';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog/DeleteClusterDialog';
import ClusterCredentialsModal from './components/ClusterCredentialsModal';

import { humanizeValueWithUnit, parseValueWithUnit } from '../../../common/unitParser';
import {
  fetchClusterDetails,
  fetchClusterCredentials,
  fetchClusterRouterShards,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { modalActions } from '../../common/Modal/ModalActions';

import RefreshBtn from '../../common/RefreshButton/RefreshButton';
import ClusterBadge from '../common/ClusterBadge/ClusterBadge';
import { metricsStatusMessages, maxMetricsTimeDelta } from './clusterDetailsConsts';

import AlphaNotice from '../../common/AlphaNotice';

class ClusterDetails extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    const {
      cloudProviders, getCloudProviders,
    } = this.props;

    this.refresh();

    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      match,
    } = this.props;
    const clusterID = match.params.id;
    const oldClusterID = prevProps.match.params.id;
    if (clusterID !== oldClusterID && clusterID !== null && clusterID !== undefined) {
      this.refresh();
    }
  }

  refresh() {
    const {
      match, fetchDetails, fetchCredentials, fetchRouterShards,
    } = this.props;
    const clusterID = match.params.id;

    if (clusterID !== null && clusterID !== undefined && clusterID !== false && clusterID !== '') {
      fetchDetails(clusterID);
      fetchCredentials(clusterID);
      fetchRouterShards(clusterID);
    }
  }

  render() {
    const {
      cluster,
      error,
      errorMessage,
      cloudProviders,
      fetchDetails,
      openModal,
      credentials,
      routerShards,
      history,
      match,
      pending,
    } = this.props;

    const requestedClusterID = match.params.id;
    // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
    // the redux state will have the data for the previous cluster. We want to ensure we only
    // show data for the requested cluster, so different data should be marked as pending.
    const isPending = result(cluster, 'id') !== requestedClusterID;
    const pendingMessage = () => {
      if (isPending) {
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

    if (error) {
      return errorState();
    }

    if (isPending) {
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
    const storageTotalWithUnit = humanizeValueWithUnit(
      cluster.storage.total.value, cluster.storage.total.unit,
    );
    const metricsLatsUpdate = new Date(cluster.cpu.updated_timestamp);

    const metricsAvailable = getMetricsTimeDelta(metricsLatsUpdate) < maxMetricsTimeDelta;

    const utilizationCharts = metricsAvailable ? (
      <React.Fragment>
        <ClusterUtilizationChart
          title="CPU"
          total={cluster.cpu.total.value}
          unit="Cores"
          used={cluster.cpu.used.value}
          donutId="cpu_donut"
        />
        <ClusterUtilizationChart
          title="MEMORY"
          totalBytes={parseValueWithUnit(cluster.memory.total.value, cluster.memory.total.unit)}
          usedBytes={parseValueWithUnit(cluster.memory.used.value, cluster.memory.used.unit)}
          donutId="memory_donut"
        />
        <ClusterUtilizationChart
          title="STORAGE"
          totalBytes={parseValueWithUnit(cluster.storage.total.value, cluster.storage.total.unit)}
          usedBytes={parseValueWithUnit(cluster.storage.used.value, cluster.storage.used.unit)}
          donutId="storage_donut"
        />
      </React.Fragment>)
      : (
        <p>
          {metricsStatusMessages[cluster.state] || metricsStatusMessages.default}
        </p>
      );

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

    const actionsBtn = (
      <DropdownButton
        id="actions"
        bsStyle="default"
        title="Actions"
        pullRight
      >
        <ClusterActionsDropdown
          cluster={cluster}
          showConsoleButton={false}
        />
      </DropdownButton>
    );

    const hasCredentials = (cluster.state === 'ready'
                            && result(credentials, 'credentials.admin.password', false)
                            && result(credentials, 'credentials.id') === cluster.id);

    const credentialsButton = hasCredentials ? (
      <React.Fragment>
        <Button bsStyle="default" onClick={() => { openModal('cluster-credentials'); }}>Admin Credentials</Button>
        <ClusterCredentialsModal credentials={credentials.credentials} />
      </React.Fragment>
    ) : <Button bsStyle="default" disabled>Admin Credentials</Button>;

    const hasRouterShards = (routerShards
                             && result(routerShards, 'routerShards.id') === cluster.id
                             && result(routerShards, 'routerShards.items', false));

    const routerShardList = hasRouterShards && routerShards.routerShards.items.map(routerShard => (
      <li>
        <dt>{`${routerShard.label}: `}</dt>
        <dd>{routerShard.scheme === 'internal' ? 'Internal' : 'External'}</dd>
      </li>
    ));

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
              { hasRouterShards
              && (
              <dl className="cluster-details-item-list left">
                <dt>Router Shards: </dt>
                <dd>
                  <ul>{routerShardList}</ul>
                </dd>
              </dl>
              )
              }
            </dd>
          </React.Fragment>
        );
      }
      return null;
    };

    const isRefreshing = pending || credentials.pending || routerShards.pending;

    return (
      <div>
        <AlphaNotice />
        <div id="clusterdetails-content">
          <Grid fluid>
            <Row>
              <Col sm={8}>
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
            <hr />
            <Row>
              <Col sm={6} className="cl-details-cluster-name">
                <h1>
                  <ClusterBadge clusterName={clusterName} />
                </h1>
                { isRefreshing ? <Spinner loading /> : null }
              </Col>
              <Col lg={5} lgOffset={1}>
                <ButtonGroup id="cl-details-btns">
                  {consoleBtn}
                  {credentialsButton}
                  {actionsBtn}
                  <RefreshBtn id="refresh" autoRefresh refreshFunc={this.refresh} />
                </ButtonGroup>
              </Col>
            </Row>
          </Grid>
          <Grid fluid>
            <div id="cl-details-charts" className="cl-details-card">
              <div className="cl-details-card-title"><h3>Resource Usage</h3></div>
              <div className="cl-details-card-body">
                {utilizationCharts}
              </div>
            </div>
          </Grid>
          <Grid fluid>
            <div className="cl-details-card">
              <div className="cl-details-card-title"><h3>Details</h3></div>
              <div className="cl-details-card-body">
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
              </div>
            </div>
          </Grid>
          <EditClusterDialog onClose={() => {
            invalidateClusters();
            fetchDetails(cluster.id);
          }}
          />
          <EditDisplayNameDialog onClose={() => {
            invalidateClusters();
            fetchDetails(cluster.id);
          }}
          />
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
  fetchRouterShards: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  routerShards: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  cluster: PropTypes.any,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  history: PropTypes.object,
  pending: PropTypes.bool.isRequired,
};

ClusterDetails.defaultProps = {
  cluster: undefined,
  error: false,
  errorMessage: '',
};

const mapStateToProps = state => Object.assign(
  {},
  state.clusters.details,
  {
    cloudProviders: state.cloudProviders.cloudProviders,
    credentials: state.clusters.credentials,
    routerShards: state.clusters.routerShards,
  },
);

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
  fetchCredentials: clusterID => fetchClusterCredentials(clusterID),
  fetchRouterShards: clusterID => fetchClusterRouterShards(clusterID),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  invalidateClusters,
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
