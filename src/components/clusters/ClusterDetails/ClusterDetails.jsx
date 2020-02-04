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

import { EmptyState, PageSection, TabContent } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import ClusterDetailsTop from './components/ClusterDetailsTop';
import TabsRow from './components/TabsRow';
import Overview from './components/Overview/Overview';
import LogWindow from './components/LogWindow';
import Monitoring from './components/Monitoring';
import AccessControl from './components/AccessControl/AccessControl';
import AddOns from './components/AddOns';
import IdentityProvidersModal from './components/IdentityProvidersModal';
import DeleteIDPDialog from './components/DeleteIDPDialog';

import ScaleClusterDialog from '../common/ScaleClusterDialog';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import EditConsoleURLDialog from '../common/EditConsoleURLDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog/DeleteClusterDialog';

import ErrorBox from '../../common/ErrorBox';
import { isValid, scrollToTop } from '../../../common/helpers';
import ArchiveClusterDialog from '../common/ArchiveClusterDialog';
import UnarchiveClusterDialog from '../common/UnarchiveClusterDialog';
import getClusterName from '../../../common/getClusterName';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';
import EditDisconnectedClusterDialog from '../common/EditDisconnectedCluster';

class ClusterDetails extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.refreshIDP = this.refreshIDP.bind(this);

    this.overviewTabRef = React.createRef();
    this.monitoringTabRef = React.createRef();
    this.accessControlTabRef = React.createRef();
    this.logsTabRef = React.createRef();
    this.addOnsTabRef = React.createRef();
  }

  componentDidMount() {
    document.title = 'Red Hat OpenShift Cluster Manager';
    scrollToTop();

    const {
      cloudProviders,
      getCloudProviders,
      clusterIdentityProviders,
      getClusterIdentityProviders,
      match,
      organization,
      getOrganizationAndQuota,
      addOns,
      getAddOns,
      clearGlobalError,
    } = this.props;

    clearGlobalError('clusterDetails');

    const clusterID = match.params.id;

    this.refresh();

    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
    if (isValid(clusterID)
      && !isUuid(clusterID)
      && !clusterIdentityProviders.pending
      && !clusterIdentityProviders.error
      && !clusterIdentityProviders.fulfilled) {
      getClusterIdentityProviders(clusterID); // TODO: get IDP only for managed cluster
    }
    if (!organization.pending && !organization.error && !organization.fulfilled) {
      getOrganizationAndQuota();
    }
    if (!addOns.pending && !addOns.error && !addOns.fulfilled) {
      getAddOns();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      match,
      clusterDetails,
    } = this.props;
    const clusterID = match.params.id;
    const oldClusterID = prevProps.match.params.id;

    if (get(clusterDetails, 'cluster.id') === clusterID) {
      const clusterName = getClusterName(clusterDetails.cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (clusterID !== oldClusterID && isValid(clusterID)) {
      this.refresh();
    }
  }

  componentWillUnmount() {
    const { resetIdentityProvidersState, closeModal } = this.props;
    resetIdentityProvidersState();
    closeModal();
  }

  refresh() {
    const {
      match,
      fetchDetails,
      getLogs,
      getUsers,
      getAlerts,
      getNodes,
      getClusterOperators,
      getClusterAddOns,
    } = this.props;
    const clusterID = match.params.id;

    if (isValid(clusterID)) {
      fetchDetails(clusterID);
    }
    if (isValid(clusterID) && !isUuid(clusterID)) {
      getLogs(clusterID);
      getUsers(clusterID, 'dedicated-admins');
      getAlerts(clusterID);
      getNodes(clusterID);
      getClusterOperators(clusterID);
      getClusterAddOns(clusterID);
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

  // Determine if the org has quota for existing add-ons
  hasAddOns() {
    const { addOns, clusterAddOns, organization } = this.props;
    // If cluster already has add-ons installed we can show the tab regardless of quota
    if (get(clusterAddOns, 'items.length', 0)) {
      return true;
    }
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
      fetchDetails,
      invalidateClusters,
      openModal,
      history,
      match,
      logs,
      clusterIdentityProviders,
      organization,
      setGlobalError,
    } = this.props;

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
      <EmptyState>
        <ErrorBox message="Error retrieving cluster details" response={clusterDetails} />
        {isPending && <Spinner />}
      </EmptyState>
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
        history.push('/');
      }
      return errorState();
    }

    const onDialogClose = () => {
      invalidateClusters();
      fetchDetails(cluster.id);
    };

    const hasLogs = !!logs.lines;
    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
    const displayAddOnsTab = cluster.managed && this.hasAddOns();

    const consoleURL = get(cluster, 'console.url');
    const displayAccessControlTab = cluster.managed && cluster.canEdit && !!consoleURL;

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
        >
          <TabsRow
            displayLogs={hasLogs}
            displayAccessControlTab={displayAccessControlTab}
            displayMonitoringTab={!isArchived}
            displayAddOnsTab={displayAddOnsTab}
            overviewTabRef={this.overviewTabRef}
            monitoringTabRef={this.monitoringTabRef}
            accessControlTabRef={this.accessControlTabRef}
            logsTabRef={this.logsTabRef}
            addOnsTabRef={this.addOnsTabRef}
          />
        </ClusterDetailsTop>
        <TabContent eventKey={0} id="overviewTabContent" ref={this.overviewTabRef} aria-label="Overview">
          <Overview
            cluster={cluster}
            cloudProviders={cloudProviders}
          />
        </TabContent>
        {!isArchived && (
          <TabContent eventKey={1} id="monitoringTabContent" ref={this.monitoringTabRef} aria-label="Monitoring" hidden>
            <Monitoring cluster={cluster} />
          </TabContent>
        )}
        { displayAccessControlTab && (
          <TabContent eventKey={2} id="accessControlTabContent" ref={this.accessControlTabRef} aria-label="Access Control" hidden>
            <AccessControl clusterID={cluster.id} clusterConsoleURL={consoleURL} />
          </TabContent>
        )}
        {displayAddOnsTab && (
        <TabContent eventKey={3} id="addOnsTabContent" ref={this.addOnsTabRef} aria-label="Add-ons" hidden>
          <AddOns clusterID={cluster.id} />
        </TabContent>
        )}
        {hasLogs && (
        <TabContent eventKey={4} id="logsTabContent" ref={this.logsTabRef} aria-label="Logs" hidden>
          <LogWindow clusterID={cluster.id} />
        </TabContent>
        )}
        <ScaleClusterDialog onClose={onDialogClose} />
        <EditDisplayNameDialog onClose={onDialogClose} />
        <ArchiveClusterDialog onClose={onDialogClose} />
        <UnarchiveClusterDialog onClose={onDialogClose} />
        <EditConsoleURLDialog onClose={onDialogClose} />
        <DeleteClusterDialog onClose={(shouldRefresh) => {
          if (shouldRefresh) {
            invalidateClusters();
            history.push('/');
          }
        }}
        />
        <IdentityProvidersModal
          clusterID={cluster.id}
          clusterName={getClusterName(cluster)}
          clusterConsoleURL={consoleURL}
          refreshParent={this.refreshIDP}
        />
        <DeleteIDPDialog refreshParent={this.refreshIDP} />
        <EditDisconnectedClusterDialog onClose={onDialogClose} />
      </PageSection>
    );
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getLogs: PropTypes.func.isRequired,
  getAlerts: PropTypes.func.isRequired,
  getNodes: PropTypes.func.isRequired,
  getClusterOperators: PropTypes.func.isRequired,
  getAddOns: PropTypes.func.isRequired,
  getClusterAddOns: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  getClusterIdentityProviders: PropTypes.func.isRequired,
  logs: PropTypes.object,
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
    history: PropTypes.object,
    pending: PropTypes.bool.isRequired,
  }),
  resetIdentityProvidersState: PropTypes.func.isRequired,
  setGlobalError: PropTypes.func.isRequired,
  clearGlobalError: PropTypes.func.isRequired,
};

ClusterDetails.defaultProps = {
  clusterDetails: {
    cluster: null,
    error: false,
    errorMessage: '',
  },
  logs: '',
  addOns: '',
};

export default ClusterDetails;
