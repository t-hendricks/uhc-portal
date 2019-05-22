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

import {
  Alert, Grid, Row, Col, EmptyState, Spinner,
  Icon, Tooltip, OverlayTrigger,
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

class ClusterList extends Component {
  constructor(props) {
    super(props);

    // refresh needs to be bound because it is passed to another componenet
    this.refresh = this.refresh.bind(this);
    // the various open dialog methods get called from the table component
  }

  componentDidMount() {
    document.title = 'Clusters | Red Hat OpenShift Cluster Manager';
    const {
      getCloudProviders, cloudProviders, organization, getOrganization,
    } = this.props;

    this.refresh();
    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
    if (!organization.fulfilled && !organization.pending) {
      getOrganization();
    }
  }

  componentDidUpdate(prevProps) {
    // Check for changes resulting in a fetch
    const {
      viewOptions, valid, pending, organization, getQuota, quota,
    } = this.props;
    if ((!valid && !pending)
        || helpers.viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      this.refresh();
    }

    if (organization.fulfilled && !quota.pending && !quota.fulfilled && !quota.error) {
      getQuota(organization.details.id);
    }
  }

  refresh() {
    const { fetchClusters, viewOptions } = this.props;
    fetchClusters(helpers.createViewQueryObject(viewOptions));
  }

  renderError() {
    const { errorMessage } = this.props;
    return (
      <EmptyState>
        <Alert type="error">
          <span>{`Error retrieving clusters: ${errorMessage}`}</span>
        </Alert>
      </EmptyState>
    );
  }

  render() {
    const {
      error,
      valid,
      pending,
      clusters,
      viewOptions,
      setSorting,
      openModal,
      invalidateClusters,
      hasQuota,
      quota,
      errorMessage,
      organization,
    } = this.props;

    if (error && !size(clusters)) {
      return this.renderError();
    }

    if ((!size(clusters) && pending && (isEmpty(viewOptions.filter) || !valid))
    || (!quota.fulfilled && !organization.error && !quota.error)) {
      return (
        <LoadingModal>
          Loading clusters...
        </LoadingModal>
      );
    }

    if (!size(clusters) && !pending && isEmpty(viewOptions.filter)) {
      return (
        <React.Fragment>
          <ClusterListEmptyState
            showCreationForm={() => openModal('create-cluster')}
            showOCPCreationForm={() => openModal('create-cluster', { isManaged: false })}
            hasQuota={hasQuota}
          />

          <CreateClusterModal />
        </React.Fragment>
      );
    }

    const errorTriangle = () => (
      <OverlayTrigger
        overlay={(
          <Tooltip id="cluster-list-error-tooltip">
            An error occured when fetching clusters:
            {' '}
            {errorMessage}
          </Tooltip>
        )}
        placement="top"
        trigger={['hover', 'focus']}
        rootClose={false}
      >
        <Icon type="pf" className="fa-2x clusterlist-error-triangle" name="warning-triangle-o" />
      </OverlayTrigger>
    );

    return (
      <div>
        <div className="cluster-list">
          <Grid fluid style={{ padding: 0 }}>
            <Row><Col sm={1}><h1>Clusters</h1></Col></Row>
            <Row className="cluster-list-top-row">
              <Col xs={2} sm={1}>
                <CreateClusterDropdown
                  showCreationForm={() => openModal('create-cluster')}
                  showOCPCreationForm={() => openModal('create-cluster', { isManaged: false })}
                  hasQuota={hasQuota}
                />
              </Col>
              <Col xs={1}>
                {pending && <Spinner loading />}
                {error && errorTriangle()}
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
  organization: PropTypes.object.isRequired,
  quota: PropTypes.object.isRequired,
  getQuota: PropTypes.func.isRequired,
  hasQuota: PropTypes.bool.isRequired,
  getOrganization: PropTypes.func.isRequired,
};

export default ClusterList;
