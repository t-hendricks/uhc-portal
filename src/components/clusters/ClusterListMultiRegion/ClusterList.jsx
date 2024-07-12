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
import size from 'lodash/size';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

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
import { SortByDirection } from '@patternfly/react-table';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';

import { ONLY_MY_CLUSTERS_TOGGLE_CLUSTERS_LIST } from '~/common/localStorageConstants';
import { AppPage } from '~/components/App/AppPage';
import { useFetchClusters } from '~/queries/ClusterListQueries/useFetchClusters';
import { CLUSTERS_VIEW } from '~/redux/constants/viewConstants';
import { isRestrictedEnv } from '~/restrictedEnv';

import helpers from '../../../common/helpers';
import { normalizedProducts } from '../../../common/subscriptionTypes';
import {
  onListFilterSet,
  onListFlagsSet,
  viewActions,
} from '../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../redux/constants';
import ErrorBox from '../../common/ErrorBox';
import Unavailable from '../../common/Unavailable';
import ClusterListFilter from '../common/ClusterListFilter';
import CommonClusterModals from '../common/CommonClusterModals';
import ErrorTriangle from '../common/ErrorTriangle';
import GlobalErrorBox from '../common/GlobalErrorBox/GlobalErrorBox';
import ReadOnlyBanner from '../common/ReadOnlyBanner';

import ClusterListActions from './components/ClusterListActions';
import ClusterListEmptyState from './components/ClusterListEmptyState';
import ClusterListFilterChipGroup from './components/ClusterListFilterChipGroup/ClusterListFilterChipGroup';
import ClusterListFilterDropdown from './components/ClusterListFilterDropdown';
import ClusterListTable from './components/ClusterListTable';
import { PaginationRow } from './components/PaginationRow';
import { RefreshButton } from './components/RefreshButton';
import ViewOnlyMyClustersToggle from './components/ViewOnlyMyClustersToggle';
import { sortClusters } from './clusterListSort';

import './ClusterList.scss';

const PAGE_TITLE = 'Clusters | Red Hat OpenShift Cluster Manager';

const ClusterListPageHeader = ({
  someReadOnly,
  showSpinner,
  error,
  errorMessage,

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
                <RefreshButton isDisabled={showSpinner} refreshFunc={refresh} />
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

  refresh: PropTypes.func,
};

const ClusterList = ({
  getCloudProviders,
  cloudProviders,
  getOrganizationAndQuota,
  organization,
  getMachineTypes,
  machineTypes,
  closeModal,
  clearGlobalError,
  openModal,
}) => {
  const dispatch = useDispatch();
  const { isLoading, data, refetch, isError, errors, isFetching } = useFetchClusters();
  const clusters = data?.items;

  const errorMessage = errors.reduce(
    (errorsText, error) =>
      `${errorsText}${error.response?.data?.reason || error.response?.data?.details || ''}. `,
    '',
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(50);
  const [itemsStart, setItemsStart] = React.useState(0);
  const [itemsEnd, setItemsEnd] = React.useState(0);

  const preLoadRedux = React.useCallback(() => {
    // Items not needed for this list, but may be needed elsewhere in the app
    // Load these items "in the background" so they can be added to redux
    // Eventually as items are converted to React Query these items can be removed
    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }

    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }

    if (!organization.fulfilled && !organization.pending) {
      getOrganizationAndQuota();
    }
  }, [
    cloudProviders.fulfilled,
    cloudProviders.pending,
    getCloudProviders,
    getMachineTypes,
    getOrganizationAndQuota,
    machineTypes.fulfilled,
    machineTypes.pending,
    organization.fulfilled,
    organization.pending,
  ]);

  /* Pagination */
  const onPageChange = React.useCallback(
    (_event, page) => {
      setCurrentPage(page);
      setItemsStart((page - 1) * pageSize + 1);
      setItemsEnd(Math.min(page * pageSize, clusters?.length || 0));
    },
    [pageSize, clusters],
  );

  React.useEffect(() => {
    if (clusters && clusters.length > 0 && currentPage === 1) {
      setItemsStart(1);
      setItemsEnd(clusters.length > pageSize ? pageSize : clusters.length);
    }
    if (!clusters || clusters.length === 0) {
      setItemsStart(0);
      setItemsEnd(0);
      setCurrentPage(1);
    }

    if (clusters && clusters.length < itemsStart) {
      // The user was on a page that no longer exists
      const newPage = Math.ceil(clusters.length / pageSize);
      onPageChange(undefined, newPage);
    }
  }, [clusters, itemsStart, currentPage, pageSize, onPageChange]);

  const onPerPageSelect = (_event, newPerPage, newPage, startIdx, endIdx) => {
    setCurrentPage(newPage);
    setPageSize(newPerPage);
    setItemsStart(startIdx + 1);
    setItemsEnd(Math.min(endIdx, clusters.length));
  };

  /* Sorting */
  const sortOptions = useSelector(
    (state) => state.viewOptions[viewConstants.CLUSTERS_VIEW]?.sorting,
  );
  const activeSortIndex = sortOptions.sortField;
  const activeSortDirection = sortOptions.isAscending ? SortByDirection.asc : SortByDirection.desc;
  // Note: initial sort order is set in the reducer
  const sortedClusters = sortClusters(clusters, activeSortIndex, activeSortDirection);

  // onMount and willUnmount
  React.useEffect(() => {
    preLoadRedux();

    if (isRestrictedEnv()) {
      dispatch(
        onListFlagsSet(
          'subscriptionFilter',
          {
            plan_id: [normalizedProducts.ROSA],
          },
          viewConstants.CLUSTERS_VIEW,
        ),
      );
    }

    // componentWillUnmount
    return () => {
      closeModal();

      clearGlobalError('clusterList');
      dispatch(onListFilterSet('', viewConstants.CLUSTERS_VIEW));
    };
    // Run only on mount and unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewOptions = useSelector((state) => state.viewOptions.CLUSTERS_VIEW);
  const { showMyClustersOnly, subscriptionFilter } = viewOptions.flags;
  const hasNoFilters =
    helpers.nestedIsEmpty(subscriptionFilter) && !showMyClustersOnly && !viewOptions.filter;

  const isPendingNoData = !size(clusters) && isLoading; // Show skeletons

  const showSpinner = isFetching || isLoading;

  // The empty state asserts as a fact that you have no clusters;
  // not appropriate when results are indeterminate or empty due to filtering.
  const showEmptyState = !showSpinner && !isError && !size(clusters) && hasNoFilters;

  const someReadOnly =
    clusters && clusters.map((c) => c?.status?.configuration_mode).includes('read_only');

  // This signals to end-to-end tests that page has completed loading.
  // For now deliberately ignoring in-place reloads with a spinner;
  // tests that modify clusters (e.g. create or scale a cluster) should wait
  // for concrete data they expect to see.
  const dataReady = !isPendingNoData;

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
        error={isError}
        errorMessage={errorMessage}
        isPendingNoData={isPendingNoData}
        refresh={refetch}
      />
      <PageSection>
        <Card>
          <div className="cluster-list" data-ready={dataReady}>
            <GlobalErrorBox />
            {isError && clusters.length > 0 && (
              <ErrorBox
                variant="warning"
                message="Some operations are unavailable, try again later"
                response={{
                  errorMessage,
                }}
                isExpandable
              />
            )}

            <Toolbar id="cluster-list-toolbar">
              <ToolbarContent>
                <ToolbarItem className="ocm-c-toolbar__item-cluster-filter-list">
                  <ClusterListFilter isDisabled={isPendingNoData} view={CLUSTERS_VIEW} />
                </ToolbarItem>
                {isRestrictedEnv() ? null : (
                  <ToolbarItem
                    className="ocm-c-toolbar__item-cluster-list-filter-dropdown"
                    data-testid="cluster-list-filter-dropdown"
                  >
                    {/* Cluster type */}
                    <ClusterListFilterDropdown
                      view={CLUSTERS_VIEW}
                      isDisabled={isLoading || isFetching}
                    />
                  </ToolbarItem>
                )}
                <ClusterListActions />
                <ViewOnlyMyClustersToggle
                  view={CLUSTERS_VIEW}
                  bodyContent="Show only the clusters you previously created, or all clusters in your organization."
                  localStorageKey={ONLY_MY_CLUSTERS_TOGGLE_CLUSTERS_LIST}
                />

                <ToolbarItem
                  align={{ default: 'alignRight' }}
                  variant="pagination"
                  className="pf-m-hidden visible-on-lgplus"
                >
                  <PaginationRow
                    currentPage={currentPage}
                    pageSize={pageSize}
                    itemCount={clusters?.length || 0}
                    variant="top"
                    isDisabled={isPendingNoData}
                    itemsStart={itemsStart}
                    itemsEnd={itemsEnd}
                    onPerPageSelect={onPerPageSelect}
                    onPageChange={onPageChange}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            {isRestrictedEnv() ? null : <ClusterListFilterChipGroup />}
            {isError && !size(clusters) ? (
              <Unavailable
                message="Error retrieving clusters"
                response={{
                  errorMessage,
                  operationID: '',
                  errorCode: '',
                  errorDetails: '',
                }}
              />
            ) : (
              <ClusterListTable
                openModal={openModal}
                clusters={sortedClusters?.slice(itemsStart - 1, itemsEnd) || []}
                isPending={isPendingNoData}
                refreshFunc={refetch}
                activeSortIndex={activeSortIndex}
                activeSortDirection={activeSortDirection}
                setSort={(index, direction) => {
                  const sorting = {
                    isAscending: direction === SortByDirection.asc,
                    sortField: index,
                  };

                  dispatch(viewActions.onListSortBy(sorting, viewConstants.CLUSTERS_VIEW));
                }}
              />
            )}
            <PaginationRow
              currentPage={currentPage}
              pageSize={pageSize}
              itemCount={clusters?.length || 0}
              variant="bottom"
              isDisabled={isPendingNoData}
              itemsStart={itemsStart}
              itemsEnd={itemsEnd}
              onPerPageSelect={onPerPageSelect}
              onPageChange={onPageChange}
            />
            <CommonClusterModals onClose={() => refetch()} clearMachinePools />
          </div>
        </Card>
      </PageSection>
    </AppPage>
  );
};

ClusterList.propTypes = {
  getCloudProviders: PropTypes.func.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  machineTypes: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,

  queryParams: PropTypes.shape({
    has_filters: PropTypes.bool,
  }),

  clearGlobalError: PropTypes.func.isRequired,
};

export default ClusterList;
