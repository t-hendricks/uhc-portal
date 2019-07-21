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

import { TabContent, EmptyState } from '@patternfly/react-core';

import SubscriptionCompliancy from './components/SubscriptionCompliancy';
import ClusterDetailsTop from './components/ClusterDetailsTop';
import TabsRow from './components/TabsRow';
import Overview from './components/Overview/Overview';
import LogWindow from './components/LogWindow';
import Users from './components/Users';
import IdentityProvidersModal from './components/IdentityProvidersModal';
import DeleteIDPDialog from './components/DeleteIDPDialog';

import LoadingModal from '../../common/LoadingModal';
import EditClusterDialog from '../common/EditClusterDialog';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog/DeleteClusterDialog';

import ErrorBox from '../../common/ErrorBox';
import { isValid } from '../../../common/helpers';

class ClusterDetails extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.refreshIDP = this.refreshIDP.bind(this);

    this.overviewTabRef = React.createRef();
    this.usersTabRef = React.createRef();
    this.logsTabRef = React.createRef();
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
      getOrganization,
      clearGlobalError,
    } = this.props;
    clearGlobalError('clusterDetails');

    const clusterID = match.params.id;
    this.refresh();

    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
    if (!clusterIdentityProviders.pending
       && !clusterIdentityProviders.error
       && !clusterIdentityProviders.fulfilled) {
      getClusterIdentityProviders(clusterID); // TODO: get IDP only for managed cluster
    }
    if (!organization.pending && !organization.error && !organization.fulfilled) {
      getOrganization();
    }
  }

  componentDidUpdate(prevProps) {
    const { match, clusterDetails } = this.props;
    const clusterID = match.params.id;
    const oldClusterID = prevProps.match.params.id;

    if (result(clusterDetails, 'cluster.id') === clusterID) {
      const clusterName = clusterDetails.cluster.display_name || clusterDetails.cluster.name || clusterDetails.external_id || 'Unnamed Cluster';
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (clusterID !== oldClusterID && isValid(clusterID)) {
      this.refresh();
    }
  }

  componentWillUnmount() {
    const { resetIdentityProvidersState } = this.props;
    resetIdentityProvidersState();
  }

  refresh() {
    const {
      match,
      fetchDetails,
      fetchRouterShards,
      getLogs,
      getUsers,
    } = this.props;
    const clusterID = match.params.id;

    if (isValid(clusterID)) {
      fetchDetails(clusterID);
      fetchRouterShards(clusterID);
      getLogs(clusterID);
      getUsers(clusterID, 'dedicated-admins');
    }
  }

  refreshIDP() {
    const { match, clusterIdentityProviders, getClusterIdentityProviders } = this.props;
    const clusterID = match.params.id;

    if (!clusterIdentityProviders.pending
      && !clusterIdentityProviders.error) {
      getClusterIdentityProviders(clusterID);
    }
  }

  render() {
    const {
      clusterDetails,
      cloudProviders,
      routerShards,
      fetchDetails,
      fetchRouterShards,
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

    const requestedClusterID = match.params.id;

    // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
    // the redux state will have the data for the previous cluster. We want to ensure we only
    // show data for the requested cluster, so different data should be marked as pending.

    const isPending = (result(cluster, 'id') !== requestedClusterID) && !clusterDetails.error;

    const loadingModal = (<LoadingModal>Loading cluster details...</LoadingModal>);

    const errorState = () => (
      <EmptyState>
        <ErrorBox message="Error retrieving cluster details" response={clusterDetails} />
        {isPending && loadingModal}
      </EmptyState>
    );

    if (isPending) {
      return loadingModal;
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
      fetchRouterShards(cluster.id);
    };

    return (
      <div id="clusterdetails-content">
        <SubscriptionCompliancy
          cluster={cluster}
          organization={organization}
        />
        <ClusterDetailsTop
          cluster={cluster}
          openModal={openModal}
          pending={clusterDetails.pending}
          routerShards={routerShards}
          refreshFunc={this.refresh}
          clusterIdentityProviders={clusterIdentityProviders}
          organization={organization}
          error={clusterDetails.error}
          errorMessage={clusterDetails.errorMessage}
        >
          <TabsRow
            displayLogs={!!logs.lines}
            displayUsersTab={cluster.managed && cluster.canEdit}
            overviewTabRef={this.overviewTabRef}
            usersTabRef={this.usersTabRef}
            logsTabRef={this.logsTabRef}
          />
        </ClusterDetailsTop>
        <TabContent eventKey={0} id="overviewTabContent" ref={this.overviewTabRef} aria-label="Overview">
          <Overview
            cluster={cluster}
            cloudProviders={cloudProviders}
            routerShards={routerShards}
          />
        </TabContent>
        <TabContent eventKey={1} id="usersTabContent" ref={this.usersTabRef} aria-label="Users" hidden>
          <Users clusterID={cluster.id} />
        </TabContent>
        <TabContent eventKey={2} id="logsTabContent" ref={this.logsTabRef} aria-label="Logs" hidden>
          <LogWindow clusterID={cluster.id} />
        </TabContent>
        <EditClusterDialog onClose={onDialogClose} />
        <EditDisplayNameDialog onClose={onDialogClose} />
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
      </div>
    );
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  fetchRouterShards: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired,
  getLogs: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  routerShards: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  getClusterIdentityProviders: PropTypes.func.isRequired,
  logs: PropTypes.object,
  clusterIdentityProviders: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.object,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
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
};

export default ClusterDetails;
