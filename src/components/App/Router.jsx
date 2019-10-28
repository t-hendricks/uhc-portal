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
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import ClustersList from '../clusters/ClusterList';
import ArchivedClusterList from '../clusters/ArchivedClusterList';
import ClusterDetails from '../clusters/ClusterDetails';
import CreateCluster from '../clusters/CreateCluster';
import RegisterCluster from '../clusters/RegisterCluster';
import CreateOSDCluster from '../clusters/CreateOSDCluster';
import InstallInfrastructure from '../clusters/install/InstallInfrastructure';
import InstallAWS from '../clusters/install/InstallAWS';
import InstallAWSUPI from '../clusters/install/InstallAWSUPI';
import InstallAWSIPI from '../clusters/install/InstallAWSIPI';
import InstallBareMetal from '../clusters/install/InstallBareMetal';
import InstallAzure from '../clusters/install/InstallAzure';
import InstallGCP from '../clusters/install/InstallGCP';
import InstallOSP from '../clusters/install/InstallOSP';
import InstallVSphere from '../clusters/install/InstallVSphere';
import InstallPreRelease from '../clusters/install/InstallPreRelease';
import InstallPullSecret from '../clusters/install/InstallPullSecret';
import InstallCRC from '../clusters/install/InstallCRC';
import Tokens from '../tokens/Tokens';
import NotFoundError from './NotFoundError';
import Subscriptions from '../subscriptions';

function Router(props) {
  const { history } = props;

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Redirect from="/install/osp/installer-provisioned" to="/install/openstack/installer-provisioned" />
        <Route path="/token" component={Tokens} />
        <Route path="/install/aws/installer-provisioned" component={InstallAWSIPI} />
        <Route path="/install/aws/user-provisioned" component={InstallAWSUPI} />
        <Route path="/install/aws" component={InstallAWS} />
        <Route path="/install/gcp/installer-provisioned" component={InstallGCP} />
        <Route path="/install/openstack/installer-provisioned" component={InstallOSP} />
        <Route path="/install/azure/installer-provisioned" component={InstallAzure} />
        <Route path="/install/metal/user-provisioned" component={InstallBareMetal} />
        <Route path="/install/vsphere/user-provisioned" component={InstallVSphere} />
        <Route path="/install/crc/installer-provisioned" component={InstallCRC} />
        <Route path="/install/pre-release" component={InstallPreRelease} />
        <Route path="/install/pull-secret" component={InstallPullSecret} />
        <Route path="/install" component={InstallInfrastructure} />
        <Route path="/details/:id" component={ClusterDetails} />
        <Route path="/create/osd" component={CreateOSDCluster} />
        <Route path="/create" component={CreateCluster} />
        <Route path="/register" component={RegisterCluster} />
        <Route path="/subscriptions" component={Subscriptions} />
        <Route path="/archived" component={ArchivedClusterList} />
        <Route path="/" exact component={ClustersList} />
        <Route component={NotFoundError} />
      </Switch>
    </ConnectedRouter>
  );
}

Router.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default (withRouter(Router));
