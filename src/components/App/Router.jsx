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

import { AssistedUiRouter } from 'openshift-assisted-ui-lib';

import TermsGuardedRoute from './TermsGuardedRoute';
import apiRequest from '../../services/apiRequest';
import ApiError from './ApiError';
import Overview from '../overview';
import ClustersList from '../clusters/ClusterList';
import ArchivedClusterList from '../clusters/ArchivedClusterList';
import ClusterDetails from '../clusters/ClusterDetails';
import ClusterDetailsRedirector from '../clusters/ClusterDetailsRedirector';
import InsightsRuleDetails from '../clusters/InsightsRuleDetails';
import CreateClusterPage from '../clusters/CreateClusterPage';
import RegisterCluster from '../clusters/RegisterCluster';
import CreateOSDPage from '../clusters/CreateOSDPage';
import InstallAWS from '../clusters/install/InstallAWS';
import InstallAWSUPI from '../clusters/install/InstallAWSUPI';
import InstallAWSIPI from '../clusters/install/InstallAWSIPI';
import InstallBareMetal from '../clusters/install/InstallBareMetal';
import InstallAzure from '../clusters/install/InstallAzure';
import InstallAzureIPI from '../clusters/install/InstallAzureIPI';
import InstallAzureUPI from '../clusters/install/InstallAzureUPI';
import InstallGCP from '../clusters/install/InstallGCP';
import InstallGCPIPI from '../clusters/install/InstallGCPIPI';
import InstallGCPUPI from '../clusters/install/InstallGCPUPI';
import InstallOSP from '../clusters/install/InstallOSP';
import InstallOSPIPI from '../clusters/install/InstallOSPIPI';
import InstallOSPUPI from '../clusters/install/InstallOSPUPI';
import InstallRHV from '../clusters/install/InstallRHV';
import InstallRHVIPI from '../clusters/install/InstallRHVIPI';
import InstallRHVUPI from '../clusters/install/InstallRHVUPI';
import InstallVSphere from '../clusters/install/InstallVSphere';
import InstallPreRelease from '../clusters/install/InstallPreRelease';
import InstallPullSecret from '../clusters/install/InstallPullSecret';
import InstallPullSecretAzure from '../clusters/install/InstallPullSecretAzure';
import InstallIBM from '../clusters/install/InstallIBM';
import InstallPower from '../clusters/install/InstallPower';
import Tokens from '../tokens/Tokens';
import TokensROSA from '../tokens/TokensROSA';
import NotFoundError from './NotFoundError';
import Subscriptions from '../subscriptions';
import Insights from './Insights';
import CloudProviderSelection from '../clusters/CreateOSDPage/CloudProviderSelection';
import withFeatureGate from '../features/with-feature-gate';
import { ASSISTED_INSTALLER_FEATURE } from '../../redux/constants/featureConstants';
import InstallBMUPI from '../clusters/install/InstallBareMetalUPI';
import InstallBMIPI from '../clusters/install/InstallBareMetalIPI';

const GatedAssistedUiRouter = withFeatureGate(AssistedUiRouter, ASSISTED_INSTALLER_FEATURE);
const GatedMetalInstall = withFeatureGate(
  InstallBareMetal, ASSISTED_INSTALLER_FEATURE, InstallBMUPI, InstallBMIPI,
);

function Router({ history }) {
  return (
    <>
      <Insights history={history} />
      <ConnectedRouter history={history}>
        <ApiError history={history} apiRequest={apiRequest}>
          <Switch>
            {/*
              IMPORTANT!
              When adding new routes, make sure to add the route both here and in Router.test.jsx,
              to ensure the route is tested.
            */}
            <Redirect from="/install/osp/installer-provisioned" to="/install/openstack/installer-provisioned" />
            <Redirect from="/install" to="create" />
            <Redirect from="/token/moa" to="/token/rosa" />
            <TermsGuardedRoute path="/token/rosa" component={TokensROSA} history={history} />
            <Route path="/token" component={Tokens} />
            <Route path="/create/aws/installer-provisioned" component={InstallAWSIPI} />
            <Route path="/create/aws/user-provisioned" component={InstallAWSUPI} />
            <Route path="/create/aws" component={InstallAWS} />
            <Route path="/create/gcp/installer-provisioned" component={InstallGCPIPI} />
            <Route path="/create/gcp/user-provisioned" component={InstallGCPUPI} />
            <Route path="/create/gcp" component={InstallGCP} />
            <Route path="/create/openstack/installer-provisioned" component={InstallOSPIPI} />
            <Route path="/create/openstack/user-provisioned" component={InstallOSPUPI} />
            <Route path="/create/openstack" component={InstallOSP} />
            <Route path="/create/rhv/installer-provisioned" component={InstallRHVIPI} />
            <Route path="/create/rhv/user-provisioned" component={InstallRHVUPI} />
            <Route path="/create/rhv" component={InstallRHV} />
            <Route path="/create/azure/installer-provisioned" component={InstallAzureIPI} />
            <Route path="/create/azure/user-provisioned" component={InstallAzureUPI} />
            <Route path="/create/azure" exact component={InstallAzure} />
            <Route path="/create/metal/user-provisioned" component={InstallBMUPI} />
            <Route path="/create/metal/installer-provisioned" component={InstallBMIPI} />
            <Route path="/create/metal" component={GatedMetalInstall} />
            <Route path="/create/vsphere/user-provisioned" component={InstallVSphere} />
            <Route path="/create/ibmz/user-provisioned" component={InstallIBM} />
            <Route path="/create/power/user-provisioned" component={InstallPower} />
            <Route path="/create/pre-release" component={InstallPreRelease} />
            <Route path="/create/pull-secret" component={InstallPullSecret} />
            <Route path="/create/azure/aro-provisioned" component={InstallPullSecretAzure} />
            <TermsGuardedRoute path="/create/osd/aws" gobackPath="/create/osd" render={() => <CreateOSDPage cloudProviderID="aws" />} history={history} />
            <TermsGuardedRoute path="/create/osd/gcp" gobackPath="/create/osd" render={() => <CreateOSDPage cloudProviderID="gcp" />} history={history} />
            <Route path="/create/osd" component={CloudProviderSelection} />
            <Route path="/create" component={CreateClusterPage} />
            <Route path="/details/:clusterId/insights/:reportId/:errorKey" component={InsightsRuleDetails} />
            <Route path="/details/s/:id" component={ClusterDetails} />
            <Route path="/details/:id" component={ClusterDetailsRedirector} />
            <Route path="/register" component={RegisterCluster} />
            <Route path="/subscriptions" component={Subscriptions} />
            <Route path="/archived" component={ArchivedClusterList} />
            <Route path="/overview" exact component={Overview} />
            <Route path="/assisted-installer" component={GatedAssistedUiRouter} />
            <Route path="/" exact component={ClustersList} />
            <Route component={NotFoundError} />
          </Switch>
        </ApiError>
      </ConnectedRouter>
    </>
  );
}

Router.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default (withRouter(Router));
