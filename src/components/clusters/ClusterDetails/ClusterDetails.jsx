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
import result from 'lodash/result';
import isUuid from 'uuid-validate';
import { Redirect } from 'react-router';
import get from 'lodash/get';

import { EmptyState, PageSection, TabContent } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import ClusterDetailsTop from './components/ClusterDetailsTop';
import TabsRow from './components/TabsRow';
import Overview from './components/Overview/Overview';
import LogWindow from './components/LogWindow';
import Monitoring from './components/Monitoring';
import Users from './components/Users';
import AddOns from './components/AddOns';
import IdentityProvidersModal from './components/IdentityProvidersModal';
import DeleteIDPDialog from './components/DeleteIDPDialog';

import EditClusterDialog from '../common/EditClusterDialog';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import EditConsoleURLDialog from '../common/EditConsoleURLDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog/DeleteClusterDialog';

import ErrorBox from '../../common/ErrorBox';
import { isValid } from '../../../common/helpers';
import ArchiveClusterDialog from '../common/ArchiveClusterDialog';
import UnarchiveClusterDialog from '../common/UnarchiveClusterDialog';
import getClusterName from '../../../common/getClusterName';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';

class ClusterDetails extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.refreshIDP = this.refreshIDP.bind(this);

    this.overviewTabRef = React.createRef();
    this.monitoringTabRef = React.createRef();
    this.usersTabRef = React.createRef();
    this.logsTabRef = React.createRef();
    this.addOnsTabRef = React.createRef();
  }

  componentDidMount() {
    document.title = 'Red Hat OpenShift Cluster Manager';

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

    if (result(clusterDetails, 'cluster.id') === clusterID) {
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
      addOns,
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

    const isPending = ((result(cluster, 'id') !== requestedClusterID) && !clusterDetails.error) || clusterIdentityProviders.pending;

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
    if (clusterDetails.error && (!cluster || result(cluster, 'id') !== requestedClusterID)) {
      if (clusterDetails.errorCode === 404) {
        setGlobalError((
          <React.Fragment>
            Cluster
            {' '}
            <b>{requestedClusterID}</b>
            {' '}
            was not found, it might have been deleted or you don&apos;t have permission to see it.
          </React.Fragment>
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
    const hasAddOns = !!get(addOns, 'items.length', false);
    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;

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
            displayUsersTab={cluster.managed && cluster.canEdit}
            displayMonitoringTab={!isArchived}
            displayAddOnsTab={cluster.managed && hasAddOns}
            overviewTabRef={this.overviewTabRef}
            monitoringTabRef={this.monitoringTabRef}
            usersTabRef={this.usersTabRef}
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

        <TabContent eventKey={2} id="usersTabContent" ref={this.usersTabRef} aria-label="Users" hidden>
          <Users clusterID={cluster.id} />
        </TabContent>
        {hasLogs && (
        <TabContent eventKey={3} id="logsTabContent" ref={this.logsTabRef} aria-label="Logs" hidden>
          <LogWindow clusterID={cluster.id} />
        </TabContent>
        )}
        {hasAddOns && (
        <TabContent eventKey={4} id="addOnsTabContent" ref={this.addOnsTabRef} aria-label="Add-ons" hidden>
          <AddOns clusterID={cluster.id} />
        </TabContent>
        )}
        <EditClusterDialog onClose={onDialogClose} />
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
        <IdentityProvidersModal clusterID={cluster.id} onClose={() => this.refreshIDP()} />
        <DeleteIDPDialog onClose={() => {
          this.refreshIDP();
          onDialogClose();
        }
          }
        />
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
  getUsers: PropTypes.func.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  getClusterIdentityProviders: PropTypes.func.isRequired,
  logs: PropTypes.object,
  addOns: PropTypes.object,
  clusterIdentityProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.object,
    error: PropTypes.bool,
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
