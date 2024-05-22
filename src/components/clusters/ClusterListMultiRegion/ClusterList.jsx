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

import { Card, PageSection } from '@patternfly/react-core';
import { PageHeaderTools as PageHeaderToolsDeprecated } from '@patternfly/react-core/deprecated';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';

import { AppPage } from '~/components/App/AppPage';
import { useFetchClusters } from '~/queries/ClusterListQueries/useFetchClusters';

import ErrorBox from '../../common/ErrorBox';
import Unavailable from '../../common/Unavailable';
import CommonClusterModals from '../common/CommonClusterModals';
import ErrorTriangle from '../common/ErrorTriangle';
import GlobalErrorBox from '../common/GlobalErrorBox/GlobalErrorBox';
import ReadOnlyBanner from '../common/ReadOnlyBanner';

import ClusterListEmptyState from './components/ClusterListEmptyState';
import ClusterListTable from './components/ClusterListTable';
import { RefreshButton } from './components/RefreshButton';

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
    <PageHeader id="cluster-list-header">
      <PageHeaderTitle title="Clusters" className="page-title" />
      <PageHeaderToolsDeprecated>
        {showSpinner && <Spinner size="lg" className="cluster-list-spinner" />}
        {error && <ErrorTriangle errorMessage={errorMessage} className="cluster-list-warning" />}
      </PageHeaderToolsDeprecated>
      <RefreshButton
        isDisabled={showSpinner}
        refreshFunc={refresh}
        classOptions="cluster-list-top"
      />
    </PageHeader>
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
  const { isLoading, data, refetch, isError, errors, isFetching } = useFetchClusters();
  const clusters = data?.items;

  const errorMessage = errors.reduce(
    (errorsText, error) =>
      `${errorsText}${error.response?.data?.reason || error.response?.data?.details || ''}. `,
    '',
  );

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

  // onMount and willUnmount
  React.useEffect(() => {
    preLoadRedux();

    // componentWillUnmount
    return () => {
      closeModal();

      clearGlobalError('clusterList');
    };
    // Run only on mount and unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPendingNoData = !size(clusters) && isLoading;

  const showSpinner = isFetching || isLoading;

  // The empty state asserts as a fact that you have no clusters;
  // not appropriate when results are indeterminate or empty due to filtering.
  const showEmptyState = !isLoading && !isFetching && !isError && !size(clusters);

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
                clusters={clusters || []}
                isPending={isPendingNoData}
                refreshFunc={refetch}
              />
            )}

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
