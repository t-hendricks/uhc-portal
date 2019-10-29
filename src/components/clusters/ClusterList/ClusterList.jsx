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
import { Link } from 'react-router-dom';

import { Spinner, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
  Alert,
  AlertActionCloseButton,
  Button,
  Card,
  EmptyState,
  Split,
  SplitItem,
  PageSection,
} from '@patternfly/react-core';

import ClusterListFilter from '../common/ClusterListFilter';
import ClusterListExtraActions from './components/ClusterListExtraActions';
import ClusterListFilterDropdown from './components/ClusterListFilterDropdown';
import ClusterListFilterChipGroup from './components/ClusterListFilterChipGroup';

import ClusterListEmptyState from './components/ClusterListEmptyState';
import ClusterListTable from './components/ClusterListTable/ClusterListTable';
import RefreshBtn from '../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../common/ErrorTriangle';
import GlobalErrorBox from '../common/GlobalErrorBox';
import ErrorBox from '../../common/ErrorBox';


import EditClusterDialog from '../common/EditClusterDialog';
import ArchiveClusterDialog from '../common/ArchiveClusterDialog';
import UnarchiveClusterDialog from '../common/UnarchiveClusterDialog';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import EditConsoleURLDialog from '../common/EditConsoleURLDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog/DeleteClusterDialog';

import ViewPaginationRow from '../common/ViewPaginationRow/viewPaginationRow';

import helpers from '../../../common/helpers';
import { viewConstants } from '../../../redux/constants';

const getQueryParam = (param) => {
  let ret;
  window.location.search.substring(1).split('&').forEach((queryString) => {
    const [key, val] = queryString.split('=');
    if (key === param) {
      ret = val;
    }
  });
  return ret;
};

class ClusterList extends Component {
  constructor(props) {
    super(props);

    // refresh needs to be bound because it is passed to another component
    this.refresh = this.refresh.bind(this);
    // the various open dialog methods get called from the table component
  }

  componentDidMount() {
    document.title = 'Clusters | Red Hat OpenShift Cluster Manager';
    const {
      getCloudProviders, cloudProviders, organization, getOrganizationAndQuota, setListFlag,
    } = this.props;

    const entitelmentStatusFilter = getQueryParam('entitlement_status') || '';
    const planIDFilter = getQueryParam('plan_id') || '';

    if (!isEmpty(entitelmentStatusFilter) || !isEmpty(planIDFilter)) {
      setListFlag('subscriptionFilter', {
        entitlement_status: entitelmentStatusFilter.split(',').filter(Boolean),
        plan_id: planIDFilter.split(',').filter(value => (value === 'OCP' || value === 'OSD')),
      });
    } else {
      // only call refresh if we're not setting the filter flag. When the flag is set, refresh
      // will be called via componentDidUpdate() after the redux state transition
      this.refresh();
    }

    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
    if (!organization.fulfilled && !organization.pending) {
      getOrganizationAndQuota();
    }
  }

  componentDidUpdate(prevProps) {
    // Check for changes resulting in a fetch
    const {
      viewOptions, valid, pending, archivedCluster, closeToast,
    } = this.props;
    if ((!valid && !pending)
        || helpers.viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      this.refresh();
    }
    if (!prevProps.archivedCluster.showToast && archivedCluster.showToast) {
      setTimeout(closeToast, 8000);
    }
  }

  componentWillUnmount() {
    const { closeModal } = this.props;
    closeModal();
  }

  refresh() {
    const { fetchClusters, viewOptions } = this.props;
    fetchClusters(helpers.createViewQueryObject(viewOptions));
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
      errorMessage,
      organization,
      archivedCluster,
      operationID,
      closeToast,
    } = this.props;

    const toast = archivedCluster.showToast && (
      <Alert
        className="archived-cluster-toast"
        variant="success"
        title="Cluster successfully archived"
        action={<AlertActionCloseButton onClose={() => closeToast()} />}
      />
    );

    const pageHeader = (
      <PageHeader>
        <PageHeaderTitle title="Clusters" />
      </PageHeader>
    );

    if (error && !size(clusters)) {
      return (
        <PageSection>
          {toast}
          <EmptyState>
            <ErrorBox
              message="Error retrieving clusters"
              response={{
                errorMessage,
                operationID,
              }}
            />
          </EmptyState>
        </PageSection>);
    }

    if ((!size(clusters) && pending && (isEmpty(viewOptions.filter) || !valid))
    || (!organization.fulfilled && !organization.error)) {
      return (
        <React.Fragment>
          {toast}
          {pageHeader}
          <PageSection>
            <Card>
              <div className="cluster-list">
                <div className="cluster-loading-container">
                  <Spinner centered />
                </div>
              </div>
            </Card>
          </PageSection>
        </React.Fragment>
      );
    }

    if (!size(clusters) && !pending && isEmpty(viewOptions.filter)
        && helpers.nestedIsEmpty(viewOptions.flags.subscriptionFilter)) {
      return (
        <PageSection>
          {toast}
          <GlobalErrorBox />
          <ClusterListEmptyState hasQuota={hasQuota} />
        </PageSection>
      );
    }

    return (
      <React.Fragment>
        {pageHeader}
        <PageSection>
          <Card>
            <div className="cluster-list">
              {toast}
              <GlobalErrorBox />
              <Split id="cluster-list-top">
                <SplitItem>
                  <ClusterListFilter view={viewConstants.CLUSTERS_VIEW} />
                </SplitItem>
                <SplitItem className="split-margin-left">
                  <ClusterListFilterDropdown />
                </SplitItem>
                <SplitItem className="split-margin-left">
                  <Link to={hasQuota ? '/create' : '/install'}>
                    <Button>Create Cluster</Button>
                  </Link>
                </SplitItem>
                <SplitItem>
                  <ClusterListExtraActions />
                </SplitItem>
                <SplitItem className="spinner-fit-container">
                  { pending && <Spinner className="cluster-list-spinner" /> }
                  { error && <ErrorTriangle errorMessage={errorMessage} className="cluster-list-warning" /> }
                </SplitItem>
                <SplitItem isFilled />
                <SplitItem>
                  <ViewPaginationRow
                    viewType={viewConstants.CLUSTERS_VIEW}
                    currentPage={viewOptions.currentPage}
                    pageSize={viewOptions.pageSize}
                    totalCount={viewOptions.totalCount}
                    totalPages={viewOptions.totalPages}
                    variant="top"
                  />
                </SplitItem>
                <SplitItem>
                  <RefreshBtn autoRefresh refreshFunc={this.refresh} classOptions="cluster-list-top" />
                </SplitItem>
              </Split>
              <ClusterListFilterChipGroup />
              <ClusterListTable
                clusters={clusters || []}
                viewOptions={viewOptions}
                setSorting={setSorting}
                openDeleteClusterDialog={(modalData) => {
                  openModal('delete-cluster', modalData);
                }}
              />
              <ViewPaginationRow
                viewType={viewConstants.CLUSTERS_VIEW}
                currentPage={viewOptions.currentPage}
                pageSize={viewOptions.pageSize}
                totalCount={viewOptions.totalCount}
                totalPages={viewOptions.totalPages}
                variant="bottom"
              />
              <EditDisplayNameDialog onClose={invalidateClusters} />
              <EditConsoleURLDialog onClose={invalidateClusters} />
              <EditClusterDialog onClose={invalidateClusters} />
              <ArchiveClusterDialog onClose={invalidateClusters} />
              <UnarchiveClusterDialog onClose={invalidateClusters} />
              <DeleteClusterDialog onClose={(shouldRefresh) => {
                if (shouldRefresh) {
                  invalidateClusters();
                }
              }}
              />
            </div>
          </Card>
        </PageSection>
      </React.Fragment>
    );
  }
}

ClusterList.propTypes = {
  invalidateClusters: PropTypes.func.isRequired,
  fetchClusters: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  clusters: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
  pending: PropTypes.bool.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  hasQuota: PropTypes.bool.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  setListFlag: PropTypes.func.isRequired,
  operationID: PropTypes.string,
  archivedCluster: PropTypes.shape({
    showToast: PropTypes.bool.isRequired,
  }),
  closeToast: PropTypes.func.isRequired,
};

export default ClusterList;
