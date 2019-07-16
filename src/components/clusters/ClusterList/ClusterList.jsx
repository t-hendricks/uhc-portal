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
  EmptyState, Spinner,
} from 'patternfly-react';
import { Split, SplitItem, Card } from '@patternfly/react-core';

import ClusterListFilter from './components/ClusterListFilter';
import ClusterListEmptyState from './components/ClusterListEmptyState';
import ClusterListTable from './components/ClusterListTable/ClusterListTable';
import LoadingModal from '../../common/LoadingModal';
import CreateClusterDropdown from './components/CreateClusterDropdown';
import RefreshBtn from '../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../common/ErrorTriangle';
import GlobalErrorBox from '../common/GlobalErrorBox';
import ErrorBox from '../../common/ErrorBox';


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
    const { errorMessage, operationID } = this.props;
    return (
      <EmptyState>
        <ErrorBox message="Error retreiving clusters" response={{ errorMessage, operationID }} />
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
          <GlobalErrorBox />
          <ClusterListEmptyState
            showCreationForm={() => openModal('create-cluster')}
            hasQuota={hasQuota}
          />

          <CreateClusterModal />
        </React.Fragment>
      );
    }

    return (
      <Card>
        <div className="cluster-list">
          <GlobalErrorBox />
          <h1>Clusters</h1>
          <Split>
            <SplitItem>
              <CreateClusterDropdown
                showCreationForm={() => openModal('create-cluster')}
                hasQuota={hasQuota}
              />
            </SplitItem>
            <SplitItem className="save-space-for-spinner">
              {pending && <Spinner loading />}
              {error && <ErrorTriangle errorMessage={errorMessage} />}
            </SplitItem>
            <SplitItem isFilled />
            <SplitItem>
              <ClusterListFilter />
            </SplitItem>
            <SplitItem>
              <RefreshBtn autoRefresh refreshFunc={this.refresh} classOptions="cluster-list-top" />
            </SplitItem>
          </Split>
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
      </Card>
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
  operationID: PropTypes.string,
};

export default ClusterList;
