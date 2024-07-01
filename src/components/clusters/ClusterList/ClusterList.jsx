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

import React from 'react';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import PropTypes from 'prop-types';

import {
  Card,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';

import { ONLY_MY_CLUSTERS_TOGGLE_CLUSTERS_LIST } from '~/common/localStorageConstants';
import { AppPage } from '~/components/App/AppPage';
import { usePreviousProps } from '~/hooks/usePreviousProps';
import { isRestrictedEnv } from '~/restrictedEnv';

import helpers from '../../../common/helpers';
import {
  createViewQueryObject,
  getQueryParam,
  viewPropsChanged,
} from '../../../common/queryHelpers';
import { normalizedProducts, productFilterOptions } from '../../../common/subscriptionTypes';
import { viewConstants } from '../../../redux/constants';
import { ASSISTED_INSTALLER_MERGE_LISTS_FEATURE } from '../../../redux/constants/featureConstants';
import ErrorBox from '../../common/ErrorBox';
import RefreshBtn from '../../common/RefreshButton/RefreshButton';
import Unavailable from '../../common/Unavailable';
import AccessRequestPendingAlert from '../ClusterDetails/components/AccessRequest/components/AccessRequestPendingAlert';
import ClusterListFilter from '../common/ClusterListFilter';
import CommonClusterModals from '../common/CommonClusterModals';
import ErrorTriangle from '../common/ErrorTriangle';
import GlobalErrorBox from '../common/GlobalErrorBox/GlobalErrorBox';
import ReadOnlyBanner from '../common/ReadOnlyBanner';
import ViewPaginationRow from '../common/ViewPaginationRow/viewPaginationRow';

import ClusterListActions from './components/ClusterListActions';
import ClusterListEmptyState from './components/ClusterListEmptyState';
import ClusterListFilterChipGroup from './components/ClusterListFilterChipGroup';
import ClusterListFilterDropdown from './components/ClusterListFilterDropdown';
import ClusterListTable from './components/ClusterListTable';
import ViewOnlyMyClustersToggle from './components/ViewOnlyMyClustersToggle';

import './ClusterList.scss';

const PAGE_TITLE = 'Clusters | Red Hat OpenShift Cluster Manager';

const ClusterListPageHeader = ({
  someReadOnly,
  showSpinner,
  error,
  errorMessage,
  anyModalOpen,
  isPendingNoData,
  refresh,
}) => (
  <>
    <ReadOnlyBanner someReadOnly={someReadOnly} />
    <PageSection variant={PageSectionVariants.light}>
      <Flex>
        <FlexItem grow={{ default: 'grow' }}>
          <Title headingLevel="h1">Clusters</Title>
        </FlexItem>
        <Toolbar id="cluster-list-refresh-toolbar" isFullHeight inset={{ default: 'insetNone' }}>
          <ToolbarContent>
            <ToolbarGroup
              variant="icon-button-group"
              align={{ default: 'alignRight' }}
              spacer={{ default: 'spacerNone', md: 'spacerNone' }}
              spaceItems={{ default: 'spaceItemsMd' }}
            >
              {showSpinner && (
                <ToolbarItem>
                  <Spinner size="lg" className="cluster-list-spinner" />
                </ToolbarItem>
              )}
              {error && (
                <ToolbarItem>
                  <ErrorTriangle errorMessage={errorMessage} className="cluster-list-warning" />
                </ToolbarItem>
              )}
              <ToolbarItem spacer={{ default: 'spacerNone' }}>
                <RefreshBtn
                  autoRefresh={!anyModalOpen}
                  isDisabled={isPendingNoData}
                  refreshFunc={refresh}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </Flex>
    </PageSection>
  </>
);
ClusterListPageHeader.propTypes = {
  someReadOnly: PropTypes.bool,
  showSpinner: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  anyModalOpen: PropTypes.bool,
  isPendingNoData: PropTypes.bool,
  refresh: PropTypes.func,
};

const ClusterList = ({
  getCloudProviders,
  cloudProviders,
  setListFlag,
  getOrganizationAndQuota,
  organization,
  organizationId,
  pendingOrganizationAccessRequests,
  isOrganizationAccessProtectionEnabled,
  getMachineTypes,
  machineTypes,
  onListFlagsSet,
  closeModal,
  getOrganizationPendingAccessRequests,
  resetOrganizationPendingAccessRequests,
  getOrganizationAccessProtection,
  resetOrganizationAccessProtection,
  clearGlobalError,
  clearClusterDetails,
  fetchClusters,
  viewOptions,
  username,
  error,
  errorCode,
  errorDetails,
  valid,
  pending,
  clusters,
  setSorting,
  openModal,
  invalidateClusters,
  errorMessage,
  operationID,
  setClusterDetails,
  anyModalOpen,
  queryParams,
  canSubscribeOCPList,
  canTransferClusterOwnershipList,
  canHibernateClusterList,
  toggleSubscriptionReleased,
  meta: { clustersServiceError },
  features,
  isAccessRequestEnabled,
}) => {
  const [loadingChangedView, setLoadingChangedView] = React.useState(false);

  const refresh = React.useCallback(() => {
    fetchClusters(createViewQueryObject(viewOptions, username));
    if (organizationId && isAccessRequestEnabled) {
      resetOrganizationAccessProtection();
      getOrganizationAccessProtection(organizationId);
    }
  }, [
    fetchClusters,
    resetOrganizationAccessProtection,
    getOrganizationAccessProtection,
    organizationId,
    username,
    viewOptions,
    isAccessRequestEnabled,
  ]);

  // onMount and willUnmount
  React.useEffect(() => {
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
      refresh();
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

    // componentWillUnmount
    return () => {
      closeModal();
      clearClusterDetails();
      clearGlobalError('clusterList');
      resetOrganizationPendingAccessRequests();
      resetOrganizationAccessProtection();
    };
    // Run only on mount and unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (organizationId && isAccessRequestEnabled) {
      getOrganizationAccessProtection(organizationId);
    }
  }, [getOrganizationAccessProtection, organizationId, isAccessRequestEnabled]);

  React.useEffect(() => {
    if (isOrganizationAccessProtectionEnabled && organizationId) {
      getOrganizationPendingAccessRequests(organizationId);
    }
  }, [getOrganizationPendingAccessRequests, isOrganizationAccessProtectionEnabled, organizationId]);

  const prevFeatures = usePreviousProps(features);
  const prevViewOptions = usePreviousProps(viewOptions) || viewOptions;
  const prevPending = usePreviousProps(pending);

  React.useEffect(() => {
    const isFeatureChange =
      prevFeatures &&
      features[ASSISTED_INSTALLER_MERGE_LISTS_FEATURE] !==
        prevFeatures[ASSISTED_INSTALLER_MERGE_LISTS_FEATURE];
    if ((!valid && !pending) || isFeatureChange || viewPropsChanged(viewOptions, prevViewOptions)) {
      setLoadingChangedView(true);
      refresh();
    }
  }, [features, pending, prevFeatures, prevViewOptions, refresh, valid, viewOptions]);

  React.useEffect(() => {
    if (prevPending && !pending) {
      setLoadingChangedView(false);
    }
  }, [pending, prevPending]);

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
      <ClusterListPageHeader
        someReadOnly={someReadOnly}
        showSpinner={showSpinner}
        error={error}
        errorMessage={errorMessage}
        anyModalOpen={anyModalOpen}
        isPendingNoData={isPendingNoData}
        refresh={refresh}
      />
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
                    />
                  </ToolbarItem>
                )}
                <ClusterListActions />
                <ViewOnlyMyClustersToggle
                  view={viewConstants.CLUSTERS_VIEW}
                  bodyContent="Show only the clusters you previously created, or all clusters in your organization."
                  localStorageKey={ONLY_MY_CLUSTERS_TOGGLE_CLUSTERS_LIST}
                />
                <ToolbarItem
                  align={{ default: 'alignRight' }}
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
              <ClusterListFilterChipGroup view={viewConstants.CLUSTERS_VIEW} />
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
              <>
                <AccessRequestPendingAlert
                  total={pendingOrganizationAccessRequests.total}
                  accessRequests={pendingOrganizationAccessRequests.items}
                />
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
                  refreshFunc={refresh}
                />
              </>
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
            <CommonClusterModals onClose={invalidateClusters} clearMachinePools />
          </div>
        </Card>
      </PageSection>
    </AppPage>
  );
};

ClusterList.propTypes = {
  username: PropTypes.string.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
  fetchClusters: PropTypes.func.isRequired,
  setClusterDetails: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  clusters: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
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
  organizationId: PropTypes.string,
  pendingOrganizationAccessRequests: PropTypes.object.isRequired,
  isOrganizationAccessProtectionEnabled: PropTypes.object.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  machineTypes: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  getOrganizationPendingAccessRequests: PropTypes.func.isRequired,
  resetOrganizationPendingAccessRequests: PropTypes.func.isRequired,
  getOrganizationAccessProtection: PropTypes.func.isRequired,
  resetOrganizationAccessProtection: PropTypes.func.isRequired,
  setListFlag: PropTypes.func.isRequired,
  operationID: PropTypes.string,
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
  isAccessRequestEnabled: PropTypes.bool,
};

export default ClusterList;
