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
import has from 'lodash/has';
import intersection from 'lodash/intersection';

import { PageSection, TabContent } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { BareMetalHostsClusterDetailTab, canAddBareMetalHost } from 'openshift-assisted-ui-lib';

import ClusterDetailsTop from './components/ClusterDetailsTop';
import TabsRow from './components/TabsRow';
import Overview from './components/Overview/Overview';
import Insights from './components/Insights';
import Monitoring from './components/Monitoring';
import Networking from './components/Networking';
import AccessControl from './components/AccessControl/AccessControl';
import AddOns from './components/AddOns';
import { supportsFreeAddOns } from './components/AddOns/AddOnsHelper';
import MachinePools from './components/MachinePools';
import IdentityProvidersModal from './components/IdentityProvidersModal';
import DeleteIDPDialog from './components/DeleteIDPDialog';

import ErrorBoundary from '../../App/ErrorBoundary';

import CommonClusterModals from '../common/CommonClusterModals';
import CancelUpgradeModal from '../common/Upgrades/CancelUpgradeModal';

import { isValid, scrollToTop, shouldRefetchQuota } from '../../../common/helpers';
import getClusterName from '../../../common/getClusterName';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';
import clusterStates from '../common/clusterStates';
import AddGrantModal from './components/AccessControl/NetworkSelfServiceSection/AddGrantModal';
import Unavailable from '../../common/Unavailable';
import Support from './components/Support';
import AddNotificationContactDialog
  from './components/Support/components/AddNotificationContactDialog';
import UpgradeSettingsTab from './components/UpgradeSettings';


class ClusterDetails extends Component {
  state = {
    selectedTab: '',
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

    this.addBareMetalTabRef = React.createRef();
  }

  componentDidMount() {
    document.title = 'Red Hat OpenShift Cluster Manager';
    scrollToTop();

    const {
      cloudProviders,
      getCloudProviders,
      addOns,
      getAddOns,
      clearGlobalError,
    } = this.props;

    clearGlobalError('clusterDetails');

    this.refresh();

    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
    if (!addOns.pending && !addOns.error && !addOns.fulfilled) {
      getAddOns();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      match,
      groups,
      clusterDetails,
      insightsData,
      fetchGroups,
    } = this.props;
    const subscriptionID = match.params.id;
    const externalId = get(clusterDetails, 'cluster.external_id');

    if (get(clusterDetails, 'cluster.subscription.id') === subscriptionID) {
      const clusterName = getClusterName(clusterDetails.cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (
      !groups.pending
      && !groups.fulfilled
      && !groups.rejected
      && get(insightsData[externalId], 'meta.count', 0) > 0
    ) {
      fetchGroups();
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

  refresh() {
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
      this.refreshRelatedResources();
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
  refreshRelatedResources() {
    /* TODO everything here has to be moved to the individual tabs that require this info
     ideally cluster details should dispatch an event on refresh,
    and leave sub-resource handling for sub-components.

    https://issues.redhat.com/browse/SDA-2249
    */
    const {
      clusterDetails,
      getUsers,
      getAlerts,
      getNodes,
      getClusterOperators,
      getClusterAddOns,
      getOrganizationAndQuota,
      getGrants,
      clusterLogsViewOptions,
      getClusterHistory,
      getClusterRouters,
      organization,
      getMachinePools,
      getSchedules,
      fetchInsightsData,
    } = this.props;
    const clusterID = get(clusterDetails, 'cluster.id');
    const isManaged = get(clusterDetails, 'cluster.managed', false);

    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
    const externalClusterID = get(clusterDetails, 'cluster.external_id');
    if (externalClusterID) {
      getClusterHistory(externalClusterID, clusterLogsViewOptions);
      fetchInsightsData(externalClusterID, isManaged);
      this.fetchSupportData();
    }

    if (isManaged) {
      // All managed-cluster-specific requests
      getUsers(clusterID);
      getAlerts(clusterID);
      getNodes(clusterID);
      getClusterOperators(clusterID);
      getClusterRouters(clusterID);
      getClusterAddOns(clusterID);
      this.refreshIDP();
      getMachinePools(clusterID);
      getSchedules(clusterID);

      if (get(clusterDetails, 'cluster.cloud_provider.id') !== 'gcp') {
        // don't fetch grants if cloud provider is known to be gcp
        getGrants(clusterID);
      }
    }
  }

  fetchSupportData() {
    const {
      clusterDetails,
      getNotificationContacts,
      getSupportCases,
      supportCases,
      notificationContacts,
      supportTabFeature,
    } = this.props;

    if (!supportTabFeature) {
      return;
    }
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

  // Determine if the org has quota for existing add-ons
  hasAddOns() {
    const {
      addOns,
      clusterAddOns,
      clusterDetails,
      organization,
    } = this.props;
    const { cluster } = clusterDetails;

    // If cluster already has add-ons installed we can show the tab regardless of quota
    if (get(clusterAddOns, 'items.length', 0)) {
      return true;
    }

    // If there are compatible free add-ons available we can show the tab regardless of quota
    if (supportsFreeAddOns(cluster) && get(addOns, 'freeAddOns.length', 0)) {
      return true;
    }

    // If the organization has no add-ons quota, or there are no add-ons, we should hide the tab
    if (!has(organization.quotaList, 'addOnsQuota') || !get(addOns, 'resourceNames.length', 0)) {
      return false;
    }

    const addOnsQuota = Object.keys(organization.quotaList.addOnsQuota);
    return !!intersection(addOns.resourceNames, addOnsQuota).length;
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
      groups,
      voteOnRule,
      disableRule,
      enableRule,
      canSubscribeOCP,
      canTransferClusterOwnership,
      anyModalOpen,
      hasIssues,
      hasIssuesInsights,
      toggleSubscriptionReleased,
      setOpenedTab,
      initTabOpen,
      supportTabFeature,
      assistedInstallerEnabled,
    } = this.props;
    const { selectedTab } = this.state;

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

    if (isPending) {
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

    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED
    || get(cluster, 'subscription.status', false) === subscriptionStatuses.DEPROVISIONED;
    const displayAddOnsTab = cluster.managed && this.hasAddOns();
    const displayInsightsTab = !cluster.managed && !isArchived;

    const consoleURL = get(cluster, 'console.url');
    const displayMonitoringTab = !isArchived && !cluster.managed;
    const displayAccessControlTab = cluster.managed && !!consoleURL && cluster.state === 'ready';
    const cloudProvider = get(cluster, 'cloud_provider.id');
    const displayNetworkingTab = (cluster.state === clusterStates.READY
          || cluster.state === clusterStates.UPDATING)
          && cluster.managed && !!get(cluster, 'api.url')
      && (cloudProvider === 'aws'
         || (cloudProvider === 'gcp' && get(cluster, 'ccs.enabled')));
    const displayMachinePoolsTab = cluster.managed && cluster.state === clusterStates.READY;
    const clusterName = getClusterName(cluster);
    const displaySupportTab = supportTabFeature
      && (cluster.state === clusterStates.READY || cluster.state === clusterStates.UPDATING);
    const displayUpgradeSettingsTab = cluster.managed && cluster.canEdit;
    const displayAddBareMetalHosts = assistedInstallerEnabled && canAddBareMetalHost({ cluster });

    return (
      <PageSection id="clusterdetails-content">
        <ClusterDetailsTop
          cluster={cluster}
          openModal={openModal}
          pending={clusterDetails.pending}
          refreshFunc={this.refresh}
          clusterIdentityProviders={clusterIdentityProviders}
          organization={organization}
          error={clusterDetails.error}
          errorMessage={clusterDetails.errorMessage}
          canSubscribeOCP={canSubscribeOCP}
          canTransferClusterOwnership={canTransferClusterOwnership}
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
            displayAddBareMetalHosts={displayAddBareMetalHosts}
            overviewTabRef={this.overviewTabRef}
            monitoringTabRef={this.monitoringTabRef}
            accessControlTabRef={this.accessControlTabRef}
            addOnsTabRef={this.addOnsTabRef}
            networkingTabRef={this.networkingTabRef}
            insightsTabRef={this.insightsTabRef}
            supportTabRef={this.supportTabRef}
            machinePoolsTabRef={this.machinePoolsTabRef}
            upgradeSettingsTabRef={this.upgradeSettingsTabRef}
            addBareMetalTabRef={this.addBareMetalTabRef}
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
              />
            </ErrorBoundary>
          </TabContent>
        )}
        {displayAddOnsTab && (
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
                groups={get(groups, 'groups', [])}
                insightsData={insightsData[cluster.external_id]}
                voteOnRule={(ruleId, vote) => {
                  voteOnRule(cluster.external_id, ruleId, vote);
                }}
                disableRule={(ruleId) => {
                  disableRule(cluster.external_id, ruleId);
                }}
                enableRule={(ruleId) => {
                  enableRule(cluster.external_id, ruleId);
                }}
                openModal={openModal}
              />
            </ErrorBoundary>
          </TabContent>
        )}
        {
          <TabContent
            eventKey={7}
            id="supportTabContent"
            ref={this.supportTabRef}
            aria-label="Support"
            hidden
          >
            <ErrorBoundary>
              <Support />
            </ErrorBoundary>
          </TabContent>
        }
        {displayMachinePoolsTab && (
          <TabContent
            eventKey={6}
            id="machinePoolsContent"
            ref={this.machinePoolsTabRef}
            aria-label="Machine pools"
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
          >
            <ErrorBoundary>
              <UpgradeSettingsTab />
            </ErrorBoundary>
          </TabContent>
        )}
        {displayAddBareMetalHosts && (
          <TabContent
            eventKey={9}
            id="addBareMetalHostsContent"
            ref={this.addBareMetalTabRef}
            aria-label="Add Bare Metal Hosts"
            hidden
          >
            <ErrorBoundary>
              <BareMetalHostsClusterDetailTab
                cluster={cluster}
                isVisible={selectedTab === 'addBareMetalHosts'}
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
        <IdentityProvidersModal
          clusterID={cluster.id}
          clusterName={clusterName}
          clusterConsoleURL={consoleURL}
          refreshParent={this.refreshIDP}
        />
        <DeleteIDPDialog refreshParent={this.refreshIDP} />
        <AddNotificationContactDialog />
        <AddGrantModal clusterID={cluster.id} />
        <CancelUpgradeModal />
      </PageSection>
    );
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  fetchInsightsData: PropTypes.func.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getAlerts: PropTypes.func.isRequired,
  getNodes: PropTypes.func.isRequired,
  getClusterOperators: PropTypes.func.isRequired,
  getAddOns: PropTypes.func.isRequired,
  getClusterAddOns: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  displayClusterLogs: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  resetClusterHistory: PropTypes.func.isRequired,
  getClusterIdentityProviders: PropTypes.func.isRequired,
  insightsData: PropTypes.object,
  groups: PropTypes.shape({
    groups: PropTypes.array,
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    rejected: PropTypes.bool,
  }),
  addOns: PropTypes.object,
  clusterAddOns: PropTypes.object,
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
  voteOnRule: PropTypes.func.isRequired,
  disableRule: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
  setOpenedTab: PropTypes.func.isRequired,
  canSubscribeOCP: PropTypes.bool.isRequired,
  canTransferClusterOwnership: PropTypes.bool.isRequired,
  getClusterRouters: PropTypes.func.isRequired,
  anyModalOpen: PropTypes.bool,
  hasIssues: PropTypes.bool.isRequired,
  hasIssuesInsights: PropTypes.bool.isRequired,
  toggleSubscriptionReleased: PropTypes.func.isRequired,
  initTabOpen: PropTypes.string.isRequired,
  supportTabFeature: PropTypes.bool.isRequired,
  notificationContacts: PropTypes.object.isRequired,
  getNotificationContacts: PropTypes.func.isRequired,
  getSupportCases: PropTypes.func.isRequired,
  supportCases: PropTypes.object.isRequired,
  assistedInstallerEnabled: PropTypes.bool,
  getSchedules: PropTypes.func,
};

ClusterDetails.defaultProps = {
  clusterAddOns: {},
  insightsData: {},
  groups: {},
  clusterDetails: {
    cluster: null,
    error: false,
    errorMessage: '',
    fulfilled: false,
  },
  addOns: '',
};

export default ClusterDetails;
