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
  Alert, Row, Col, EmptyState, Grid,
} from 'patternfly-react';

import AlphaNotice from '../../common/AlphaNotice';

import ClusterDetailsTop from './components/ClusterDetailsTop';
import ResourceUsage from './components/ResourceUsage/ResourceUsage';
import DetailsLeft from './components/DetailsLeft';
import DetailsRight from './components/DetailsRight';

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
    const { cloudProviders, getCloudProviders } = this.props;

    this.refresh();
    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const clusterID = match.params.id;
    const oldClusterID = prevProps.match.params.id;

    if (clusterID !== oldClusterID && isValid(clusterID)) {
      this.refresh();
    }
  }

  refresh() {
    const {
      match, fetchDetails, fetchCredentials, fetchRouterShards,
    } = this.props;
    const clusterID = match.params.id;

    if (isValid(clusterID)) {
      fetchDetails(clusterID);
      fetchCredentials(clusterID);
      fetchRouterShards(clusterID);
    }
  }

  render() {
    const {
      clusterDetails,
      cloudProviders,
      credentials,
      routerShards,
      fetchDetails,
      invalidateClusters,
      openModal,
      history,
      match,
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
          <ResourceUsage cluster={cluster} />
          <Grid fluid>
            <div className="cl-details-card">
              <div className="cl-details-card-title"><h3>Details</h3></div>
              <div className="cl-details-card-body">
                <Row>
                  <Col sm={6}>
                    <DetailsLeft cluster={cluster} cloudProviders={cloudProviders} />
                  </Col>
                  <Col sm={6}>
                    <DetailsRight cluster={cluster} routerShards={routerShards} />
                  </Col>
                </Row>
              </div>
            </div>
          </Grid>
          {/* {dialogs} */}
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
  invalidateClusters: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  routerShards: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
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
};

export default ClusterDetails;
