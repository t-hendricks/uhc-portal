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

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import {
  Card,
  PageHeaderTools,
  PageSection,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
} from '@patternfly/react-core';
import { AppPage } from '~/components/App/AppPage';
import { isRestrictedEnv } from '~/restrictedEnv';

import ReadOnlyBanner from '../common/ReadOnlyBanner';
import ClusterListFilter from '../common/ClusterListFilter';
import ClusterListActions from './components/ClusterListActions';
import ClusterListFilterDropdown from './components/ClusterListFilterDropdown';
import ClusterListFilterChipGroup from './components/ClusterListFilterChipGroup';
import ViewOnlyMyClustersToggle from './components/ViewOnlyMyClustersToggle';

import ClusterListEmptyState from './components/ClusterListEmptyState';
import ClusterListTable from './components/ClusterListTable';
import RefreshBtn from '../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../common/ErrorTriangle';
import ErrorBox from '../../common/ErrorBox';
import GlobalErrorBox from '../common/GlobalErrorBox';
import Unavailable from '../../common/Unavailable';
import CommonClusterModals from '../common/CommonClusterModals';

import ViewPaginationRow from '../common/ViewPaginationRow/viewPaginationRow';

import helpers from '../../../common/helpers';
import { normalizedProducts, productFilterOptions } from '../../../common/subscriptionTypes';

import {
  viewPropsChanged,
  createViewQueryObject,
  getQueryParam,
} from '../../../common/queryHelpers';
import { viewConstants } from '../../../redux/constants';
import { ASSISTED_INSTALLER_MERGE_LISTS_FEATURE } from '../../../redux/constants/featureConstants';

import './ClusterList.scss';

const PAGE_TITLE = 'Clusters | Red Hat OpenShift Cluster Manager';

class ClusterList extends Component {
  state = {
    loadingChangedView: false,
  };

  componentDidMount() {
    const {
      getCloudProviders,
      cloudProviders,
      setListFlag,
      getOrganizationAndQuota,
      organization,
      getMachineTypes,
      machineTypes,
      onListFlagsSet,
    } = this.props;

    if (isRestrictedEnv()) {
      onListFlagsSet(
        'subscriptionFilter',
        {
          plan_id: [normalizedProducts.ROSA],
        },
        viewConstants.CLUSTERS_VIEW,
      );
    }
    const planIDFilter = getQueryParam('plan_id') || '';

    if (!isEmpty(planIDFilter)) {
      const allowedProducts = {};
      productFilterOptions.forEach((option) => {
        allowedProducts[option.key] = true;
      });
      const sanitizedFilter = planIDFilter.split(',').filter((value) => allowedProducts[value]);
      setListFlag('subscriptionFilter', {
        plan_id: sanitizedFilter,
      });
    } else {
      // only call refresh if we're not setting the filter flag. When the flag is set, refresh
      // will be called via componentDidUpdate() after the redux state transition
      this.refresh();
    }

    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }

    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }

    if (!organization.fulfilled && !organization.pending) {
      getOrganizationAndQuota();
    }
  }

  componentDidUpdate(prevProps) {
    // Check for changes resulting in a fetch
    const { viewOptions, valid, pending, features } = this.props;
    // List only selected features here to avoid request-flooding.
    const isFeatureChange =
      features[ASSISTED_INSTALLER_MERGE_LISTS_FEATURE] !==
      prevProps.features[ASSISTED_INSTALLER_MERGE_LISTS_FEATURE];

    if (
      (!valid && !pending) ||
      isFeatureChange ||
      viewPropsChanged(viewOptions, prevProps.viewOptions)
    ) {
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
    const { closeModal, clearGlobalError, clearClusterDetails } = this.props;
    closeModal();
    clearClusterDetails();
    clearGlobalError('clusterList');
  }

  refresh = () => {
    const { fetchClusters, viewOptions, username } = this.props;
    fetchClusters(createViewQueryObject(viewOptions, username));
  };

  render() {
    const {
      error,
      errorCode,
      errorDetails,
      valid,
      pending,
      clusters,
      viewOptions,
      setSorting,
      openModal,
      invalidateClusters,
      errorMessage,
      operationID,
      history,
      setClusterDetails,
      anyModalOpen,
      queryParams,
      canSubscribeOCPList,
      canTransferClusterOwnershipList,
      canHibernateClusterList,
      toggleSubscriptionReleased,
      meta: { clustersServiceError },
    } = this.props;

    const { loadingChangedView } = this.state;

    const { showMyClustersOnly, subscriptionFilter } = viewOptions.flags;
    const hasNoFilters = !queryParams.has_filters && helpers.nestedIsEmpty(subscriptionFilter);

    /* isPendingNoData - we're waiting for the cluster list response,
      and we have no valid data to show. In this case we probably want to show a "Skeleton".
    */
    const isPendingNoData = !size(clusters) && pending && (hasNoFilters || !valid);

    const showSpinner = !isPendingNoData && pending && !loadingChangedView;
    const showSkeleton = isPendingNoData || (pending && loadingChangedView);
    // The empty state asserts as a fact that you have no clusters;
    // not appropriate when results are indeterminate or empty due to filtering.
    const showEmptyState =
      !isPendingNoData && !error && !size(clusters) && hasNoFilters && !showMyClustersOnly;

    const someReadOnly = clusters.map((c) => c?.status?.configuration_mode).includes('read_only');

    const pageHeader = (
      <>
        <ReadOnlyBanner someReadOnly={someReadOnly} />
        <PageHeader id="cluster-list-header">
          <PageHeaderTitle title="Clusters" className="page-title" />
          <PageHeaderTools>
            {showSpinner && <Spinner size="lg" className="cluster-list-spinner" />}
            {error && (
              <ErrorTriangle errorMessage={errorMessage} className="cluster-list-warning" />
            )}
          </PageHeaderTools>
          <RefreshBtn
            autoRefresh={!anyModalOpen}
            isDisabled={isPendingNoData}
            refreshFunc={this.refresh}
            classOptions="cluster-list-top"
          />
        </PageHeader>
      </>
    );

    // This signals to end-to-end tests that page has completed loading.
    // For now deliberately ignoring in-place reloads with a spinner;
    // tests that modify clusters (e.g. create or scale a cluster) should wait
    // for concrete data they expect to see.
    const dataReady = !showSkeleton;

    if (showEmptyState) {
      return (
        <AppPage title={PAGE_TITLE}>
          <PageSection>
            <GlobalErrorBox />
            <div data-ready>
              <ClusterListEmptyState />
            </div>
          </PageSection>
        </AppPage>
      );
    }

    return (
      <AppPage title={PAGE_TITLE}>
        {pageHeader}
        <PageSection>
          <Card>
            <div className="cluster-list" data-ready={dataReady}>
              <GlobalErrorBox />
              {clustersServiceError && (
                <ErrorBox
                  variant="warning"
                  message="Some operations are unavailable, try again later"
                  response={clustersServiceError}
                  isExpandable
                />
              )}
              <Toolbar id="cluster-list-toolbar">
                <ToolbarContent>
                  <ToolbarItem className="ocm-c-toolbar__item-cluster-filter-list">
                    <ClusterListFilter
                      isDisabled={isPendingNoData}
                      view={viewConstants.CLUSTERS_VIEW}
                    />
                  </ToolbarItem>
                  {!isRestrictedEnv() && (
                    <ToolbarItem
                      className="ocm-c-toolbar__item-cluster-list-filter-dropdown"
                      data-testid="cluster-list-filter-dropdown"
                    >
                      <ClusterListFilterDropdown
                        view={viewConstants.CLUSTERS_VIEW}
                        isDisabled={pending}
                        history={history}
                        className="cluster-filter-dropdown"
                      />
                    </ToolbarItem>
                  )}
                  <ClusterListActions />
                  <ViewOnlyMyClustersToggle
                    view={viewConstants.CLUSTERS_VIEW}
                    bodyContent="Show only the clusters you previously created, or all clusters in your organization."
                  />
                  <ToolbarItem
                    alignment={{ default: 'alignRight' }}
                    variant="pagination"
                    className="pf-m-hidden visible-on-lgplus"
                  >
                    <ViewPaginationRow
                      viewType={viewConstants.CLUSTERS_VIEW}
                      currentPage={viewOptions.currentPage}
                      pageSize={viewOptions.pageSize}
                      totalCount={viewOptions.totalCount}
                      totalPages={viewOptions.totalPages}
                      variant="top"
                      isDisabled={isPendingNoData}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              {!isRestrictedEnv() && (
                <ClusterListFilterChipGroup view={viewConstants.CLUSTERS_VIEW} history={history} />
              )}
              {error && !size(clusters) ? (
                <Unavailable
                  message="Error retrieving clusters"
                  response={{
                    errorMessage,
                    operationID,
                    errorCode,
                    errorDetails,
                  }}
                />
              ) : (
                <ClusterListTable
                  openModal={openModal}
                  clusters={clusters || []}
                  viewOptions={viewOptions}
                  setSorting={setSorting}
                  isPending={showSkeleton}
                  setClusterDetails={setClusterDetails}
                  canSubscribeOCPList={canSubscribeOCPList}
                  canHibernateClusterList={canHibernateClusterList}
                  canTransferClusterOwnershipList={canTransferClusterOwnershipList}
                  toggleSubscriptionReleased={toggleSubscriptionReleased}
                  refreshFunc={this.refresh}
                />
              )}
              <ViewPaginationRow
                viewType={viewConstants.CLUSTERS_VIEW}
                currentPage={viewOptions.currentPage}
                pageSize={viewOptions.pageSize}
                totalCount={viewOptions.totalCount}
                totalPages={viewOptions.totalPages}
                variant="bottom"
                isDisabled={isPendingNoData}
              />
              <CommonClusterModals onClose={invalidateClusters} />
            </div>
          </Card>
        </PageSection>
      </AppPage>
    );
  }
}

ClusterList.propTypes = {
  username: PropTypes.string.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
  fetchClusters: PropTypes.func.isRequired,
  setClusterDetails: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  clusters: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element])
    .isRequired,
  meta: PropTypes.shape({
    clustersServiceError: PropTypes.shape({
      errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element])
        .isRequired,
      errorDetails: PropTypes.array,
      errorCode: PropTypes.number,
    }),
  }).isRequired,
  errorDetails: PropTypes.array,
  errorCode: PropTypes.number,
  pending: PropTypes.bool.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  machineTypes: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  setListFlag: PropTypes.func.isRequired,
  operationID: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  anyModalOpen: PropTypes.bool,
  features: PropTypes.object.isRequired,
  queryParams: PropTypes.shape({
    has_filters: PropTypes.bool,
  }),
  canHibernateClusterList: PropTypes.objectOf(PropTypes.bool),
  canSubscribeOCPList: PropTypes.objectOf(PropTypes.bool),
  canTransferClusterOwnershipList: PropTypes.objectOf(PropTypes.bool),
  toggleSubscriptionReleased: PropTypes.func.isRequired,
  clearGlobalError: PropTypes.func.isRequired,
  clearClusterDetails: PropTypes.func.isRequired,
  onListFlagsSet: PropTypes.func.isRequired,
};

export default ClusterList;
