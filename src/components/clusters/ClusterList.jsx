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

import * as _ from 'lodash-es';
import React, { Component } from 'react';

import {
  Alert, Button, Grid, Row, Col, EmptyState, ModelessOverlay, Tooltip,
  OverlayTrigger, DropdownKebab, MenuItem, Spinner, Modal,
} from 'patternfly-react';
import { TableGrid } from 'patternfly-react-extensions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ClusterListFilter from './ClusterListFilter';
import CreateClusterForm from './CreateClusterForm';
import ViewPaginationRow from './viewPaginationRow';
import LoadingModal from './LoadingModal';
import ClusterStateIcon from './ClusterStateIcon';
import EditDisplayNameDialog from './EditDisplayNameDialog';
import NumberWithUnit from './NumberWithUnit';

import helpers from '../../common/helpers';
import { viewConstants } from '../../redux/constants';
import { clusterActions } from '../../redux/actions/clusterActions';
import { viewActions } from '../../redux/actions/viewOptionsActions';

// TODO not sure about the sizes
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
  md: 1,
  sm: 1,
  xs: 1,
};

function renderClusterStatusIcon(clusterState, id) {
  const tooltip = clusterState; // We might want a different string later, but that's a good start
  return (
    <OverlayTrigger
      overlay={<Tooltip id={`${id}-status-tooltip`}>{tooltip}</Tooltip>}
      placement="top"
      trigger={['hover', 'focus']}
      rootClose={false}
    >
      {/* The span here is needed to work around a bug that caused the tooltip
      to not render after we moved the icon to its own component */}
      <span>
        <ClusterStateIcon clusterState={clusterState} />
      </span>
    </OverlayTrigger>);
}


class ClusterList extends Component {
  state = {
    clusterCreationFormVisible: false,
    editClusterDisplayNameDialogVisible: false,
    editClusterDisplayNameClusterID: '',
    editClusterDisplayNameClusterName: '',
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillUpdate(nextProps) {
    // Check for changes resulting in a fetch
    const { viewOptions } = this.props;
    if (!nextProps.valid
        || helpers.viewPropsChanged(nextProps.viewOptions, viewOptions)) {
      this.refresh(nextProps);
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

  openEditDisplayNameDialog(clusterID, clusterName) {
    this.setState(prevState => (
      {
        ...prevState,
        editClusterDisplayNameDialogVisible: true,
        editClusterDisplayNameClusterID: clusterID,
        editClusterDisplayNameClusterName: clusterName,
      }));
  }

  refresh(nextProps) {
    const { fetchClusters, viewOptions } = this.props;
    const options = _.get(nextProps, 'viewOptions') || viewOptions;
    fetchClusters(helpers.createViewQueryObject(options));
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
      <Button bsStyle="primary" bsSize="large" onClick={() => { this.setCreationFormState(true); }}>
        Create
      </Button>
    );
  }

  renderClusterCreationForm() {
    const { clusterCreationFormVisible } = this.state;
    return (
      <ModelessOverlay show={clusterCreationFormVisible} bsSize="large">
        <CreateClusterForm closeFunc={() => this.setCreationFormState(false)} />
      </ModelessOverlay>
    );
  }

  renderEditClusterDisplayNameDialog() {
    const {
      editClusterDisplayNameDialogVisible,
      editClusterDisplayNameClusterID,
      editClusterDisplayNameClusterName,
    } = this.state;
    return (
      <Modal show={editClusterDisplayNameDialogVisible}>
        <EditDisplayNameDialog
          clusterID={editClusterDisplayNameClusterID}
          clusterName={editClusterDisplayNameClusterName}
          closeFunc={(updated) => {
            this.setState(prevState => (
              {
                ...prevState,
                editClusterDisplayNameDialogVisible: false,
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
    const location = `${provider.toUpperCase()} (${cluster.region})`;
    return (
      <TableGrid.Row key={index}>
        <Grid.Col {...nameColSizes}>
          <Link to={`/cluster/${cluster.id}`}>
            {/* we need to trim the display name,
             to avoid cases where a cluster name would be only spaces */}
            {name.trim() !== '' ? name : cluster.name}
          </Link>
        </Grid.Col>
        <Grid.Col {...statusColSizes}>
          {renderClusterStatusIcon(cluster.state, cluster.id)}
        </Grid.Col>
        <Grid.Col {...statColSizes}>Red Hat</Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.cpu.total} unit="vCPU" />
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.storage.total} isBytes />
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.memory.total} isBytes />
        </Grid.Col>
        <Grid.Col {...locationColSizes}>{location}</Grid.Col>
        <Grid.Col {...statColSizes}>
          <DropdownKebab id={`${cluster.id}-dropdown`} pullRight>
            <MenuItem>
              Launch Admin Console
            </MenuItem>
            <MenuItem onClick={() => this.openEditDisplayNameDialog(cluster.id, cluster.name)}>
              Edit Display Name
            </MenuItem>
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
              id="managed"
              isSorted={false}
              isAscending
              {...statColSizes}
            >
              Managed
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

    if (!_.size(clusters) && pending && _.isEmpty(viewOptions.filter)) {
      return this.renderPendingMessage();
    }
    if (!_.size(clusters) && !pending && _.isEmpty(viewOptions.filter)) {
      return (
        <React.Fragment>
          <Grid fluid>
            <Row>
              <EmptyState className="full-page-blank-slate">
                <EmptyState.Icon />
                <EmptyState.Title>
                  No Clusters Exists
                </EmptyState.Title>
                <EmptyState.Info>
                  There are no clusters to display. Create a cluster to get started.
                </EmptyState.Info>
                <EmptyState.Action>
                  {this.renderCreateClusterButton()}
                </EmptyState.Action>
              </EmptyState>
            </Row>
          </Grid>
          {this.renderClusterCreationForm()}
          {this.renderPendingMessage()}
        </React.Fragment>
      );
    }

    return (
      <div className="cluster-list">
        <h1>Clusters</h1>
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col sm={1}>
              {this.renderCreateClusterButton()}
            </Col>
            <Col sm={1}>
              {pending ? <Spinner loading /> : null}
            </Col>
            <Col sm={2} smOffset={7}>
              <ClusterListFilter />
            </Col>
          </Row>
        </Grid>
        {this.renderTable()}
        {this.renderClusterCreationForm()}
        {this.renderEditClusterDisplayNameDialog()}
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
};

const mapDispatchToProps = {
  invalidateClusters: () => clusterActions.invalidateClusters(),
  fetchClusters: queryObj => clusterActions.fetchClusters(queryObj),
  setSorting: sorting => viewActions.onListSortBy(sorting, viewConstants.CLUSTERS_VIEW),
};

const mapStateToProps = state => Object.assign(
  {},
  state.cluster.clusters,
  { viewOptions: state.viewOptions[viewConstants.CLUSTERS_VIEW] },
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterList);
