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
import isUuid from 'uuid-validate';
import { Redirect } from 'react-router';
import get from 'lodash/get';
import has from 'lodash/has';
import intersection from 'lodash/intersection';

import { PageSection, TabContent } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { BareMetalHostsClusterDetailTab, canAddBareMetalHost } from 'facet-lib';

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

import ScaleClusterDialog from '../common/ScaleClusterDialog';
import EditNodeCountModal from '../common/EditNodeCountModal';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import EditCCSCredentialsDialog from '../common/EditCCSCredentialsDialog';
import EditConsoleURLDialog from '../common/EditConsoleURLDialog';
import EditSubscriptionSettingsDialog from '../common/EditSubscriptionSettingsDialog';
import TransferClusterOwnershipDialog from '../common/TransferClusterOwnershipDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog';
import ToggleClusterAdminAccessDialog from '../common/ToggleClusterAdminAccessDialog';
import UpgradeWizard from '../common/Upgrades/UpgradeWizard';
import CancelUpgradeModal from '../common/Upgrades/CancelUpgradeModal';

import { isValid, scrollToTop, shouldRefetchQuota } from '../../../common/helpers';
import ArchiveClusterDialog from '../common/ArchiveClusterDialog';
import UnarchiveClusterDialog from '../common/UnarchiveClusterDialog';
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
    this.fetchDetailsAndInsightsData = this.fetchDetailsAndInsightsData.bind(this);
    this.fetchSupportData = this.fetchSupportData.bind(this);

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
      clusterIdentityProviders,
      getClusterIdentityProviders,
      getClusterAddOns,
      clusterAddOns,
      match,
      addOns,
      getAddOns,
      clearGlobalError,
    } = this.props;

    clearGlobalError('clusterDetails');

    const clusterID = match.params.id;

    this.refresh(false);

    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
    if (isValid(clusterID) && !isUuid(clusterID)) {
      // TODO: get IDP and Add-On Installations only for managed clusters
      if (!clusterIdentityProviders.pending
        && !clusterIdentityProviders.error
        && !clusterIdentityProviders.fulfilled) {
        getClusterIdentityProviders(clusterID);
      }
      if (!clusterAddOns.pending && !clusterAddOns.error && !clusterAddOns.fulfilled) {
        getClusterAddOns(clusterID);
      }
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
      fetchInsightsData,
      fetchGroups,
    } = this.props;
    const clusterID = match.params.id;
    const oldClusterID = prevProps.match.params.id;
    const externalId = get(clusterDetails, 'cluster.external_id');

    if (get(clusterDetails, 'cluster.id') === clusterID) {
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

    if (clusterID !== oldClusterID && isValid(clusterID)) {
      this.refresh(false);
    }

    if (
      get(clusterDetails, 'cluster.external_id')
      && get(prevProps.clusterDetails, 'cluster.external_id') !== get(clusterDetails, 'cluster.external_id')
    ) {
      fetchInsightsData(get(clusterDetails, 'cluster.external_id'));
    }
  }

  componentWillUnmount() {
    const {
      resetIdentityProvidersState,
      closeModal,
      resetClusterHistory,
      clearGetMachinePoolsResponse,
      match,
    } = this.props;
    resetIdentityProvidersState();
    closeModal();
    resetClusterHistory();
    clearGetMachinePoolsResponse(match.params.id);
  }

  refresh(automatic = true) {
    const {
      match,
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
    } = this.props;
    const clusterID = match.params.id;
    if (isValid(clusterID)) {
      this.fetchDetailsAndInsightsData(
        clusterID,
        get(clusterDetails, 'cluster.external_id'),
        get(clusterDetails, 'cluster.managed', false),
      );
      if (shouldRefetchQuota(organization)) {
        getOrganizationAndQuota();
      }
      if (automatic) {
        const externalClusterID = get(clusterDetails, 'cluster.external_id');
        if (externalClusterID) {
          getClusterHistory(externalClusterID, clusterLogsViewOptions);
        }
        this.fetchSupportData();
      }

      if (!isUuid(clusterID)) {
        getUsers(clusterID);
        getAlerts(clusterID);
        getNodes(clusterID);
        getClusterOperators(clusterID);
        getClusterRouters(clusterID);
        if (get(clusterDetails, 'cluster.managed')) {
          getClusterAddOns(clusterID);
          this.refreshIDP();
          getMachinePools(clusterID);
        }
        // don't fetch grants if cloud provider is known to be gcp
        if (get(clusterDetails, 'cluster.cloud_provider.id') !== 'gcp') {
          getGrants(clusterID);
        }
      }
    }
  }

  refreshIDP() {
    const { match, clusterIdentityProviders, getClusterIdentityProviders } = this.props;
    const clusterID = match.params.id;

    if (isValid(clusterID)
      && !isUuid(clusterID)
      && !clusterIdentityProviders.pending
      && !clusterIdentityProviders.error) {
      getClusterIdentityProviders(clusterID);
    }
  }

  fetchDetailsAndInsightsData(id, externalId, isOSD) {
    const {
      fetchDetails,
      fetchInsightsData,
    } = this.props;
    fetchDetails(id);
    if (externalId) {
      fetchInsightsData(externalId, isOSD);
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
      canAllowClusterAdmin,
      canSubscribeOCP,
      canTransferClusterOwnership,
      anyModalOpen,
      hasIssues,
      hasIssuesInsights,
      toggleSubscriptionReleased,
      setOpenedTab,
      initTabOpen,
      supportTabFeature,
      upgradesEnabled,
      assistedInstallerEnabled,
    } = this.props;
    const { selectedTab } = this.state;

    const { cluster } = clusterDetails;

    // ClusterDetails can be entered via normal id from OCM, or via external_id (a uuid)
    // from openshift console. if we enter via the uuid, switch to the normal id.
    const requestedClusterID = match.params.id;
    if (cluster && cluster.shouldRedirect && isUuid(requestedClusterID)) {
      return (
        <Redirect to={`/details/${cluster.id}`} />
      );
    }

    // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
    // the redux state will have the data for the previous cluster. We want to ensure we only
    // show data for the requested cluster, so different data should be marked as pending.

    const isPending = ((get(cluster, 'id') !== requestedClusterID) && !clusterDetails.error);

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
    if (clusterDetails.error && (!cluster || get(cluster, 'id') !== requestedClusterID)) {
      if (clusterDetails.errorCode === 404) {
        setGlobalError((
          <>
            Cluster
            {' '}
            <b>{requestedClusterID}</b>
            {' '}
            was not found, it might have been deleted or you don&apos;t have permission to see it.
          </>
        ), 'clusterDetails', clusterDetails.errorMessage);
        return (<Redirect to="/" />);
      }
      return errorState();
    }

    const onDialogClose = () => {
      invalidateClusters();
      this.fetchDetailsAndInsightsData(cluster.id);
    };
    const onTabSelected = (tabId) => {
      this.setState({ selectedTab: tabId });
    };

    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
    const displayAddOnsTab = cluster.managed && this.hasAddOns();
    const displayInsightsTab = !cluster.managed && !isArchived && (
      !insightsData[cluster.external_id] || 'meta' in insightsData[cluster.external_id]
      || insightsData[cluster.external_id].status === 404
      || insightsData[cluster.external_id].status === 500
      || insightsData[cluster.external_id].status === 204
    );

    const consoleURL = get(cluster, 'console.url');
    const displayAccessControlTab = cluster.managed && !!consoleURL && cluster.state === 'ready';
    const displayNetworkingTab = (cluster.state === clusterStates.READY
      || cluster.state === clusterStates.UPDATING)
      && cluster.managed && !!get(cluster, 'api.url')
      && get(cluster, 'cloud_provider.id') === 'aws';
    const displayMachinePoolsTab = cluster.managed && cluster.state === clusterStates.READY;
    const clusterName = getClusterName(cluster);
    const displaySupportTab = supportTabFeature
      && (cluster.state === clusterStates.READY || cluster.state === clusterStates.UPDATING);
    const displayUpgradeSettingsTab = upgradesEnabled && cluster.managed && cluster.canEdit;
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
          canAllowClusterAdmin={canAllowClusterAdmin}
          canSubscribeOCP={canSubscribeOCP}
          canTransferClusterOwnership={canTransferClusterOwnership}
          autoRefreshEnabled={!anyModalOpen}
          toggleSubscriptionReleased={toggleSubscriptionReleased}
        >
          <TabsRow
            displayMonitoringTab={!isArchived}
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
          <Overview
            cluster={cluster}
            cloudProviders={cloudProviders}
            history={history}
            displayClusterLogs={displayClusterLogs}
            refresh={this.refresh}
            openModal={openModal}
          />
        </TabContent>
        {!isArchived && (
          <TabContent
            eventKey={1}
            id="monitoringTabContent"
            ref={this.monitoringTabRef}
            aria-label="Monitoring"
            hidden
          >
            <Monitoring cluster={cluster} />
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
            <AccessControl
              cluster={cluster}
              clusterConsoleURL={consoleURL}
              cloudProvider={get(cluster, 'cloud_provider.id')}
            />
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
            <AddOns clusterID={cluster.id} />
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
            <Networking clusterID={cluster.id} refreshCluster={this.refresh} />
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
            <Support />
          </TabContent>
        }
        {displayMachinePoolsTab && (
          <TabContent
            eventKey={6}
            id="machinePoolsContent"
            ref={this.machinePoolsTabRef}
            aria-label="Machine pools"
          >
            <MachinePools cluster={cluster} />
          </TabContent>
        )}
        {displayUpgradeSettingsTab && (
          <TabContent
            eventKey={8}
            id="upgradeSettingsContent"
            ref={this.upgradeSettingsTabRef}
            aria-label="Upgrade settings"
          >
            <UpgradeSettingsTab />
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
            <BareMetalHostsClusterDetailTab
              cluster={cluster}
              isVisible={selectedTab === 'addBareMetalHosts'}
            />
          </TabContent>
        )}
        <ScaleClusterDialog onClose={onDialogClose} />
        <EditNodeCountModal onClose={onDialogClose} />
        <EditDisplayNameDialog onClose={onDialogClose} />
        <EditCCSCredentialsDialog onClose={onDialogClose} />
        <UnarchiveClusterDialog onClose={onDialogClose} />
        <EditConsoleURLDialog onClose={onDialogClose} />
        <TransferClusterOwnershipDialog onClose={onDialogClose} />
        <EditSubscriptionSettingsDialog onClose={onDialogClose} isDialog />
        <ArchiveClusterDialog onClose={onDialogClose} />
        <ToggleClusterAdminAccessDialog onClose={onDialogClose} />
        <DeleteClusterDialog onClose={(shouldRefresh) => {
          if (shouldRefresh) {
            invalidateClusters();
            history.push('/');
          }
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
        <UpgradeWizard />
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
  canAllowClusterAdmin: PropTypes.bool.isRequired,
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
  upgradesEnabled: PropTypes.bool,
  assistedInstallerEnabled: PropTypes.bool,
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
