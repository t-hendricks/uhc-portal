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
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Alert, Grid, Row, Col, EmptyState, Spinner,
} from 'patternfly-react';

import ClusterListFilter from './components/ClusterListFilter';
import ClusterListEmptyState from './components/ClusterListEmptyState';
import ClusterListTable from './components/ClusterListTable/ClusterListTable';
import LoadingModal from '../../common/LoadingModal';
import CreateClusterDropdown from './components/CreateClusterDropdown';
import RefreshBtn from '../../common/RefreshButton/RefreshButton';

import CreateClusterModal from './components/CreateClusterModal';
import EditClusterDialog from '../common/EditClusterDialog';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog/DeleteClusterDialog';

import ViewPaginationRow from './components/viewPaginationRow';

import helpers from '../../../common/helpers';
import { viewConstants } from '../../../redux/constants';
import { clustersActions } from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { viewActions } from '../../../redux/actions/viewOptionsActions';
import { modalActions } from '../../common/Modal/ModalActions';

import AlphaNotice from '../../common/AlphaNotice';

class ClusterList extends Component {
  constructor(props) {
    super(props);

    // refresh needs to be bound because it is passed to another componenet
    this.refresh = this.refresh.bind(this);
    // the various open dialog methods get called from the table component
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

  refresh() {
    const { fetchClusters, viewOptions } = this.props;
    fetchClusters(helpers.createViewQueryObject(viewOptions));
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

  renderError() {
    const { errorMessage } = this.props;
    return (
      <EmptyState>
        <Alert type="error">
          <span>{`Error retrieving clusters: ${errorMessage}`}</span>
        </Alert>
        {this.renderPendingMessage()}
      </EmptyState>
    );
  }

  render() {
    const {
      error, pending, clusters, viewOptions, setSorting, openModal, invalidateClusters,
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
          <ClusterListEmptyState
            showCreationForm={() => openModal('create-cluster')}
            showOCPCreationForm={() => openModal('create-cluster', { isManaged: false })}
          />
          {this.renderPendingMessage()}
          <CreateClusterModal />
        </React.Fragment>
      );
    }
    return (
      <div>
        <AlphaNotice />
        <div className="cluster-list">
          <Grid fluid style={{ padding: 0 }}>
            <Row><Col sm={1}><h1>Clusters</h1></Col></Row>
            <Row className="cluster-list-top-row">
              <Col xs={2} sm={1}>
                <CreateClusterDropdown
                  showCreationForm={() => openModal('create-cluster')}
                  showOCPCreationForm={() => openModal('create-cluster', { isManaged: false })}
                />
              </Col>
              <Col xs={1}>
                {pending ? <Spinner loading /> : null }
              </Col>
              <Col>
                <RefreshBtn id="refresh" autoRefresh refreshFunc={this.refresh} classOptions="pull-right cluster-list-top" />
                <ClusterListFilter />
              </Col>
            </Row>
          </Grid>
          <ClusterListTable
            clusters={clusters || []}
            viewOptions={viewOptions}
            setSorting={setSorting}
            openDeleteClusterDialog={(modalData) => {
              openModal('delete-cluster', modalData);
            }}
          />
          <EditDisplayNameDialog onClose={invalidateClusters} />
          <EditClusterDialog onClose={invalidateClusters} />
          <DeleteClusterDialog onClose={(shouldRefresh) => {
            if (shouldRefresh) {
              invalidateClusters();
            }
          }}
          />
          <CreateClusterModal />
        </div>
        <ViewPaginationRow
          viewType={viewConstants.CLUSTERS_VIEW}
          currentPage={viewOptions.currentPage}
          pageSize={viewOptions.pageSize}
          totalCount={viewOptions.totalCount}
          totalPages={viewOptions.totalPages}
        />
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
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  invalidateClusters: () => clustersActions.invalidateClusters(),
  fetchClusters: queryObj => clustersActions.fetchClusters(queryObj),
  setSorting: sorting => viewActions.onListSortBy(sorting, viewConstants.CLUSTERS_VIEW),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  openModal: modalActions.openModal,
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
