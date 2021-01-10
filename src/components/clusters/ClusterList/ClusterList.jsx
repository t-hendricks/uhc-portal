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
  Spinner, PageHeader, PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components';
import {
  Button,
  Card,
  PageSection,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
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
import Unavailable from '../../common/Unavailable';
import CommonClusterModals from '../common/CommonClusterModals';

import ViewPaginationRow from '../common/ViewPaginationRow/viewPaginationRow';

import helpers, { scrollToTop } from '../../../common/helpers';
import { productFilterOptions } from '../../../common/subscriptionTypes';

import { viewPropsChanged, createViewQueryObject, getQueryParam } from '../../../common/queryHelpers';
import { viewConstants } from '../../../redux/constants';

class ClusterList extends Component {
  state = {
    loadingChangedView: false,
  };

  componentDidMount() {
    document.title = 'Clusters | Red Hat OpenShift Cluster Manager';
    const {
      getCloudProviders, cloudProviders, setListFlag,
    } = this.props;

    scrollToTop();

    const planIDFilter = getQueryParam('plan_id') || '';

    if (!isEmpty(planIDFilter)) {
      const allowedProducts = {};
      productFilterOptions.forEach((option) => { allowedProducts[option.key] = true; });
      const sanitizedFilter = planIDFilter.split(',').filter(value => allowedProducts[value]);
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
      toggleSubscriptionReleased,
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
            <div data-ready>
              <Unavailable
                message="Error retrieving clusters"
                response={{
                  errorMessage,
                  operationID,
                  errorCode,
                  errorDetails,
                }}
              />
            </div>
          </PageSection>
        </>
      );
    }

    const hasNoFilters = !queryParams.has_filters
    && helpers.nestedIsEmpty(viewOptions.flags.subscriptionFilter);

    /* isPendingNoData - we're waiting for the cluster list response,
      and we have no valid data to show. In this case we probably want to show a "Skeleton".
    */
    const isPendingNoData = !size(clusters) && pending && (hasNoFilters || !valid);

    const showSpinner = !isPendingNoData && pending && !loadingChangedView;
    const showSkeleton = isPendingNoData || (pending && loadingChangedView);

    // This signals to end-to-end tests that page has completed loading.
    // For now deliberately ignoring in-place reloads with a spinner;
    // tests that modify clusters (e.g. create or scale a cluster) should wait
    // for concrete data they expect to see.
    const dataReady = !showSkeleton;

    if (!size(clusters) && !isPendingNoData && hasNoFilters) {
      return (
        <PageSection>
          <GlobalErrorBox />
          <div data-ready>
            <ClusterListEmptyState />
          </div>
        </PageSection>
      );
    }

    return (
      <>
        {pageHeader}
        <PageSection>
          <Card>
            <div className="cluster-list" data-ready={dataReady}>
              <GlobalErrorBox />
              <Toolbar id="cluster-list-toolbar">
                <ToolbarContent>
                  <ToolbarItem>
                    <ClusterListFilter
                      isDisabled={isPendingNoData}
                      view={viewConstants.CLUSTERS_VIEW}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <ClusterListFilterDropdown
                      view={viewConstants.CLUSTERS_VIEW}
                      isDisabled={pending}
                      history={history}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Link to="/create">
                      <Button>Create cluster</Button>
                    </Link>
                  </ToolbarItem>
                  <ToolbarItem>
                    <ClusterListExtraActions />
                  </ToolbarItem>
                  <ToolbarItem>
                    { showSpinner && (
                    <Spinner className="cluster-list-spinner" />
                    ) }
                    { error && (
                    <ErrorTriangle errorMessage={errorMessage} className="cluster-list-warning" />
                    ) }
                  </ToolbarItem>
                  <ToolbarItem alignment={{ default: 'alignRight' }} variant="pagination">
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
                  <ToolbarItem>
                    <RefreshBtn
                      autoRefresh={!anyModalOpen}
                      isDisabled={isPendingNoData}
                      refreshFunc={this.refresh}
                      classOptions="cluster-list-top"
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              <ClusterListFilterChipGroup history={history} />
              <ClusterListTable
                openModal={openModal}
                clusters={clusters || []}
                viewOptions={viewOptions}
                setSorting={setSorting}
                isPending={showSkeleton}
                setClusterDetails={setClusterDetails}
                canSubscribeOCPList={canSubscribeOCPList}
                canTransferClusterOwnershipList={canTransferClusterOwnershipList}
                toggleSubscriptionReleased={toggleSubscriptionReleased}
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
              <CommonClusterModals onClose={invalidateClusters} />
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
  errorDetails: PropTypes.array,
  errorCode: PropTypes.number,
  pending: PropTypes.bool.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  setListFlag: PropTypes.func.isRequired,
  operationID: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  anyModalOpen: PropTypes.bool,
  queryParams: PropTypes.shape({
    has_filters: PropTypes.bool,
  }),
  canSubscribeOCPList: PropTypes.objectOf(PropTypes.bool),
  canTransferClusterOwnershipList: PropTypes.objectOf(PropTypes.bool),
  toggleSubscriptionReleased: PropTypes.func.isRequired,
};

export default ClusterList;
