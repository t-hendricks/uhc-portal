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
import { Navigate, useNavigate, useParams } from 'react-router-dom-v5-compat';

import * as OCM from '@openshift-assisted/ui-lib/ocm';
import { PageSection, TabContent, Tooltip } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import { AppPage } from '~/components/App/AppPage';
import { isRestrictedEnv } from '~/restrictedEnv';

import getClusterName from '../../../common/getClusterName';
import { isValid, shouldRefetchQuota } from '../../../common/helpers';
import { isUninstalledAICluster } from '../../../common/isAssistedInstallerCluster';
import { hasCapability, subscriptionCapabilities } from '../../../common/subscriptionCapabilities';
import { knownProducts, subscriptionStatuses } from '../../../common/subscriptionTypes';
import { ASSISTED_INSTALLER_FEATURE } from '../../../redux/constants/featureConstants';
import ErrorBoundary from '../../App/ErrorBoundary';
import Unavailable from '../../common/Unavailable';
import withFeatureGate from '../../features/with-feature-gate';
import clusterStates, {
  canViewMachinePoolTab,
  isHibernating,
  isHypershiftCluster,
  isROSA,
} from '../common/clusterStates';
import CommonClusterModals from '../common/CommonClusterModals';
import ReadOnlyBanner from '../common/ReadOnlyBanner';
import CancelUpgradeModal from '../common/Upgrades/CancelUpgradeModal';

import AccessControl from './components/AccessControl/AccessControl';
import AddGrantModal from './components/AccessControl/NetworkSelfServiceSection/AddGrantModal';
import AccessRequest from './components/AccessRequest';
import AddOns from './components/AddOns';
import ClusterDetailsTop from './components/ClusterDetailsTop';
import ClusterLogs from './components/ClusterLogs/ClusterLogs';
import { ClusterTabsId } from './components/common/ClusterTabIds';
import DeleteIDPDialog from './components/DeleteIDPDialog';
import MachinePools from './components/MachinePools';
import Monitoring from './components/Monitoring';
import Networking from './components/Networking';
import Overview from './components/Overview/Overview';
import Support from './components/Support';
import AddNotificationContactDialog from './components/Support/components/AddNotificationContactDialog';
import TabsRow from './components/TabsRow/TabsRow';
import UpgradeSettingsTab from './components/UpgradeSettings';
import { eventTypes } from './clusterDetailsHelper';

const { HostsClusterDetailTab, getAddHostsTabState } = OCM;
const GatedAIHostsClusterDetailTab = withFeatureGate(
  HostsClusterDetailTab,
  ASSISTED_INSTALLER_FEATURE,
);
const PAGE_TITLE = 'Red Hat OpenShift Cluster Manager';

const ClusterDetails = (props) => {
  const {
    clusterDetails,
    cloudProviders,
    getCloudProviders,
    clearGlobalError,
    getUserAccess,
    resetIdentityProvidersState,
    closeModal,
    resetClusterHistory,
    resetAccessRequests,
    resetAccessRequest,
    clearGetMachinePoolsResponse,
    clearGetClusterAutoscalerResponse,
    clearFiltersAndFlags,
    clearListVpcs,
    invalidateClusters,
    getClusterIdentityProviders,
    clusterIdentityProviders,
    fetchDetails,
    getAddOns,
    getUsers,
    getOnDemandMetrics,
    getClusterAddOns,
    getOrganizationAndQuota,
    getGrants,
    accessRequestsViewOptions,
    pendingAccessRequests,
    clusterLogsViewOptions,
    getClusterHistory,
    getAccessRequests,
    getPendingAccessRequests,
    getClusterRouters,
    organization,
    getMachineOrNodePools,
    getSchedules,
    fetchClusterInsights,
    fetchUpgradeGates,
    useNodeUpgradePolicies,
    notificationContacts,
    getNotificationContacts,
    openModal,
    setGlobalError,
    displayClusterLogs,
    insightsData,
    logs,
    canSubscribeOCP,
    canTransferClusterOwnership,
    canHibernateCluster,
    anyModalOpen,
    hasIssues,
    toggleSubscriptionReleased,
    initTabOpen,
    assistedInstallerEnabled,
    userAccess,
    gotRouters,
    hasNetworkOndemand,
    isAccessRequestEnabled,
  } = props;

  const navigate = useNavigate();
  const params = useParams();
  const subscriptionID = params.id;

  const [selectedTab, setSelectedTab] = React.useState('');
  const [refreshEvent, setRefreshEvent] = React.useState({ type: eventTypes.NONE });
  const { cluster } = clusterDetails;
  const isRosa = React.useMemo(() => isROSA(cluster), [cluster]);
  const requestedSubscriptionID = params.id;

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
  const prevClusterId = React.useRef(clusterDetails.cluster?.id);

  const onDialogClose = () => {
    if (isValid(subscriptionID)) {
      fetchDetails(subscriptionID);
    }
  };

  const fetchSupportData = () => {
    const subscriptionID = clusterDetails.cluster?.subscription?.id;
    if (isValid(subscriptionID)) {
      if (!notificationContacts.pending) {
        getNotificationContacts(subscriptionID);
      }
    }
  };

  const refreshIDP = () => {
    const clusterID = clusterDetails?.cluster?.id;

    if (
      isValid(clusterID) &&
      !clusterIdentityProviders.pending &&
      !clusterIdentityProviders.error
    ) {
      getClusterIdentityProviders(clusterID);
    }
  };

  /**
   * Refresh the cluster's related resources.
   */
  const refreshRelatedResources = (clicked) => {
    /* TqwODO everything here has to be moved to the individual tabs that require this info
      ideally cluster details should dispatch an event on refresh,
      and leave sub-resource handling for sub-components.
  
      https://issues.redhat.com/browse/SDA-2249
      */

    const clusterID = get(clusterDetails, 'cluster.id');
    const clusterVersion = clusterDetails.cluster?.version?.id;
    const isManaged = get(clusterDetails, 'cluster.managed', false);

    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
    const externalClusterID = get(clusterDetails, 'cluster.external_id');
    if (externalClusterID) {
      fetchClusterInsights(externalClusterID);
      fetchSupportData();
    }

    if (externalClusterID || clusterID) {
      getClusterHistory(externalClusterID, clusterID, clusterLogsViewOptions);
    }
    if (isRosa && subscriptionID) {
      getAccessRequests(subscriptionID, accessRequestsViewOptions);
      getPendingAccessRequests(subscriptionID);
    }

    if (isManaged) {
      // All managed-cluster-specific requests
      getAddOns(clusterID);
      getClusterAddOns(clusterID);
      getUsers(clusterID);
      getClusterRouters(clusterID);
      refreshIDP();
      getMachineOrNodePools(
        clusterID,
        isHypershiftCluster(clusterDetails?.cluster),
        clusterVersion,
        useNodeUpgradePolicies,
      );

      getSchedules(clusterID, isHypershiftCluster(clusterDetails?.cluster));
      fetchUpgradeGates();

      if (get(clusterDetails, 'cluster.cloud_provider.id') !== 'gcp') {
        // don't fetch grants if cloud provider is known to be gcp
        getGrants(clusterID);
      }
    } else {
      const subscriptionID = clusterDetails.cluster?.subscription?.id;
      getOnDemandMetrics(subscriptionID);
    }

    setRefreshEvent({ type: clicked || eventTypes.AUTO });
  };

  const refresh = (clicked) => {
    if (isValid(subscriptionID)) {
      fetchDetails(subscriptionID);
    }

    const clusterID = get(cluster, 'id');
    const subscriptionStatus = get(cluster, 'subscription.status');
    if (isValid(clusterID) && subscriptionStatus !== subscriptionStatuses.DEPROVISIONED) {
      refreshRelatedResources(clicked);
    }
  };

  React.useEffect(() => {
    clearGlobalError('clusterDetails');
    refresh();
    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
    getUserAccess({ type: 'OCP' });

    return () => {
      resetIdentityProvidersState();
      closeModal();
      resetClusterHistory();
      resetAccessRequests();
      clearGetMachinePoolsResponse();
      clearGetClusterAutoscalerResponse();
      clearFiltersAndFlags();
      clearListVpcs();
    };
    // Should run only once on mount and once on unmount
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const subscriptionID = params.id;
    if (get(clusterDetails, 'cluster.subscription.id') === subscriptionID) {
      const clusterName = getClusterName(clusterDetails.cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (!prevClusterId.current && clusterDetails.fulfilled && clusterDetails.cluster?.id) {
      refreshRelatedResources();
      prevClusterId.current = clusterDetails.cluster?.id;
    }
    // Eslint issue with dependency on refreshRelatedResources
    // has to be wrapped in useCallback
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [params, clusterDetails, subscriptionID]);

  // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
  // the redux state will have the data for the previous cluster. We want to ensure we only
  // show data for the requested cluster, so different data should be marked as pending.
  const isPending =
    get(cluster, 'subscription.id') !== requestedSubscriptionID && !clusterDetails.error;

  const errorState = () => (
    <AppPage title={PAGE_TITLE}>
      <Unavailable message="Error retrieving cluster details" response={clusterDetails} />
      {isPending && <Spinner />}
    </AppPage>
  );

  // organization.details is required by canCreateGCPNonCCSCluster below
  // and must be loaded so the Networking tab displays properly
  if (isPending || (!organization.fulfilled && !clusterDetails.error)) {
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
  if (
    clusterDetails.error &&
    (!cluster || get(cluster, 'subscription.id') !== requestedSubscriptionID)
  ) {
    if (clusterDetails.errorCode === 404 || clusterDetails.errorCode === 403) {
      resetAccessRequest();
      setGlobalError(
        <>
          Cluster with subscription ID <b>{requestedSubscriptionID}</b> was not found, it might have
          been deleted or you don&apos;t have permission to see it.
        </>,
        'clusterDetails',
        clusterDetails.errorMessage,
      );
      return <Navigate to="/" />;
    }
    return errorState();
  }

  const onTabSelected = (tabId) => {
    setSelectedTab(tabId);
  };

  const clusterHibernating = isHibernating(cluster);
  const isArchived =
    get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED ||
    get(cluster, 'subscription.status', false) === subscriptionStatuses.DEPROVISIONED;
  const isAROCluster = get(cluster, 'subscription.plan.type', '') === knownProducts.ARO;
  const isOSDTrial = get(cluster, 'subscription.plan.type', '') === knownProducts.OSDTrial;
  const isRHOIC = get(cluster, 'subscription.plan.type', '') === knownProducts.RHOIC;

  const isManaged = cluster.managed;
  const isHypershift = isHypershiftCluster(cluster);
  const isClusterWaiting = cluster.state === clusterStates.WAITING;
  const isClusterPending = cluster.state === clusterStates.PENDING;
  const isClusterInstalling = cluster.state === clusterStates.INSTALLING;
  const isClusterReady = cluster.state === clusterStates.READY;
  const isClusterUpdating = cluster.state === clusterStates.UPDATING;
  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
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
      (cloudProvider === 'gcp' &&
        (get(cluster, 'ccs.enabled') || (gotRouters && canCreateGCPNonCCSCluster)))) &&
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
  if (assistedInstallerEnabled && !isArchived) {
    addHostsTabState = getAddHostsTabState(cluster);
  }

  return (
    <AppPage title={PAGE_TITLE}>
      <ReadOnlyBanner isReadOnly={isReadOnly} />
      <PageSection id="clusterdetails-content">
        <ClusterDetailsTop
          cluster={cluster}
          openModal={openModal}
          pending={clusterDetails.pending}
          refreshFunc={refresh}
          clickRefreshFunc={() => refresh(eventTypes.CLICKED)}
          clusterIdentityProviders={clusterIdentityProviders}
          organization={organization}
          error={clusterDetails.error}
          errorMessage={clusterDetails.errorMessage}
          canSubscribeOCP={canSubscribeOCP}
          canTransferClusterOwnership={canTransferClusterOwnership}
          canHibernateCluster={canHibernateCluster}
          autoRefreshEnabled={!anyModalOpen}
          toggleSubscriptionReleased={toggleSubscriptionReleased}
          showPreviewLabel={isHypershift}
          logs={logs}
        >
          <TabsRow
            tabsInfo={{
              overview: { ref: overviewTabRef, hasIssues: false },
              monitoring: {
                ref: monitoringTabRef,
                show: displayMonitoringTab,
                hasIssues: cluster.state !== clusterStates.INSTALLING && hasIssues,
              },
              accessControl: { ref: accessControlTabRef, show: displayAccessControlTab },
              addOns: { ref: addOnsTabRef, show: displayAddOnsTab },
              clusterHistory: { ref: clusterHistoryTabRef, show: displayClusterLogs },
              networking: { ref: networkingTabRef, show: displayNetworkingTab },
              machinePools: {
                ref: machinePoolsTabRef,
                show: canViewMachinePoolTab(cluster),
              },
              support: { ref: supportTabRef, show: displaySupportTab },
              upgradeSettings: {
                ref: upgradeSettingsTabRef,
                show: displayUpgradeSettingsTab,
              },
              addAssisted: {
                ref: addAssistedTabRef,
                show: addHostsTabState.showTab,
                isDisabled: addHostsTabState.isDisabled,
                tooltip: addHostsTabState.tabTooltip,
              },
              accessRequest: {
                ref: accessRequestsTabRef,
                show: isAccessRequestEnabled && isRosa,
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
              cloudProviders={cloudProviders}
              refresh={refresh}
              openModal={openModal}
              insightsData={insightsData[cluster.external_id]}
              hasNetworkOndemand={hasNetworkOndemand}
              userAccess={userAccess}
            />
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
              <AccessControl cluster={cluster} refreshEvent={refreshEvent} />
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
              <AddOns clusterID={cluster.id} isHypershift={isHypershift} />
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
                createdAt={cluster.creation_timestamp}
                refreshEvent={{
                  type: refreshEvent.type,
                  reset: () => setRefreshEvent({ type: eventTypes.NONE }),
                }}
                isVisible={selectedTab === ClusterTabsId.CLUSTER_HISTORY}
              />
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
              <Networking clusterID={cluster.id} refreshCluster={refresh} />
            </ErrorBoundary>
          </TabContent>
        )}
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
              <UpgradeSettingsTab />
            </ErrorBoundary>
          </TabContent>
        )}
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
              <GatedAIHostsClusterDetailTab
                cluster={cluster}
                isVisible={selectedTab === ClusterTabsId.ADD_ASSISTED_HOSTS}
              />
            </ErrorBoundary>
          </TabContent>
        )}
        {isAccessRequestEnabled && isRosa ? (
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
        <CommonClusterModals
          onClose={onDialogClose}
          onClusterDeleted={() => {
            invalidateClusters();
            navigate('/');
          }}
        />
        <DeleteIDPDialog refreshParent={refreshIDP} />
        <AddNotificationContactDialog />
        <AddGrantModal clusterID={cluster.id} />
        <CancelUpgradeModal isHypershift={isHypershift} />
      </PageSection>
    </AppPage>
  );
};

ClusterDetails.propTypes = {
  fetchDetails: PropTypes.func.isRequired,
  fetchClusterInsights: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getOnDemandMetrics: PropTypes.func.isRequired,
  getAddOns: PropTypes.func.isRequired,
  getClusterAddOns: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  gotRouters: PropTypes.bool.isRequired,
  displayClusterLogs: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  resetClusterHistory: PropTypes.func.isRequired,
  resetAccessRequests: PropTypes.func.isRequired,
  resetAccessRequest: PropTypes.func.isRequired,
  getClusterIdentityProviders: PropTypes.func.isRequired,
  insightsData: PropTypes.object,
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      summary: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  clusterIdentityProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.object,
    error: PropTypes.bool,
    errorCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
    fulfilled: PropTypes.bool,
    history: PropTypes.object,
    pending: PropTypes.bool.isRequired,
  }),
  resetIdentityProvidersState: PropTypes.func.isRequired,
  setGlobalError: PropTypes.func.isRequired,
  clearGlobalError: PropTypes.func.isRequired,
  getGrants: PropTypes.func.isRequired,
  accessRequestsViewOptions: PropTypes.object.isRequired,
  pendingAccessRequests: PropTypes.object.isRequired,
  clusterLogsViewOptions: PropTypes.object.isRequired,
  getClusterHistory: PropTypes.func.isRequired,
  getAccessRequests: PropTypes.func.isRequired,
  getPendingAccessRequests: PropTypes.func.isRequired,
  getMachineOrNodePools: PropTypes.func.isRequired,
  clearGetMachinePoolsResponse: PropTypes.func.isRequired,
  clearGetClusterAutoscalerResponse: PropTypes.func.isRequired,
  clearListVpcs: PropTypes.func.isRequired,
  canSubscribeOCP: PropTypes.bool.isRequired,
  canTransferClusterOwnership: PropTypes.bool.isRequired,
  canHibernateCluster: PropTypes.bool.isRequired,
  getClusterRouters: PropTypes.func.isRequired,
  anyModalOpen: PropTypes.bool,
  hasIssues: PropTypes.bool.isRequired,
  toggleSubscriptionReleased: PropTypes.func.isRequired,
  initTabOpen: PropTypes.string.isRequired,
  notificationContacts: PropTypes.object.isRequired,
  getNotificationContacts: PropTypes.func.isRequired,
  hasNetworkOndemand: PropTypes.bool.isRequired,
  isAccessRequestEnabled: PropTypes.bool.isRequired,
  assistedInstallerEnabled: PropTypes.bool,
  getSchedules: PropTypes.func,
  getUserAccess: PropTypes.func.isRequired,
  userAccess: PropTypes.shape({
    data: PropTypes.bool,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
  fetchUpgradeGates: PropTypes.func,
  clearFiltersAndFlags: PropTypes.func.isRequired,
  useNodeUpgradePolicies: PropTypes.bool,
};

ClusterDetails.defaultProps = {
  insightsData: {},
  clusterDetails: {
    cluster: null,
    error: false,
    errorMessage: '',
    fulfilled: false,
  },
};

export default ClusterDetails;
