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
  Alert, Button, Grid, Row, Col, EmptyState, Tooltip, OverlayTrigger, DropdownKebab, MenuItem,
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

import helpers from '../../common/helpers';
import { viewConstants } from '../../redux/constants';
import { fetchClusters } from '../../redux/actions/clusterActions';

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

function renderClusterRow(cluster, index) {
  const location = `${cluster.provider} (${cluster.region})`;
  return (
    <TableGrid.Row key={index}>
      <Grid.Col {...nameColSizes}>
        <Link to={`/cluster/${cluster.id}`}>
          {cluster.name}
        </Link>
      </Grid.Col>
      <Grid.Col {...statusColSizes}>{renderClusterStatusIcon(cluster.state, cluster.id)}</Grid.Col>
      <Grid.Col {...statColSizes}>Red Hat</Grid.Col>
      <Grid.Col {...statColSizes}>{cluster.cpu.total}</Grid.Col>
      <Grid.Col {...statColSizes}>{cluster.storage.total}</Grid.Col>
      <Grid.Col {...statColSizes}>{cluster.memory.total}</Grid.Col>
      <Grid.Col {...locationColSizes}>{location}</Grid.Col>
      <Grid.Col {...statColSizes}>
        <DropdownKebab id={`${cluster.id}-dropdown`} pullRight>
          <MenuItem>
            Launch Admin Console
          </MenuItem>
          <MenuItem>
            Action
          </MenuItem>
        </DropdownKebab>
      </Grid.Col>
    </TableGrid.Row>
  );
}


class ClusterList extends Component {
  state = {
    clusterCreationFormVisible: false,
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillUpdate(nextProps) {
    // Check for changes resulting in a fetch
    const { viewOptions } = this.props;
    if (helpers.viewPropsChanged(nextProps.viewOptions, viewOptions)) {
      this.refresh(nextProps);
    }
  }

  setCreationFormState(show) {
    this.setState(prevState => ({ ...prevState, clusterCreationFormVisible: show }));
  }


  refresh(props) {
    const options = _.get(props, 'viewOptions') || this.props.viewOptions;
    this.props.fetchClusters(helpers.createViewQueryObject(options));
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
      <CreateClusterForm show={clusterCreationFormVisible} closeFunc={() => this.setCreationFormState(false)} />
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

  renderTable() {
    const { viewOptions, pending } = this.props;
    let { clusters } = this.props;
    if (pending) {
      return this.renderPendingMessage();
    }
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
              isSorted={false}
              isAscending
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
            {clusters.map((cluster, index) => renderClusterRow(cluster, index))}
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
            <Col sm={2} smOffset={8}>
              <ClusterListFilter />
            </Col>
          </Row>
        </Grid>
        {this.renderTable()}
        {this.renderClusterCreationForm()}
      </div>
    );
  }
}

ClusterList.propTypes = {
  fetchClusters: PropTypes.func.isRequired,
  clusters: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,
  fulfilled: PropTypes.bool.isRequired,
  viewOptions: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  fetchClusters: queryObj => dispatch(fetchClusters(queryObj)),
});

const mapStateToProps = state => Object.assign(
  {},
  state.cluster.clusters,
  { viewOptions: state.viewOptions[viewConstants.CLUSTERS_VIEW] },
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterList);
