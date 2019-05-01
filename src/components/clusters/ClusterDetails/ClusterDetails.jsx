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
import {
  Alert,
  EmptyState,
  TabContainer,
  Nav,
  NavItem,
  TabPane,
  TabContent,
} from 'patternfly-react';

import AlphaNotice from '../../common/AlphaNotice';

import ClusterDetailsTop from './components/ClusterDetailsTop';
import Overview from './components/Overview/Overview';
import LogWindow from './components/LogWindow';

import LoadingModal from '../../common/LoadingModal';
import EditClusterDialog from '../common/EditClusterDialog';
import EditDisplayNameDialog from '../common/EditDisplayNameDialog';
import DeleteClusterDialog from '../common/DeleteClusterDialog/DeleteClusterDialog';

import { isValid } from '../../../common/helpers';

class ClusterDetails extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    document.title = 'Red Hat OpenShift Cluster Manager';

    const { cloudProviders, getCloudProviders } = this.props;

    this.refresh();
    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
  }

  componentDidUpdate(prevProps) {
    const { match, clusterDetails } = this.props;
    const clusterID = match.params.id;
    const oldClusterID = prevProps.match.params.id;

    if (clusterID === oldClusterID && result(clusterDetails, 'cluster.id')) {
      const clusterName = clusterDetails.cluster.display_name || clusterDetails.cluster.name || clusterDetails.external_id || 'Unnamed Cluster';
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (clusterID !== oldClusterID && isValid(clusterID)) {
      this.refresh();
    }
  }

  refresh() {
    const {
      match, fetchDetails, fetchCredentials, fetchRouterShards, getLogs,
    } = this.props;
    const clusterID = match.params.id;

    if (isValid(clusterID)) {
      fetchDetails(clusterID);
      fetchCredentials(clusterID);
      fetchRouterShards(clusterID);
      getLogs(clusterID);
    }
  }

  render() {
    const {
      clusterDetails,
      cloudProviders,
      credentials,
      routerShards,
      fetchDetails,
      fetchRouterShards,
      invalidateClusters,
      openModal,
      history,
      match,
      logs,
    } = this.props;

    const { cluster } = clusterDetails;

    const requestedClusterID = match.params.id;

    // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
    // the redux state will have the data for the previous cluster. We want to ensure we only
    // show data for the requested cluster, so different data should be marked as pending.

    const isPending = (result(cluster, 'id') !== requestedClusterID) && !clusterDetails.error;

    const loadingModal = (<LoadingModal>Loading cluster details...</LoadingModal>);

    const errorState = (
      <EmptyState>
        <Alert type="error">
          <span>{`Error retrieving cluster details: ${clusterDetails.errorMessage}`}</span>
        </Alert>
        {isPending ? loadingModal : false}
      </EmptyState>
    );

    if (isPending) {
      return loadingModal;
    }

    if (clusterDetails.error) {
      return errorState;
    }

    const onDialogClose = () => {
      invalidateClusters();
      fetchDetails(cluster.id);
      fetchRouterShards(cluster.id);
    };

    return (
      <div>
        <AlphaNotice />
        <div id="clusterdetails-content">
          <ClusterDetailsTop
            cluster={cluster}
            credentials={credentials}
            openModal={openModal}
            pending={clusterDetails.pending}
            routerShards={routerShards}
            refreshFunc={this.refresh}
          />
          <TabContainer id="cluster-details-tabs" defaultActiveKey={1}>
            <React.Fragment>
              <Nav bsClass="nav nav-tabs nav-tabs-pf">
                <NavItem eventKey={1}>
                  Overview
                </NavItem>
                {logs.lines && (
                <NavItem eventKey={2}>
                  Logs
                </NavItem>
                )}
              </Nav>
              <TabContent animation>
                <TabPane eventKey={1}>
                  <Overview
                    cluster={cluster}
                    cloudProviders={cloudProviders}
                    routerShards={routerShards}
                  />
                </TabPane>
                {logs.lines && (
                <TabPane eventKey={2}>
                  <LogWindow clusterID={cluster.id} />
                </TabPane>
                )}
              </TabContent>
            </React.Fragment>
          </TabContainer>
          <EditClusterDialog onClose={onDialogClose} />
          <EditDisplayNameDialog onClose={onDialogClose} />
          <DeleteClusterDialog onClose={(shouldRefresh) => {
            if (shouldRefresh) {
              invalidateClusters();
              history.push('/');
            }
          }}
          />
        </div>
      </div>
    );
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  fetchCredentials: PropTypes.func.isRequired,
  fetchRouterShards: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  getLogs: PropTypes.func.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  routerShards: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  logs: PropTypes.object,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.object,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    history: PropTypes.object,
    pending: PropTypes.bool.isRequired,
  }),
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
