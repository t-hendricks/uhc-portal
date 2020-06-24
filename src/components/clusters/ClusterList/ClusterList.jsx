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

import {
  Spinner, PageHeader, PageHeaderTitle, TableToolbar,
} from '@redhat-cloud-services/frontend-components';
import {
  Button,
  Card,
  EmptyState,
  PageSection,
} from '@patternfly/react-core';

import ClusterListFilter from '../common/ClusterListFilter';
import ClusterListExtraActions from './components/ClusterListExtraActions';
import ClusterListFilterDropdown from './components/ClusterListFilterDropdown';
import ClusterListFilterChipGroup from './components/ClusterListFilterChipGroup';

import ClusterListEmptyState from './components/ClusterListEmptyState';
import ClusterListTable from './components/ClusterListTable';
import RefreshBtn from '../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../common/ErrorTriangle';
import GlobalErrorBox from '../common/GlobalErrorBox';
import ErrorBox from '../../common/ErrorBox';

import ScaleClusterDialog from '../common/ScaleClusterDialog';
import ArchiveClusterDialog from '../common/ArchiveClusterDialog';
import UnarchiveClusterDialog from '../common/UnarchiveClusterDialog';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import EditConsoleURLDialog from '../common/EditConsoleURLDialog';
import EditSubscriptionSettingsDialog from '../common/EditSubscriptionSettingsDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog/DeleteClusterDialog';
import EditDisconnectedCluster from '../common/EditDisconnectedCluster';

import ViewPaginationRow from '../common/ViewPaginationRow/viewPaginationRow';

import helpers, { scrollToTop } from '../../../common/helpers';
import { viewPropsChanged, createViewQueryObject, getQueryParam } from '../../../common/queryHelpers';
import { viewConstants } from '../../../redux/constants';


class ClusterList extends Component {
  state = {
    loadingChangedView: false,
  };

  componentDidMount() {
    document.title = 'Clusters | Red Hat OpenShift Cluster Manager';
    const {
      getCloudProviders, cloudProviders, organization, getOrganizationAndQuota, setListFlag,
    } = this.props;

    scrollToTop();

    const planIDFilter = getQueryParam('plan_id') || '';

    if (!isEmpty(planIDFilter)) {
      setListFlag('subscriptionFilter', {
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
      viewOptions, valid, pending,
    } = this.props;
    if ((!valid && !pending)
        || viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ loadingChangedView: true });
      this.refresh();
    }
    if (prevProps.pending && !pending) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ loadingChangedView: false });
    }
  }

  componentWillUnmount() {
    const { closeModal } = this.props;
    closeModal();
  }

  refresh = () => {
    const { fetchClusters, viewOptions } = this.props;
    fetchClusters(createViewQueryObject(viewOptions));
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
      errorMessage,
      organization,
      operationID,
      history,
      setClusterDetails,
      anyModalOpen,
      queryParams,
      canAllowClusterAdminList,
      canSubscribeOCPList,
    } = this.props;

    const { loadingChangedView } = this.state;

    const pageHeader = (
      <PageHeader>
        <PageHeaderTitle title="Clusters" className="page-title" />
      </PageHeader>
    );

    if (error && !size(clusters)) {
      return (
        <>
          {pageHeader}
          <PageSection>
            <EmptyState>
              <ErrorBox
                message="Error retrieving clusters"
                response={{
                  errorMessage,
                  operationID,
                }}
              />
            </EmptyState>
          </PageSection>
        </>
      );
    }

    const hasNoFilters = !queryParams.has_filters
    && helpers.nestedIsEmpty(viewOptions.flags.subscriptionFilter);

    /* isPendingNoData - we're waiting for the cluster list response,
      and we have no valid data to show. In this case we probably want to show a "Skeleton".
    */
    const isPendingNoData = (!size(clusters) && pending && (hasNoFilters || !valid))
    || (!organization.fulfilled && !organization.error);

    if (!size(clusters) && !isPendingNoData && hasNoFilters) {
      return (
        <PageSection>
          <GlobalErrorBox />
          <ClusterListEmptyState />
        </PageSection>
      );
    }

    return (
      <>
        {pageHeader}
        <PageSection>
          <Card>
            <div className="cluster-list">
              <GlobalErrorBox />
              <TableToolbar id="cluster-list-toolbar">
                <div className="toolbar-item">
                  <ClusterListFilter
                    isDisabled={isPendingNoData}
                    view={viewConstants.CLUSTERS_VIEW}
                  />
                </div>
                <ClusterListFilterDropdown isDisabled={pending} className="toolbar-item" history={history} />
                <Link to="/create">
                  <Button className="toolbar-item">Create cluster</Button>
                </Link>
                <ClusterListExtraActions className="toolbar-item" />
                { (pending && !isPendingNoData && !loadingChangedView) && (
                  <Spinner className="cluster-list-spinner" />
                ) }
                { error && (
                  <ErrorTriangle errorMessage={errorMessage} className="cluster-list-warning" />
                ) }
                <ViewPaginationRow
                  viewType={viewConstants.CLUSTERS_VIEW}
                  currentPage={viewOptions.currentPage}
                  pageSize={viewOptions.pageSize}
                  totalCount={viewOptions.totalCount}
                  totalPages={viewOptions.totalPages}
                  variant="top"
                  isDisabled={isPendingNoData}
                />
                <RefreshBtn
                  autoRefresh={!anyModalOpen}
                  isDisabled={isPendingNoData}
                  refreshFunc={this.refresh}
                  classOptions="cluster-list-top"
                />
              </TableToolbar>
              <ClusterListFilterChipGroup history={history} />
              <ClusterListTable
                openModal={openModal}
                clusters={clusters || []}
                viewOptions={viewOptions}
                setSorting={setSorting}
                isPending={isPendingNoData || (pending && loadingChangedView)}
                setClusterDetails={setClusterDetails}
                canAllowClusterAdminList={canAllowClusterAdminList}
                canSubscribeOCPList={canSubscribeOCPList}
              />
              <ViewPaginationRow
                viewType={viewConstants.CLUSTERS_VIEW}
                currentPage={viewOptions.currentPage}
                pageSize={viewOptions.pageSize}
                totalCount={viewOptions.totalCount}
                totalPages={viewOptions.totalPages}
                variant="bottom"
                isDisabled={isPendingNoData}
              />
              <EditDisplayNameDialog onClose={invalidateClusters} />
              <EditConsoleURLDialog onClose={invalidateClusters} />
              <EditSubscriptionSettingsDialog onClose={invalidateClusters} />
              <ScaleClusterDialog onClose={invalidateClusters} />
              <EditDisconnectedCluster onClose={invalidateClusters} />
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
      </>
    );
  }
}

ClusterList.propTypes = {
  invalidateClusters: PropTypes.func.isRequired,
  fetchClusters: PropTypes.func.isRequired,
  setClusterDetails: PropTypes.func.isRequired,
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
  getOrganizationAndQuota: PropTypes.func.isRequired,
  setListFlag: PropTypes.func.isRequired,
  operationID: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  anyModalOpen: PropTypes.bool,
  queryParams: PropTypes.shape({
    has_filters: PropTypes.bool,
  }),
  canAllowClusterAdminList: PropTypes.objectOf(PropTypes.bool),
  canSubscribeOCPList: PropTypes.objectOf(PropTypes.bool),
};

export default ClusterList;
