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

import size from 'lodash/size';
import result from 'lodash/result';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Alert, Button, Grid, Row, Col, EmptyState, Tooltip,
  OverlayTrigger, DropdownKebab, MenuItem, Spinner, Modal,
} from 'patternfly-react';
import { TableGrid } from 'patternfly-react-extensions';

import ClusterListFilter from './ClusterListFilter';
import ClusterListEmptyState from './ClusterListEmptyState';
import ViewPaginationRow from '../viewPaginationRow';
import LoadingModal from '../LoadingModal';
import ClusterStateIcon from '../ClusterStateIcon';
import NumberWithUnit from '../NumberWithUnit';
import ClusterLocationLabel from './ClusterLocationLabel';
import RefreshBtn from '../RefreshButton';

import CreateClusterForm from '../../cluster/forms/CreateClusterForm';
import EditClusterDialog from '../../cluster/forms/EditClusterDialog';
import EditDisplayNameDialog from '../../cluster/forms/EditDisplayNameDialog';
import DeleteClusterDialog from '../../cluster/forms/DeleteClusterDialog';

import helpers from '../../../common/helpers';
import { viewConstants } from '../../../redux/constants';
import { clustersActions } from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { viewActions } from '../../../redux/actions/viewOptionsActions';

const nameColSizes = {
  md: 4,
  sm: 4,
  xs: 4,
};
const statusColSizes = {
  md: 1,
  sm: 1,
  xs: 1,
};
const statColSizes = {
  md: 1,
  sm: 1,
  xs: 1,
};
const locationColSizes = {
  md: 2,
  sm: 2,
  xs: 2,
};

function renderClusterStatusIcon(clusterState, id) {
  const tooltip = clusterState; // We might want a different string later, but that's a good start
  return (
    <OverlayTrigger
      overlay={<Tooltip style={{ textTransform: 'capitalize' }} id={`${id}-status-tooltip`}>{tooltip}</Tooltip>}
      placement="top"
      trigger={['hover', 'focus']}
      rootClose={false}
    >
      {/* The span here is needed to work around a bug that caused the tooltip
      to not render after we moved the icon to its own component */}
      <span>
        <ClusterStateIcon clusterState={typeof clusterState !== 'undefined' ? clusterState : ''} />
      </span>
    </OverlayTrigger>);
}

function renderClusterType(clusterDedicated, id) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={`${id}-type-tooltip`}>{clusterDedicated ? 'OpenShift Dedicated (OSD) cluster managed by Red Hat' : 'Self-managed OpenShift Container Platform (OCP) cluster'}</Tooltip>}
      placement="top"
      trigger={['hover', 'focus']}
      rootClose={false}
    >
      <span>{clusterDedicated ? 'Dedicated' : 'Self-managed'}</span>
    </OverlayTrigger>);
}

class ClusterList extends Component {
  constructor() {
    super();
    // refresh needs to be bound because it is passed to another componenet
    this.refresh = this.refresh.bind(this);
  }

  state = {
    clusterCreationFormVisible: false,
    editClusterDialogVisible: false,
    deleteClusterDialogVisible: false,
    deleteClusterClusterID: '',
    deleteClusterClusterName: '',
  }

  componentDidMount() {
    const { getCloudProviders, cloudProviders } = this.props;
    this.refresh();
    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
  }

  componentDidUpdate(prevProps) {
    // Check for changes resulting in a fetch
    const { viewOptions, valid, pending } = this.props;
    if ((!valid && !pending)
        || helpers.viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      this.refresh();
    }
  }

  onSortToggle(id) {
    const { viewOptions, setSorting } = this.props;
    const sorting = Object.assign({}, viewOptions.sorting);
    if (viewOptions.sorting.sortField === id) {
      sorting.isAscending = !sorting.isAscending;
    }
    sorting.sortField = id;
    setSorting(sorting);
  }

  setCreationFormState(show) {
    this.setState(prevState => ({ ...prevState, clusterCreationFormVisible: show }));
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

  openDeleteClusterDialog(clusterID, clusterName) {
    this.setState(prevState => (
      {
        ...prevState,
        deleteClusterDialogVisible: true,
        deleteClusterClusterID: clusterID,
        deleteClusterClusterName: clusterName,
      }));
  }

  refresh() {
    const { fetchClusters, viewOptions } = this.props;
    fetchClusters(helpers.createViewQueryObject(viewOptions));
  }

  isSorted(id) {
    const { viewOptions } = this.props;
    return viewOptions.sorting.sortField === id;
  }


  renderPendingMessage() {
    const { pending } = this.props;

    if (pending) {
      return (
        <LoadingModal>
          Loading clusters...
        </LoadingModal>
      );
    }

    return null;
  }

  renderCreateClusterButton() {
    return (
      <Button className="cluster-list-top" bsStyle="primary" bsSize="large" onClick={() => { this.setCreationFormState(true); }}>
        Create Cluster
      </Button>
    );
  }

  renderClusterCreationForm() {
    const { clusterCreationFormVisible } = this.state;
    return (
      <Modal className="right-side-modal-pf" show={clusterCreationFormVisible} bsSize="large">
        <CreateClusterForm closeFunc={() => this.setCreationFormState(false)} />
      </Modal>
    );
  }

  // TO-DO: extract to independent component and reuse in ClusterDetails

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
              const { invalidateClusters } = this.props;
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
              const { invalidateClusters } = this.props;
              invalidateClusters();
            }
          }}
        />
      </Modal>
    );
  }

  renderDeleteClusterDialog() {
    const {
      deleteClusterDialogVisible,
      deleteClusterClusterID,
      deleteClusterClusterName,
    } = this.state;
    return (
      <Modal show={deleteClusterDialogVisible}>
        <DeleteClusterDialog
          clusterID={deleteClusterClusterID}
          clusterName={deleteClusterClusterName}
          closeFunc={(updated) => {
            this.setState(prevState => (
              {
                ...prevState,
                deleteClusterDialogVisible: false,
              }));
            if (updated) {
              const { invalidateClusters } = this.props;
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
            Error retrieving clusters:
            {' '}
            {errorMessage}
          </span>
        </Alert>
        {this.renderPendingMessage()}
      </EmptyState>
    );
  }

  renderClusterRow(cluster, index) {
    const provider = cluster.cloud_provider.id || 'N/A';
    const name = cluster.display_name || ''; // This would've been one trenary condition if the backend didn't have omitEmpty on display_name
    // The trenary for consoleURL is needed because the API does not guarantee fields being present.
    // We'll have a lot of these all over the place as we grow :(
    const consoleURL = cluster.console ? cluster.console.url : false;
    const consoleMenuItem = consoleURL ? (
      <MenuItem href={consoleURL}>
          Launch Admin Console
      </MenuItem>)
      : (
        <MenuItem disabled title="Admin console is not yet available for this cluster">
          Launch Admin Console
        </MenuItem>
      );
    const editClusterItem = (
      <MenuItem onClick={() => this.openEditClusterDialog(cluster)}>
        Edit Cluster
      </MenuItem>);
    const editDisplayNameItem = (
      <MenuItem onClick={() => this.openEditDisplayNameDialog(cluster)}>
        Edit Display Name
      </MenuItem>);

    const deleteClusterItem = cluster.dedicated ? (
      <MenuItem onClick={
    () => this.openDeleteClusterDialog(cluster.id, cluster.name)
    }
      >
    Delete Cluster
      </MenuItem>)
      : (
        <MenuItem disabled title="Self managed cluster cannot be deleted">
      Delete Cluster
        </MenuItem>
      );

    return (
      <TableGrid.Row key={index}>
        <Grid.Col {...nameColSizes}>
          <Link to={`/cluster/${cluster.id}`}>
            {/* we need to trim the display name,
             to avoid cases where a cluster name would be only spaces */}
            <OverlayTrigger
              overlay={<Tooltip id={cluster.id}>{`cluster name: ${cluster.name}`}</Tooltip>}
              placement="right"
            >
              <span>{name.trim() !== '' ? name : cluster.name}</span>
            </OverlayTrigger>
          </Link>
        </Grid.Col>
        <Grid.Col {...statusColSizes}>
          {renderClusterStatusIcon(cluster.state, cluster.id)}
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          {renderClusterType(cluster.dedicated, cluster.id)}
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.cpu.total} unit="vCPU" />
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.storage.total} isBytes />
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.memory.total} isBytes />
        </Grid.Col>
        <Grid.Col {...locationColSizes}>
          <ClusterLocationLabel
            regionID={result(cluster, 'region.id', 'N/A')}
            cloudProviderID={provider}
          />
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <DropdownKebab id={`${cluster.id}-dropdown`} pullRight>
            {consoleMenuItem}
            {editDisplayNameItem}
            {editClusterItem}
            {deleteClusterItem}
          </DropdownKebab>
        </Grid.Col>
      </TableGrid.Row>
    );
  }

  renderTable() {
    const { viewOptions } = this.props;
    let { clusters } = this.props;
    if (!clusters) {
      clusters = [];
    }
    return (
      <React.Fragment>
        <TableGrid id="table-grid">
          <TableGrid.Head>
            <TableGrid.ColumnHeader
              id="name"
              sortable
              isSorted={this.isSorted('name')}
              isAscending={viewOptions.sorting.isAscending}
              onSortToggle={() => this.onSortToggle('name')}
              {...nameColSizes}
            >
              Name
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader
              id="status"
              isSorted={false}
              isAscending
              {...statusColSizes}
            >
              Status
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader
              id="type"
              isSorted={false}
              isAscending
              {...statColSizes}
            >
              Type
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader
              id="cpu"
              isSorted={false}
              isAscending
              {...statColSizes}
            >
              CPU
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader
              id="memory"
              isSorted={false}
              isAscending
              {...statColSizes}
            >
              Memory
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader
              id="storage"
              isSorted={false}
              isAscending
              {...statColSizes}
            >
              Storage
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader
              id="location"
              isSorted={false}
              isAscending
              {...locationColSizes}
            >
              Provider (Location)
            </TableGrid.ColumnHeader>
          </TableGrid.Head>
          <TableGrid.Body>
            {clusters.map((cluster, index) => this.renderClusterRow(cluster, index))}
          </TableGrid.Body>
        </TableGrid>
        <ViewPaginationRow
          viewType={viewConstants.CLUSTERS_VIEW}
          currentPage={viewOptions.currentPage}
          pageSize={viewOptions.pageSize}
          totalCount={viewOptions.totalCount}
          totalPages={viewOptions.totalPages}
        />
      </React.Fragment>);
  }

  render() {
    const {
      error, pending, clusters, viewOptions,
    } = this.props;

    if (error) {
      return this.renderError();
    }

    if (!size(clusters) && pending && isEmpty(viewOptions.filter)) {
      return this.renderPendingMessage();
    }
    if (!size(clusters) && !pending && isEmpty(viewOptions.filter)) {
      return (
        <React.Fragment>
          <ClusterListEmptyState showCreationForm={() => { this.setCreationFormState(true); }} />
          {this.renderClusterCreationForm()}
          {this.renderPendingMessage()}
        </React.Fragment>
      );
    }

    return (
      <div className="cluster-list">
        <Grid fluid style={{ padding: 0 }}>
          <Row><Col sm={1}><h1>Clusters</h1></Col></Row>
          <Row>
            <Col sm={1}>
              {this.renderCreateClusterButton()}
            </Col>
            <Col sm={1}>
              {pending ? <Spinner loading /> : null}
            </Col>
            <Col sm={2} smOffset={8}>
              <RefreshBtn id="refresh" refreshFunc={this.refresh} classOptions="pull-right cluster-list-top" />
              <ClusterListFilter />
            </Col>
          </Row>
        </Grid>
        {this.renderTable()}
        {this.renderClusterCreationForm()}
        {this.renderEditClusterDialog()}
        {this.renderEditDisplayNameDialog()}
        {this.renderDeleteClusterDialog()}
      </div>
    );
  }
}

ClusterList.propTypes = {
  invalidateClusters: PropTypes.func.isRequired,
  fetchClusters: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  clusters: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,
  fulfilled: PropTypes.bool.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  invalidateClusters: () => clustersActions.invalidateClusters(),
  fetchClusters: queryObj => clustersActions.fetchClusters(queryObj),
  setSorting: sorting => viewActions.onListSortBy(sorting, viewConstants.CLUSTERS_VIEW),
  getCloudProviders: cloudProviderActions.getCloudProviders,
};

const mapStateToProps = state => Object.assign(
  {},
  state.clusters.clusters,
  {
    viewOptions: state.viewOptions[viewConstants.CLUSTERS_VIEW],
    cloudProviders: state.cloudProviders.cloudProviders,
  },
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterList);
