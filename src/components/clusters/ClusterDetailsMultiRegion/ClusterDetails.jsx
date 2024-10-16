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
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import * as OCM from '@openshift-assisted/ui-lib/ocm';
import { PageSection, TabContent, Tooltip } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import { Navigate, useNavigate } from '~/common/routing';
import { AppPage } from '~/components/App/AppPage';
import { modalActions } from '~/components/common/Modal/ModalActions';
import { featureGateSelector, useFeatureGate } from '~/hooks/useFeatureGate';
import { useAddNotificationContact } from '~/queries/ClusterDetailsQueries/ClusterSupportTab/useAddNotificationContact';
import {
  invalidateClusterDetailsQueries,
  useFetchClusterDetails,
} from '~/queries/ClusterDetailsQueries/useFetchClusterDetails';
import {
  refetchClusterIdentityProviders,
  useFetchClusterIdentityProviders,
} from '~/queries/ClusterDetailsQueries/useFetchClusterIdentityProviders';
import { refetchClusterLogsQueries } from '~/queries/ClusterLogsQueries/useFetchClusterLogs';
import {
  invalidateCloudProviders,
  useFetchCloudProviders,
} from '~/queries/common/useFetchCloudProviders';
import {
  accessProtectionActions,
  getAccessProtection,
} from '~/redux/actions/accessProtectionActions';
import {
  accessRequestActions,
  getAccessRequests,
  getPendingAccessRequests,
} from '~/redux/actions/accessRequestActions';
import { clearListVpcs } from '~/redux/actions/ccsInquiriesActions';
import { clusterAutoscalerActions } from '~/redux/actions/clusterAutoscalerActions';
import { onClearFiltersAndFlags } from '~/redux/actions/viewOptionsActions';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { isRestrictedEnv } from '~/restrictedEnv';
// TODO: Commented out for respective tabs stories
// import UpgradeSettingsTab from '../ClusterDetailsMultiRegion/components/UpgradeSettings';
import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

// TODO: Commented out for respective tabs stories
// import UpgradeSettingsTab from '../ClusterDetailsMultiRegion/components/UpgradeSettings';
import getClusterName from '../../../common/getClusterName';
import { isValid, shouldRefetchQuota } from '../../../common/helpers';
import {
  isAssistedInstallCluster,
  isUninstalledAICluster,
} from '../../../common/isAssistedInstallerCluster';
import { hasCapability, subscriptionCapabilities } from '../../../common/subscriptionCapabilities';
import { knownProducts } from '../../../common/subscriptionTypes';
import { userActions } from '../../../redux/actions';
import { getUserAccess } from '../../../redux/actions/costActions';
import { clearGlobalError, setGlobalError } from '../../../redux/actions/globalErrorActions';
import { getNotificationContacts } from '../../../redux/actions/supportActions';
import { fetchUpgradeGates } from '../../../redux/actions/upgradeGateActions';
import { viewConstants } from '../../../redux/constants';
import {
  MULTIREGION_PREVIEW_ENABLED,
  NETWORK_VALIDATOR_ONDEMAND_FEATURE,
} from '../../../redux/constants/featureConstants';
import ErrorBoundary from '../../App/ErrorBoundary';
import Unavailable from '../../common/Unavailable';
// import Monitoring from '../ClusterDetailsMultiRegion/components/Monitoring';
// import MachinePools from '../ClusterDetailsMultiRegion/components/MachinePools';
// import AddOns from '../ClusterDetailsMultiRegion/components/AddOns';
// import ClusterLogs from './components/ClusterLogs/ClusterLogs';
import clusterStates, {
  canViewMachinePoolTab,
  isHibernating,
  isHypershiftCluster,
} from '../common/clusterStates';
import CommonClusterModals from '../common/CommonClusterModals';
import { canSubscribeOCPMultiRegion } from '../common/EditSubscriptionSettingsDialog/canSubscribeOCPSelector';
import { userCanHibernateClustersSelector } from '../common/HibernateClusterModal/HibernateClusterModalSelectors';
import ReadOnlyBanner from '../common/ReadOnlyBanner';
import { canTransferClusterOwnershipMultiRegion } from '../common/TransferClusterOwnershipDialog/utils/transferClusterOwnershipDialogSelectors';
import { getSchedules } from '../common/Upgrades/clusterUpgradeActions';
import CancelUpgradeModal from '../commonMultiRegion/Upgrades/CancelUpgradeModal';

import AccessControl from './components/AccessControl/AccessControl';
import { getGrants } from './components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceActions';
import usersActions from './components/AccessControl/UsersSection/UsersActions';
import AddOns from './components/AddOns';
import { getAddOns, getClusterAddOns } from './components/AddOns/AddOnsActions';
import ClusterDetailsTop from './components/ClusterDetailsTop/ClusterDetailsTop';
import ClusterLogs from './components/ClusterLogs/ClusterLogs';
import { ClusterTabsId } from './components/common/ClusterTabIds';
import DeleteIDPDialog from './components/DeleteIDPDialog';
import { fetchClusterInsights } from './components/Insights/InsightsActions';
import MachinePools from './components/MachinePools';
import {
  clearGetMachinePoolsResponse,
  getMachineOrNodePools,
} from './components/MachinePools/MachinePoolsActions';
import Monitoring from './components/Monitoring';
import { getOnDemandMetrics } from './components/Monitoring/MonitoringActions';
import { issuesAndWarningsSelector } from './components/Monitoring/MonitoringSelectors';
import Networking from './components/Networking';
import { getClusterRouters } from './components/Networking/NetworkingActions';
import Overview from './components/Overview/Overview';
import Support from './components/Support';
import AddNotificationContactDialog from './components/Support/components/AddNotificationContactDialog';
import TabsRow from './components/TabsRow/TabsRow';
// TODO: Commented out for respective tabs stories
import UpgradeSettingsTab from './components/UpgradeSettings';
import { eventTypes } from './clusterDetailsHelper';

const { HostsClusterDetailTab, getAddHostsTabState } = OCM;

const PAGE_TITLE = 'Red Hat OpenShift Cluster Manager';

const ClusterDetails = (props) => {
  const location = useLocation();
  const { toggleSubscriptionReleased } = props;
  const [gcpOrgPolicyWarning, setGcpOrgPolicyWarning] = React.useState('');
  const monitoring = useGlobalState((state) => state.monitoring);

  const isMultiRegionPreviewEnabled = useFeatureGate(MULTIREGION_PREVIEW_ENABLED);

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const subscriptionID = params.id;

  const {
    isLoading: isClusterDetailsLoading,
    cluster,
    isError,
    error,
    isFetching,
  } = useFetchClusterDetails(subscriptionID);

  const {
    isLoading: isClusterIdentityProvidersLoading,
    clusterIdentityProviders,
    isError: clusterIdentityProvidersError,
  } = useFetchClusterIdentityProviders(cluster?.id, cluster?.subscription?.xcm_id);

  const {
    isLoading: isCloudProvidersLoading,
    data: cloudProviders,
    isError: cloudProvidersError,
  } = useFetchCloudProviders();

  const {
    mutate: addNotificationMutation,
    isSuccess: isAddNotificationContactSuccess,
    isPending: isAddNotificationContactPending,
    error: addNotificationContactError,
    status: addNotificationStatus,
  } = useAddNotificationContact(subscriptionID);

  const externalClusterID = get(cluster, 'external_id');

  // Recreation of function, no cluster in the redux.
  const canSubscribeOCP = canSubscribeOCPMultiRegion(cluster);
  const canTransferClusterOwnership = canTransferClusterOwnershipMultiRegion(cluster);
  const hasIssues = issuesAndWarningsSelector(monitoring, cluster).issues.totalCount > 0;
  const { organization } = useSelector((state) => state.userProfile);
  const { insightsData } = useSelector((state) => state.insightsData);
  const {
    notificationContacts = {
      pending: false,
    },
  } = useSelector((state) => state.clusterSupport);
  const { clusterRouters } = useSelector((state) => state.clusterRouters);
  // TODO: Part of tabs stories
  // eslint-disable-next-line no-unused-vars
  const displayClusterLogs = cluster && (!!cluster.external_id || !!cluster.id);
  const accessRequestsViewOptions = useSelector(
    (state) => state.viewOptions[viewConstants.ACCESS_REQUESTS_VIEW],
  );
  const canHibernateCluster = useSelector((state) => userCanHibernateClustersSelector(state));
  const anyModalOpen = useSelector((state) => !!state.modal.modalName);
  const userAccess = useSelector((state) => state.cost.userAccess);
  const gotRouters = get(clusterRouters, 'getRouters.routers.length', 0) > 0;
  const hasNetworkOndemand = useSelector((state) =>
    featureGateSelector(state, NETWORK_VALIDATOR_ONDEMAND_FEATURE),
  );

  const initTabOpen = location.hash.replace('#', '');
  const [selectedTab, setSelectedTab] = React.useState('');
  // TODO: Part of the Tabs stories
  // eslint-disable-next-line no-unused-vars
  const [refreshEvent, setRefreshEvent] = React.useState({ type: eventTypes.NONE });
  const pendingAccessRequests = useSelector((state) => state.accessRequest.pendingAccessRequests);
  const accessProtectionState = useSelector((state) => state.accessProtection.accessProtection);

  const accessRequestsTabVisible = React.useMemo(
    () => accessProtectionState.enabled,
    [accessProtectionState.enabled],
  );

  const isSubscriptionSettingsRequestPending = useSelector((state) =>
    get(state, 'subscriptionSettings.requestState.pending', false),
  );

  const overviewTabRef = React.useRef();
  const monitoringTabRef = React.useRef();
  const accessControlTabRef = React.useRef();
  const addOnsTabRef = React.useRef();
  const clusterHistoryTabRef = React.useRef();
  const networkingTabRef = React.useRef();
  const supportTabRef = React.useRef();
  const machinePoolsTabRef = React.useRef();
  const upgradeSettingsTabRef = React.useRef();
  const addAssistedTabRef = React.useRef();
  const accessRequestsTabRef = React.useRef();

  // PrevProps replication using refs
  const prevClusterId = React.useRef(cluster?.id);

  const clearFiltersAndFlags = () => {
    dispatch(onClearFiltersAndFlags(viewConstants.CLUSTER_LOGS_VIEW));
  };
  const onDialogClose = () => {
    if (isValid(subscriptionID)) {
      invalidateClusterDetailsQueries();
    }
  };

  const fetchSupportData = () => {
    const subscriptionID = cluster?.subscription?.id;
    if (isValid(subscriptionID)) {
      if (!notificationContacts.pending) {
        dispatch(getNotificationContacts(subscriptionID));
      }
    }
  };

  const refreshIDP = () => {
    const clusterID = cluster?.id;
    if (
      isValid(clusterID) &&
      !isClusterIdentityProvidersLoading &&
      !clusterIdentityProvidersError
    ) {
      refetchClusterIdentityProviders(clusterID);
    }
  };

  /**
   * Refresh the cluster's related resources.
   * Has to be refactored during tabs update for Data Sovereignty
   */
  const refreshRelatedResources = (clicked) => {
    /* TODO everything here has to be moved to the individual tabs that require this info
      ideally cluster details should dispatch an event on refresh,
      and leave sub-resource handling for sub-components.
  
      https://issues.redhat.com/browse/SDA-2249
      */
    const clusterID = get(cluster, 'id');
    const clusterVersion = cluster?.version?.id;
    const isManaged = get(cluster, 'managed', false);
    if (shouldRefetchQuota(organization)) {
      dispatch(userActions.getOrganizationAndQuota());
    }
    if (externalClusterID) {
      dispatch(fetchClusterInsights(externalClusterID));
      fetchSupportData();
    }
    if (externalClusterID || clusterID) {
      refetchClusterLogsQueries();
    }

    if (subscriptionID && !isRestrictedEnv()) {
      dispatch(getAccessProtection(subscriptionID));
    }

    if (isManaged) {
      // All managed-cluster-specific requests
      dispatch(getAddOns(clusterID)); // Needs query
      dispatch(getClusterAddOns(clusterID)); // Needs query
      dispatch(usersActions.getUsers(clusterID)); // TODO needs double check
      dispatch(getClusterRouters(clusterID)); // Needs query
      refreshIDP();
      dispatch(getMachineOrNodePools(clusterID, isHypershiftCluster(cluster), clusterVersion)); // Needs query
      dispatch(getSchedules(clusterID, isHypershiftCluster(cluster))); // Needs query
      dispatch(fetchUpgradeGates()); // Needs query
      if (get(cluster, 'cloud_provider.id') !== 'gcp') {
        // don't fetch grants if cloud provider is known to be gcp

        dispatch(getGrants(clusterID)); // Needs query
      }
    } else {
      const subscriptionID = cluster?.subscription?.id;

      dispatch(getOnDemandMetrics(subscriptionID));
    }
    setRefreshEvent({ type: clicked || eventTypes.AUTO });
  };

  const refresh = (clicked) => {
    if (isValid(subscriptionID)) {
      invalidateClusterDetailsQueries();
    }
    const clusterID = get(cluster, 'id');
    const subscriptionStatus = get(cluster, 'subscription.status');
    if (
      isValid(clusterID) &&
      subscriptionStatus !== SubscriptionCommonFields.status.DEPROVISIONED
    ) {
      refreshRelatedResources(clicked);
    }
  };

  React.useEffect(() => {
    dispatch(clearGlobalError('clusterDetails'));
    refresh();
    if (!isCloudProvidersLoading && !cloudProvidersError && !cloudProviders) {
      invalidateCloudProviders();
    }
    dispatch(getUserAccess({ type: 'OCP' }));

    return () => {
      refetchClusterIdentityProviders();
      dispatch(modalActions.closeModal());
      refetchClusterLogsQueries();

      dispatch(accessRequestActions.resetAccessRequests());
      dispatch(accessProtectionActions.resetAccessProtection());

      dispatch(clearGetMachinePoolsResponse());
      dispatch(clusterAutoscalerActions.clearClusterAutoscalerResponse());
      clearFiltersAndFlags();
      dispatch(clearListVpcs());
    };
    // Should run only once on mount and once on unmount
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const subscriptionID = params.id;
    if (get(cluster, 'subscription.id') === subscriptionID) {
      const clusterName = getClusterName(cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (!prevClusterId.current && !isClusterDetailsLoading && cluster && cluster?.id) {
      refreshRelatedResources();
      prevClusterId.current = cluster?.id;
    }
    // Eslint issue with dependency on refreshRelatedResources
    // has to be wrapped in useCallback
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [params, cluster, subscriptionID]);

  React.useEffect(() => {
    if (
      !accessProtectionState.pending &&
      accessProtectionState.enabled &&
      subscriptionID &&
      accessRequestsViewOptions
    ) {
      dispatch(getAccessRequests(subscriptionID, accessRequestsViewOptions));
      dispatch(getPendingAccessRequests(subscriptionID));
    }
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [accessProtectionState.pending, accessProtectionState.enabled, subscriptionID]);

  const requestedSubscriptionID = params.id;

  // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
  // the redux state will have the data for the previous cluster. We want to ensure we only
  // show data for the requested cluster, so different data should be marked as pending.
  // Probbbably no longer needed with React Query
  // TODO: errorState spinner
  const isPending = get(cluster, 'subscription.id') !== requestedSubscriptionID;

  const errorState = () => (
    <AppPage title={PAGE_TITLE}>
      <Unavailable message="Error retrieving cluster details" response={error} />
      {isPending && <Spinner />}
    </AppPage>
  );

  // organization.details is required by canCreateGCPNonCCSCluster below
  // and must be loaded so the Networking tab displays properly
  if (isClusterDetailsLoading || (!organization.fulfilled && !error && !isError)) {
    return (
      <AppPage title={PAGE_TITLE}>
        <div id="clusterdetails-content">
          <div className="cluster-loading-container">
            <Spinner centered />
          </div>
        </div>
      </AppPage>
    );
  }

  // show a full error state only if we don't have data at all,
  // or when we only have data for a different cluster
  if (isError && (!cluster || get(cluster, 'subscription.id') !== requestedSubscriptionID)) {
    if (error?.errorCode === 404 || error?.errorCode === 403) {
      dispatch(accessRequestActions.resetAccessRequest());
      dispatch(accessProtectionActions.resetAccessProtection());
      dispatch(
        setGlobalError(
          <>
            Cluster with subscription ID <b>{requestedSubscriptionID}</b> was not found, it might
            have been deleted or you don&apos;t have permission to see it.
          </>,
          'clusterDetails',
          `${error?.errorMessage}`,
        ),
      );
      return <Navigate to="/cluster-list" />;
    }
    return errorState();
  }

  const onTabSelected = (tabId) => {
    setSelectedTab(tabId);
  };

  const clusterHibernating = isHibernating(cluster);
  const isArchived =
    get(cluster, 'subscription.status', false) === SubscriptionCommonFields.status.ARCHIVED ||
    get(cluster, 'subscription.status', false) === SubscriptionCommonFields.status.DEPROVISIONED;
  const isAROCluster = get(cluster, 'subscription.plan.type', '') === knownProducts.ARO;
  const isOSDTrial = get(cluster, 'subscription.plan.type', '') === knownProducts.OSDTRIAL;
  const isRHOIC = get(cluster, 'subscription.plan.type', '') === knownProducts.RHOIC;

  // TODO: Part of tabs stories
  // eslint-disable-next-line no-unused-vars
  const isManaged = cluster.managed;
  const isHypershift = isHypershiftCluster(cluster);
  const isClusterWaiting = cluster.state === clusterStates.WAITING;
  const isClusterPending = cluster.state === clusterStates.PENDING;
  const isClusterInstalling = cluster.state === clusterStates.INSTALLING;
  const isClusterReady = cluster.state === clusterStates.READY;
  const isClusterUpdating = cluster.state === clusterStates.UPDATING;
  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  // TODO: Part of tabs stories
  // eslint-disable-next-line no-unused-vars
  const canCreateGCPNonCCSCluster = hasCapability(
    organization.details,
    subscriptionCapabilities.CREATE_GCP_NON_CCS_CLUSTER,
  );
  const displayAddOnsTab =
    !isClusterInstalling &&
    !isClusterPending &&
    !isClusterWaiting &&
    cluster.managed &&
    !isArchived &&
    !isRestrictedEnv();

  const displayMonitoringTab =
    !isArchived &&
    !cluster.managed &&
    !isAROCluster &&
    !isRHOIC &&
    !isUninstalledAICluster(cluster) &&
    !isRestrictedEnv();
  const displayAccessControlTab = !isArchived;
  const cloudProvider = get(cluster, 'cloud_provider.id');
  const displayNetworkingTab =
    (isClusterReady || isClusterUpdating || clusterHibernating) &&
    cluster.managed &&
    !!get(cluster, 'api.url') &&
    (cloudProvider === 'aws' ||
      (cloudProvider === 'gcp' && (get(cluster, 'ccs.enabled') || gotRouters))) &&
    !isArchived;
  const hideSupportTab = isRestrictedEnv()
    ? false
    : cluster.managed &&
      // The (managed) cluster has not yet reported its cluster ID to AMS
      // eslint-disable-next-line camelcase
      cluster.subscription?.external_cluster_id === undefined;
  const displaySupportTab = !hideSupportTab && !isOSDTrial;
  const displayUpgradeSettingsTab =
    cluster.managed && !isAROCluster && cluster.canEdit && !isArchived;

  let addHostsTabState = { showTab: false, isDisabled: false, tabTooltip: '' };
  if (isAssistedInstallCluster(cluster) && !isArchived) {
    addHostsTabState = getAddHostsTabState(cluster);
  }

  const findGcpOrgPolicyWarning = (logs) => {
    let log = '';
    log = logs?.find(
      (obj) =>
        obj.summary?.includes('Please enable the Org Policy API for the GCP project') ||
        obj.summary?.includes('GCP Organization Policy Service'),
    );
    setGcpOrgPolicyWarning(log?.summary);
  };

  return (
    <AppPage title={PAGE_TITLE}>
      <ReadOnlyBanner isReadOnly={isReadOnly} />
      <PageSection id="clusterdetails-content">
        <ClusterDetailsTop
          cluster={cluster}
          isRefetching={isFetching}
          pending={isClusterDetailsLoading}
          refreshFunc={refresh}
          clickRefreshFunc={() => refresh(eventTypes.CLICKED)}
          clusterIdentityProviders={clusterIdentityProviders}
          organization={organization}
          error={isError}
          errorMessage={error?.errorObj.response.data.reason}
          canSubscribeOCP={canSubscribeOCP}
          canTransferClusterOwnership={canTransferClusterOwnership}
          canHibernateCluster={canHibernateCluster}
          autoRefreshEnabled={!anyModalOpen}
          toggleSubscriptionReleased={toggleSubscriptionReleased}
          showPreviewLabel={isHypershift}
          isClusterIdentityProvidersLoading={isClusterIdentityProvidersLoading}
          clusterIdentityProvidersError={clusterIdentityProvidersError}
          gcpOrgPolicyWarning={gcpOrgPolicyWarning}
        >
          <TabsRow
            tabsInfo={{
              overview: { ref: overviewTabRef, hasIssues: false },
              monitoring: {
                ref: monitoringTabRef,
                show: displayMonitoringTab,
                hasIssues: cluster.state !== clusterStates.INSTALLING && hasIssues,
              },
              accessControl: {
                ref: accessControlTabRef,
                show: displayAccessControlTab,
              },
              addOns: { ref: addOnsTabRef, show: displayAddOnsTab },
              clusterHistory: {
                ref: clusterHistoryTabRef,
                show: displayClusterLogs,
              },
              networking: {
                ref: networkingTabRef,
                show: displayNetworkingTab,
              },
              machinePools: {
                ref: machinePoolsTabRef,
                show: canViewMachinePoolTab(cluster),
              },
              support: {
                ref: supportTabRef,
                show: displaySupportTab,
              },
              upgradeSettings: {
                ref: upgradeSettingsTabRef,
                show: displayUpgradeSettingsTab,
              },
              addAssisted: {
                ref: addAssistedTabRef,
                show: !isMultiRegionPreviewEnabled && addHostsTabState.showTab,
                isDisabled: addHostsTabState.isDisabled,
                tooltip: addHostsTabState.tabTooltip,
              },
              accessRequest: {
                ref: accessRequestsTabRef,
                show: accessRequestsTabVisible,
                tooltip: (
                  <Tooltip
                    content={
                      pendingAccessRequests?.total > 0
                        ? `${pendingAccessRequests.total} pending requests`
                        : 'No pending requests'
                    }
                  />
                ),
                hasIssues: pendingAccessRequests?.total > 0,
                numberOfIssues: pendingAccessRequests?.total,
                isLoading: pendingAccessRequests?.pending,
              },
            }}
            initTabOpen={initTabOpen}
            onTabSelected={onTabSelected}
          />
        </ClusterDetailsTop>
        <TabContent
          eventKey={0}
          id="overviewTabContent"
          ref={overviewTabRef}
          aria-label="Overview"
          ouiaId="overviewTabContent"
        >
          <ErrorBoundary>
            <Overview
              cluster={cluster}
              region={cluster.subscription.xcm_id}
              clusterDetailsLoading={isClusterDetailsLoading}
              subscription={cluster.subscription}
              cloudProviders={cloudProviders}
              refresh={refresh}
              insightsData={insightsData[cluster.external_id]}
              hasNetworkOndemand={hasNetworkOndemand}
              userAccess={userAccess}
              canSubscribeOCP={canSubscribeOCP}
              isSubscriptionSettingsRequestPending={isSubscriptionSettingsRequestPending}
            />
          </ErrorBoundary>
        </TabContent>
        <TabContent
          eventKey={7}
          id="supportTabContent"
          ref={supportTabRef}
          aria-label="Support"
          hidden
        >
          <ErrorBoundary>
            {cluster ? (
              <Support
                isDisabled={isArchived}
                cluster={cluster}
                addNotificationStatus={addNotificationStatus}
                isAddNotificationContactSuccess={isAddNotificationContactSuccess}
                isAddNotificationContactPending={isAddNotificationContactPending}
              />
            ) : null}
          </ErrorBoundary>
        </TabContent>
        {displayMonitoringTab && (
          <TabContent
            eventKey={1}
            id="monitoringTabContent"
            ref={monitoringTabRef}
            aria-label="Monitoring"
            hidden
          >
            <ErrorBoundary>
              <Monitoring cluster={cluster} />
            </ErrorBoundary>
          </TabContent>
        )}
        {displayAccessControlTab && (
          <TabContent
            eventKey={2}
            id="accessControlTabContent"
            ref={accessControlTabRef}
            aria-label="Access Control"
            hidden
          >
            <ErrorBoundary>
              <AccessControl
                cluster={cluster}
                refreshEvent={refreshEvent}
                region={cluster.subscription.xcm_id}
              />
            </ErrorBoundary>
          </TabContent>
        )}
        {isManaged && (
          <TabContent
            eventKey={3}
            id="addOnsTabContent"
            ref={addOnsTabRef}
            aria-label="Add-ons"
            hidden
          >
            <ErrorBoundary>
              <AddOns
                clusterID={cluster.id}
                isHypershift={isHypershift}
                region={cluster.subscription.xcm_id}
                cluster={cluster}
              />
            </ErrorBoundary>
          </TabContent>
        )}
        {displayClusterLogs && (
          <TabContent
            eventKey={4}
            id="clusterHistoryTabContent"
            ref={clusterHistoryTabRef}
            aria-label="Cluster history"
            hidden
          >
            <ErrorBoundary>
              <ClusterLogs
                externalClusterID={cluster.external_id}
                clusterID={cluster.id}
                region={cluster.subscription?.xcm_id}
                createdAt={cluster.creation_timestamp}
                refreshEvent={{
                  type: refreshEvent.type,
                  reset: () => setRefreshEvent({ type: eventTypes.NONE }),
                }}
                isVisible={selectedTab === ClusterTabsId.CLUSTER_HISTORY}
                findGcpOrgPolicyWarning={
                  cloudProvider === 'gcp' ? findGcpOrgPolicyWarning : undefined
                }
              />
            </ErrorBoundary>
          </TabContent>
        )}
        {canViewMachinePoolTab(cluster) && (
          <TabContent
            eventKey={6}
            id="machinePoolsContent"
            ref={machinePoolsTabRef}
            aria-label="Machine pools"
            hidden
          >
            <ErrorBoundary>
              <MachinePools cluster={cluster} />
            </ErrorBoundary>
          </TabContent>
        )}
        {displayUpgradeSettingsTab && (
          <TabContent
            eventKey={8}
            id="upgradeSettingsContent"
            ref={upgradeSettingsTabRef}
            aria-label="Upgrade settings"
            hidden
          >
            <ErrorBoundary>
              <UpgradeSettingsTab cluster={cluster} />
            </ErrorBoundary>
          </TabContent>
        )}
        {displayNetworkingTab && (
          <TabContent
            eventKey={5}
            id="networkingTabContent"
            ref={networkingTabRef}
            aria-label="Networking"
            hidden
          >
            <ErrorBoundary>
              <Networking
                clusterID={cluster.id}
                refreshCluster={refresh}
                cluster={cluster}
                isManaged={cluster.managed}
                region={cluster.subscription.xcm_id}
              />
            </ErrorBoundary>
          </TabContent>
        )}
        {/* 
        
        <TabContent
          eventKey={7}
          id="supportTabContent"
          ref={supportTabRef}
          aria-label="Support"
          hidden
        >
          <ErrorBoundary>
            <Support isDisabled={isArchived} />
          </ErrorBoundary>
        </TabContent>
       
       
        {accessRequestsTabVisible ? (
          <TabContent
            eventKey={10}
            id="accessRequestsContent"
            ref={accessRequestsTabRef}
            aria-label="Access Requests"
            hidden
          >
            <ErrorBoundary>
              <AccessRequest subscriptionId={subscriptionID} />
            </ErrorBoundary>
          </TabContent>
        ) : null}
         */}
        {/* If the tab is shown and disabled, it will have a tooltip and no content */}
        {addHostsTabState.showTab && !addHostsTabState.isDisabled && (
          <TabContent
            eventKey={9}
            id="addHostsContent"
            ref={addAssistedTabRef}
            aria-label="Add Hosts"
            hidden
          >
            <ErrorBoundary>
              <HostsClusterDetailTab
                cluster={cluster}
                isVisible={selectedTab === ClusterTabsId.ADD_ASSISTED_HOSTS}
              />
            </ErrorBoundary>
          </TabContent>
        )}

        <CommonClusterModals
          isMultiRegionPreviewEnabled={isMultiRegionPreviewEnabled}
          onClose={onDialogClose}
          onClusterDeleted={() => {
            invalidateClusterDetailsQueries();
            navigate('/cluster-list');
          }}
        />
        <DeleteIDPDialog refreshParent={refreshIDP} />
        {cluster ? (
          <AddNotificationContactDialog
            cluster={cluster}
            addNotificationMutation={addNotificationMutation}
            isAddNotificationContactSuccess={isAddNotificationContactSuccess}
            isAddNotificationContactPending={isAddNotificationContactPending}
            addNotificationContactError={addNotificationContactError}
          />
        ) : null}
        <CancelUpgradeModal isHypershift={isHypershift} />
      </PageSection>
    </AppPage>
  );
};

ClusterDetails.propTypes = {
  toggleSubscriptionReleased: PropTypes.func.isRequired,
};

export default ClusterDetails;
