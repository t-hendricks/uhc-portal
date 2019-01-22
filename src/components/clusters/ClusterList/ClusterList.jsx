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
  Alert, Grid, Row, Col, EmptyState, Spinner, Modal,
} from 'patternfly-react';

import ClusterListFilter from './ClusterListFilter';
import ClusterListEmptyState from './ClusterListEmptyState';
import ClusterListTable from './ClusterListTable';
import LoadingModal from '../LoadingModal';
import CreateClusterDropdown from './CreateClusterDropdown';
import RefreshBtn from '../RefreshButton';

import CreateClusterModal from '../CreateClusterModal';
import EditClusterDialog from '../../cluster/forms/EditClusterDialog';
import EditDisplayNameDialog from '../../cluster/forms/EditDisplayNameDialog';
import DeleteClusterDialog from '../../cluster/forms/DeleteClusterDialog';

import helpers from '../../../common/helpers';
import { viewConstants } from '../../../redux/constants';
import { clustersActions } from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { viewActions } from '../../../redux/actions/viewOptionsActions';
import { modalActions } from '../../Modal/ModalActions';

class ClusterList extends Component {
  constructor() {
    super();
    // refresh needs to be bound because it is passed to another componenet
    this.refresh = this.refresh.bind(this);
    // the various open dialog methods get called from the table component
    this.openEditClusterDialog = this.openEditClusterDialog.bind(this);
    this.openDeleteClusterDialog = this.openDeleteClusterDialog.bind(this);
    this.openEditDisplayNameDialog = this.openEditDisplayNameDialog.bind(this);
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

  // TO-DO: use generic modal for all dialogs

  renderEditClusterDialog() {
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
      <Modal
        show={deleteClusterDialogVisible}
        onHide={() => this.setState({ deleteClusterDialogVisible: false })}
      >
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
          <span>{`Error retrieving clusters: ${errorMessage}`}</span>
        </Alert>
        {this.renderPendingMessage()}
      </EmptyState>
    );
  }

  render() {
    const {
      error, pending, clusters, viewOptions, setSorting, openModal,
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
          <ClusterListEmptyState showCreationForm={() => { openModal('create-cluster'); }} />
          {this.renderPendingMessage()}
          <CreateClusterModal />
        </React.Fragment>
      );
    }
    return (
      <div className="cluster-list">
        <Grid fluid style={{ padding: 0 }}>
          <Row><Col sm={1}><h1>Clusters</h1></Col></Row>
          <Row className="cluster-list-top-row">
            <Col sm={1}>
              <CreateClusterDropdown
                showCreationForm={() => openModal('create-cluster')}
              />
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
        <ClusterListTable
          clusters={clusters || []}
          viewOptions={viewOptions}
          setSorting={setSorting}
          openEditClusterDialog={this.openEditClusterDialog}
          openDeleteClusterDialog={this.openDeleteClusterDialog}
          openEditDisplayNameDialog={this.openEditDisplayNameDialog}
        />
        {this.renderEditClusterDialog()}
        {this.renderEditDisplayNameDialog()}
        {this.renderDeleteClusterDialog()}
        <CreateClusterModal />
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
