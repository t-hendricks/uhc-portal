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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import get from 'lodash/get';

import { PageSection, TabContent } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { OCM } from 'openshift-assisted-ui-lib';

import ClusterDetailsTop from './components/ClusterDetailsTop';
import TabsRow from './components/TabsRow';
import Overview from './components/Overview/Overview';
import Insights from './components/Insights';
import Monitoring from './components/Monitoring';
import Networking from './components/Networking';
import AccessControl from './components/AccessControl/AccessControl';
import AddOns from './components/AddOns';
import MachinePools from './components/MachinePools';
import DeleteIDPDialog from './components/DeleteIDPDialog';

import ErrorBoundary from '../../App/ErrorBoundary';

import ReadOnlyBanner from '../common/ReadOnlyBanner';
import CommonClusterModals from '../common/CommonClusterModals';
import CancelUpgradeModal from '../common/Upgrades/CancelUpgradeModal';

import { isValid, scrollToTop, shouldRefetchQuota } from '../../../common/helpers';
import getClusterName from '../../../common/getClusterName';
import { subscriptionStatuses, knownProducts } from '../../../common/subscriptionTypes';
import clusterStates, { isHibernating } from '../common/clusterStates';
import AddGrantModal from './components/AccessControl/NetworkSelfServiceSection/AddGrantModal';
import Unavailable from '../../common/Unavailable';
import Support from './components/Support';
import AddNotificationContactDialog
  from './components/Support/components/AddNotificationContactDialog';
import UpgradeSettingsTab from './components/UpgradeSettings';
import { isUninstalledAICluster } from '../../../common/isAssistedInstallerCluster';
import { hasCapability, subscriptionCapabilities } from '../../../common/subscriptionCapabilities';

const { HostsClusterDetailTab, canAddHost } = OCM;
class ClusterDetails extends Component {
  state = {
    selectedTab: '',
    refreshEvent: null,
  };

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.refreshIDP = this.refreshIDP.bind(this);

    this.overviewTabRef = React.createRef();
    this.insightsTabRef = React.createRef();
    this.monitoringTabRef = React.createRef();
    this.accessControlTabRef = React.createRef();
    this.addOnsTabRef = React.createRef();
    this.networkingTabRef = React.createRef();
    this.supportTabRef = React.createRef();
    this.machinePoolsTabRef = React.createRef();
    this.upgradeSettingsTabRef = React.createRef();

    this.addAssistedTabRef = React.createRef();
  }

  componentDidMount() {
    document.title = 'Red Hat OpenShift Cluster Manager';
    scrollToTop();

    const {
      cloudProviders,
      getCloudProviders,
      clearGlobalError,
      getUserAccess,
    } = this.props;

    clearGlobalError('clusterDetails');
    this.refresh();

    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
    getUserAccess({ type: 'OCP' });
  }

  componentDidUpdate(prevProps) {
    const {
      match,
      clusterDetails,
    } = this.props;
    const subscriptionID = match.params.id;

    if (get(clusterDetails, 'cluster.subscription.id') === subscriptionID) {
      const clusterName = getClusterName(clusterDetails.cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (!prevProps.clusterDetails?.cluster?.id
      && clusterDetails.fulfilled
      && clusterDetails?.cluster?.id) {
      /* we only know the Cluster Service `cluster_id` after the subscription request has returned.
      only then we can fetch Cluster Service specific data */
      this.refreshRelatedResources();
    }
  }

  componentWillUnmount() {
    const {
      resetIdentityProvidersState,
      closeModal,
      resetClusterHistory,
      clearGetMachinePoolsResponse,
    } = this.props;
    resetIdentityProvidersState();
    closeModal();
    resetClusterHistory();
    clearGetMachinePoolsResponse();
  }

  onDialogClose = () => {
    const { match, invalidateClusters, fetchDetails } = this.props;
    const subscriptionID = match.params.id;

    invalidateClusters();
    if (isValid(subscriptionID)) {
      fetchDetails(subscriptionID);
    }
  };

  refresh(clicked) {
    const {
      match,
      clusterDetails,
      fetchDetails,
    } = this.props;
    const { cluster } = clusterDetails;
    const subscriptionID = match.params.id;

    if (isValid(subscriptionID)) {
      fetchDetails(subscriptionID);
    }

    const clusterID = get(cluster, 'id');
    const subscriptionStatus = get(cluster, 'subscription.status');
    if (isValid(clusterID) && subscriptionStatus !== subscriptionStatuses.DEPROVISIONED) {
      this.refreshRelatedResources(clicked);
    }
  }

  refreshIDP() {
    const { clusterDetails, clusterIdentityProviders, getClusterIdentityProviders } = this.props;
    const clusterID = clusterDetails?.cluster?.id;

    if (isValid(clusterID)
      && !clusterIdentityProviders.pending
      && !clusterIdentityProviders.error) {
      getClusterIdentityProviders(clusterID);
    }
  }

  /**
   * Refresh the cluster's related resources.
   */
  refreshRelatedResources(clicked) {
    /* TODO everything here has to be moved to the individual tabs that require this info
     ideally cluster details should dispatch an event on refresh,
    and leave sub-resource handling for sub-components.

    https://issues.redhat.com/browse/SDA-2249
    */
    const {
      clusterDetails,
      getAddOns,
      getUsers,
      getOnDemandMetrics,
      getClusterAddOns,
      getOrganizationAndQuota,
      getGrants,
      clusterLogsViewOptions,
      getClusterHistory,
      getClusterRouters,
      organization,
      getMachinePools,
      getSchedules,
      fetchClusterInsights,
    } = this.props;
    const clusterID = get(clusterDetails, 'cluster.id');
    const isManaged = get(clusterDetails, 'cluster.managed', false);
    const isManagedSubscription = get(clusterDetails, 'cluster.subscription.managed', false);

    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
    const externalClusterID = get(clusterDetails, 'cluster.external_id');
    if (externalClusterID) {
      fetchClusterInsights(externalClusterID, isManagedSubscription);
      this.fetchSupportData();
    }

    if (externalClusterID && clicked === 'clicked') {
      getClusterHistory(externalClusterID, clusterLogsViewOptions);
    }

    if (isManaged) {
      // All managed-cluster-specific requests
      getAddOns(clusterID);
      getUsers(clusterID);
      getClusterRouters(clusterID);
      getClusterAddOns(clusterID);
      this.refreshIDP();
      getMachinePools(clusterID);
      getSchedules(clusterID);

      if (get(clusterDetails, 'cluster.cloud_provider.id') !== 'gcp') {
        // don't fetch grants if cloud provider is known to be gcp
        getGrants(clusterID);
      }
    } else {
      const subscriptionID = clusterDetails.cluster?.subscription?.id;
      getOnDemandMetrics(subscriptionID);
    }

    this.setState({ refreshEvent: { type: clicked } });
  }

  fetchSupportData() {
    const {
      clusterDetails,
      getNotificationContacts,
      getSupportCases,
      supportCases,
      notificationContacts,
    } = this.props;

    const subscriptionID = clusterDetails.cluster?.subscription?.id;

    if (isValid(subscriptionID)) {
      if (!notificationContacts.pending) {
        getNotificationContacts(subscriptionID);
      }

      if (!supportCases.pending) {
        getSupportCases(subscriptionID);
      }
    }
  }

  render() {
    const {
      clusterDetails,
      cloudProviders,
      invalidateClusters,
      openModal,
      history,
      match,
      clusterIdentityProviders,
      organization,
      setGlobalError,
      displayClusterLogs,
      insightsData,
      enableRule,
      canSubscribeOCP,
      canTransferClusterOwnership,
      canHibernateCluster,
      anyModalOpen,
      hasIssues,
      hasIssuesInsights,
      toggleSubscriptionReleased,
      setOpenedTab,
      initTabOpen,
      assistedInstallerEnabled,
      userAccess,
      addNotification,
      gotRouters,
    } = this.props;
    const { selectedTab, refreshEvent } = this.state;

    const { cluster } = clusterDetails;

    const requestedSubscriptionID = match.params.id;

    // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
    // the redux state will have the data for the previous cluster. We want to ensure we only
    // show data for the requested cluster, so different data should be marked as pending.

    const isPending = (get(cluster, 'subscription.id') !== requestedSubscriptionID && !clusterDetails.error);

    const errorState = () => (
      <>
        <Unavailable message="Error retrieving cluster details" response={clusterDetails} />
        {isPending && <Spinner />}
      </>
    );

    // organization.details is required by canCreateGCPNonCCSCluster below
    // and must be loaded so the Networking tab displays properly
    if (isPending || !organization.fulfilled) {
      return (
        <div id="clusterdetails-content">
          <div className="cluster-loading-container">
            <Spinner centered />
          </div>
        </div>
      );
    }

    // show a full error state only if we don't have data at all,
    // or when we only have data for a different cluster
    if (clusterDetails.error && (!cluster || get(cluster, 'subscription.id') !== requestedSubscriptionID)) {
      if (clusterDetails.errorCode === 404 || clusterDetails.errorCode === 403) {
        setGlobalError((
          <>
            Cluster with subscription ID
            {' '}
            <b>{requestedSubscriptionID}</b>
            {' '}
            was not found, it might have been deleted or you don&apos;t have permission to see it.
          </>
        ), 'clusterDetails', clusterDetails.errorMessage);
        return (<Redirect to="/" />);
      }
      return errorState();
    }

    const onTabSelected = (tabId) => {
      this.setState({ selectedTab: tabId });
    };

    const clusterHibernating = isHibernating(cluster.state);
    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED
      || get(cluster, 'subscription.status', false) === subscriptionStatuses.DEPROVISIONED;
    const isAROCluster = get(cluster, 'subscription.plan.type', '') === knownProducts.ARO;
    const isOSDTrial = get(cluster, 'subscription.plan.type', '') === knownProducts.OSDTrial;
    const isManaged = cluster.managed;
    const isManagedSubscription = cluster.subscription.managed;
    const isClusterWaiting = cluster.state === clusterStates.WAITING;
    const isClusterPending = cluster.state === clusterStates.PENDING;
    const isClusterInstalling = cluster.state === clusterStates.INSTALLING;
    const isClusterReady = cluster.state === clusterStates.READY;
    const isClusterUpdating = cluster.state === clusterStates.UPDATING;
    const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
    const isPrivateCluster = cluster.aws && get(cluster, 'ccs.enabled') && get(cluster, 'aws.private_link');
    const canCreateGCPNonCCSCluster = hasCapability(
      organization.details,
      subscriptionCapabilities.CREATE_GCP_NON_CCS_CLUSTER,
    );
    const displayAddOnsTab = !isClusterInstalling && !isClusterPending && !isClusterWaiting
      && cluster.managed && !isArchived;
      // "Insights Advisor" tab
      // TODO: remove the tab and the related code properly
    const displayInsightsTab = !APP_BETA && (!isArchived && !isUninstalledAICluster(cluster));
    const consoleURL = get(cluster, 'console.url');
    const displayMonitoringTab = !isArchived && !cluster.managed && !isAROCluster
      && !isUninstalledAICluster(cluster);
    const displayAccessControlTab = !isArchived;
    const cloudProvider = get(cluster, 'cloud_provider.id');
    const displayNetworkingTab = (isClusterReady || isClusterUpdating || clusterHibernating)
      && cluster.managed
      && !!get(cluster, 'api.url')
      && (
        (cloudProvider === 'aws' && !isPrivateCluster)
        || (cloudProvider === 'gcp' && (get(cluster, 'ccs.enabled') || (gotRouters && canCreateGCPNonCCSCluster)))
      )
      && !isArchived;
    const displayMachinePoolsTab = cluster.managed
      && (isClusterReady || clusterHibernating)
      && !isArchived;
    const hideSupportTab = cluster.managed
      // The (managed) cluster has not yet reported its cluster ID to AMS
      // eslint-disable-next-line camelcase
      && cluster.subscription?.external_cluster_id === undefined;
    const displaySupportTab = !hideSupportTab && !isOSDTrial;
    const displayUpgradeSettingsTab = cluster.managed && cluster.canEdit && !isArchived;
    const displayAddAssistedHosts = assistedInstallerEnabled && canAddHost({ cluster })
      && !isArchived;

    return (
      <>
        <ReadOnlyBanner isReadOnly={isReadOnly} />
        <PageSection id="clusterdetails-content">
          <ClusterDetailsTop
            cluster={cluster}
            openModal={openModal}
            pending={clusterDetails.pending}
            refreshFunc={this.refresh}
            clickRefreshFunc={() => this.refresh('clicked')}
            clusterIdentityProviders={clusterIdentityProviders}
            organization={organization}
            error={clusterDetails.error}
            errorMessage={clusterDetails.errorMessage}
            canSubscribeOCP={canSubscribeOCP}
            canTransferClusterOwnership={canTransferClusterOwnership}
            canHibernateCluster={canHibernateCluster}
            autoRefreshEnabled={!anyModalOpen}
            toggleSubscriptionReleased={toggleSubscriptionReleased}
          >
            <TabsRow
              displayMonitoringTab={displayMonitoringTab}
              displayAccessControlTab={displayAccessControlTab}
              displayAddOnsTab={displayAddOnsTab}
              displayNetworkingTab={displayNetworkingTab}
              displayInsightsTab={displayInsightsTab}
              displaySupportTab={displaySupportTab}
              displayMachinePoolsTab={displayMachinePoolsTab}
              displayUpgradeSettingsTab={displayUpgradeSettingsTab}
              displayAddAssistedHosts={displayAddAssistedHosts}
              overviewTabRef={this.overviewTabRef}
              monitoringTabRef={this.monitoringTabRef}
              accessControlTabRef={this.accessControlTabRef}
              addOnsTabRef={this.addOnsTabRef}
              networkingTabRef={this.networkingTabRef}
              insightsTabRef={this.insightsTabRef}
              supportTabRef={this.supportTabRef}
              machinePoolsTabRef={this.machinePoolsTabRef}
              upgradeSettingsTabRef={this.upgradeSettingsTabRef}
              addAssistedTabRef={this.addAssistedTabRef}
              hasIssues={cluster.state !== clusterStates.INSTALLING && hasIssues}
              hasIssuesInsights={hasIssuesInsights}
              initTabOpen={initTabOpen}
              setOpenedTab={setOpenedTab}
              onTabSelected={onTabSelected}
            />
          </ClusterDetailsTop>
          <TabContent
            eventKey={0}
            id="overviewTabContent"
            ref={this.overviewTabRef}
            aria-label="Overview"
            ouiaId="overviewTabContent"
          >
            <ErrorBoundary>
              <Overview
                cluster={cluster}
                cloudProviders={cloudProviders}
                history={history}
                displayClusterLogs={displayClusterLogs}
                refresh={this.refresh}
                openModal={openModal}
                insightsData={insightsData[cluster.external_id]}
                userAccess={userAccess}
              />
            </ErrorBoundary>
          </TabContent>
          { displayMonitoringTab && (
          <TabContent
            eventKey={1}
            id="monitoringTabContent"
            ref={this.monitoringTabRef}
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
            ref={this.accessControlTabRef}
            aria-label="Access Control"
            hidden
          >
            <ErrorBoundary>
              <AccessControl
                cluster={cluster}
                clusterConsoleURL={consoleURL}
                cloudProvider={get(cluster, 'cloud_provider.id')}
                history={history}
                refreshEvent={refreshEvent}
              />
            </ErrorBoundary>
          </TabContent>
          )}
          {isManaged && (
          <TabContent
            eventKey={3}
            id="addOnsTabContent"
            ref={this.addOnsTabRef}
            aria-label="Add-ons"
            hidden
          >
            <ErrorBoundary>
              <AddOns clusterID={cluster.id} />
            </ErrorBoundary>
          </TabContent>
          )}
          {displayNetworkingTab && (
          <TabContent
            eventKey={4}
            id="networkingTabContent"
            ref={this.networkingTabRef}
            aria-label="Networking"
            hidden
          >
            <ErrorBoundary>
              <Networking clusterID={cluster.id} refreshCluster={this.refresh} />
            </ErrorBoundary>
          </TabContent>
          )}
          {displayInsightsTab && (
          <TabContent
            eventKey={5}
            id="insightsTabContent"
            ref={this.insightsTabRef}
            aria-label="Insights"
            ouiaId="insightsTabContent"
            hidden
          >
            <ErrorBoundary>
              <Insights
                cluster={cluster}
                insightsData={insightsData[cluster.external_id]}
                enableRule={(ruleId, errorKey) => {
                  /*  Use `managed` field from the subscription object because
                      it evaluates to true for ARO clusters (yet Advisor considers
                      ARO clusters are managed) */
                  enableRule(cluster.external_id, ruleId, errorKey, false, isManagedSubscription);
                }}
                openModal={openModal}
                addNotification={addNotification}
              />
            </ErrorBoundary>
          </TabContent>
          )}
          <TabContent
            eventKey={7}
            id="supportTabContent"
            ref={this.supportTabRef}
            aria-label="Support"
            hidden
          >
            <ErrorBoundary>
              <Support isDisabled={isArchived} />
            </ErrorBoundary>
          </TabContent>
          {displayMachinePoolsTab && (
          <TabContent
            eventKey={6}
            id="machinePoolsContent"
            ref={this.machinePoolsTabRef}
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
            ref={this.upgradeSettingsTabRef}
            aria-label="Upgrade settings"
            hidden
          >
            <ErrorBoundary>
              <UpgradeSettingsTab />
            </ErrorBoundary>
          </TabContent>
          )}
          {displayAddAssistedHosts && (
          <TabContent
            eventKey={9}
            id="addHostsContent"
            ref={this.addAssistedTabRef}
            aria-label="Add Hosts"
            hidden
          >
            <ErrorBoundary>
              <HostsClusterDetailTab
                cluster={cluster}
                isVisible={selectedTab === 'addAssistedHosts'}
              />
            </ErrorBoundary>
          </TabContent>
          )}
          <CommonClusterModals
            onClose={this.onDialogClose}
            onClusterDeleted={() => {
              invalidateClusters();
              history.push('/');
            }}
          />
          <DeleteIDPDialog refreshParent={this.refreshIDP} />
          <AddNotificationContactDialog />
          <AddGrantModal clusterID={cluster.id} />
          <CancelUpgradeModal />
        </PageSection>
      </>
    );
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
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
  getClusterIdentityProviders: PropTypes.func.isRequired,
  insightsData: PropTypes.object,
  clusterIdentityProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.object,
    error: PropTypes.bool,
    errorCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    errorMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.element,
    ]),
    fulfilled: PropTypes.bool,
    history: PropTypes.object,
    pending: PropTypes.bool.isRequired,
  }),
  resetIdentityProvidersState: PropTypes.func.isRequired,
  setGlobalError: PropTypes.func.isRequired,
  clearGlobalError: PropTypes.func.isRequired,
  getGrants: PropTypes.func.isRequired,
  clusterLogsViewOptions: PropTypes.object.isRequired,
  getClusterHistory: PropTypes.func.isRequired,
  getMachinePools: PropTypes.func.isRequired,
  clearGetMachinePoolsResponse: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
  setOpenedTab: PropTypes.func.isRequired,
  canSubscribeOCP: PropTypes.bool.isRequired,
  canTransferClusterOwnership: PropTypes.bool.isRequired,
  canHibernateCluster: PropTypes.bool.isRequired,
  getClusterRouters: PropTypes.func.isRequired,
  anyModalOpen: PropTypes.bool,
  hasIssues: PropTypes.bool.isRequired,
  hasIssuesInsights: PropTypes.bool.isRequired,
  toggleSubscriptionReleased: PropTypes.func.isRequired,
  initTabOpen: PropTypes.string.isRequired,
  notificationContacts: PropTypes.object.isRequired,
  getNotificationContacts: PropTypes.func.isRequired,
  getSupportCases: PropTypes.func.isRequired,
  supportCases: PropTypes.object.isRequired,
  assistedInstallerEnabled: PropTypes.bool,
  getSchedules: PropTypes.func,
  getUserAccess: PropTypes.func.isRequired,
  userAccess: PropTypes.shape({
    data: PropTypes.bool,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
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
