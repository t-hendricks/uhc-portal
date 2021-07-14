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
import {
  Route, Redirect, Switch, withRouter,
} from 'react-router-dom';
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
import CreateOSDWizard from '../clusters/CreateOSDPage/CreateOSDWizard';
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
import InstallVSphereUPI from '../clusters/install/InstallVSphereUPI';
import InstallVSphereIPI from '../clusters/install/InstallVSphereIPI';
import InstallVSphere from '../clusters/install/InstallVSphere';
import InstallPreRelease from '../clusters/install/InstallPreRelease';
import InstallPullSecret from '../clusters/install/InstallPullSecret';
import ConnectedInstallPullSecretAzure from '../clusters/install/InstallPullSecretAzure';
import InstallIBM from '../clusters/install/InstallIBM';
import InstallPower from '../clusters/install/InstallPower';
import DownloadsPage from '../downloads/DownloadsPage';
import Tokens from '../tokens/Tokens';
import TokensROSA from '../tokens/TokensROSA';
import NotFoundError from './NotFoundError';
import Quota from '../quota';
import Insights from './Insights';
import CloudProviderSelection from '../clusters/CreateOSDPage/CloudProviderSelection';
import withFeatureGate from '../features/with-feature-gate';
import { ASSISTED_INSTALLER_FEATURE } from '../../redux/constants/featureConstants';
import InstallBMUPI from '../clusters/install/InstallBareMetalUPI';
import InstallBMIPI from '../clusters/install/InstallBareMetalIPI';
import { normalizedProducts } from '../../common/subscriptionTypes';
import Releases from '../releases/index';
import InstallAwsARM from '../clusters/install/InstallAwsARM';

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

              When adding new top-level entries to left navigation, see also getNavClickParams.js.
            */}
            <Redirect from="/install/osp/installer-provisioned" to="/install/openstack/installer-provisioned" />
            <Redirect from="/install/crc/installer-provisioned" to="/create/local" />
            <Redirect from="/token/moa" to="/token/rosa" />
            <Redirect from="/insights" to="/overview" />
            <Redirect from="/subscriptions" to="/quota" />
            <Route path="/downloads" component={DownloadsPage} />

            {/* Each token page has 2 routes with distinct paths, to remember that user wanted
                to see it during page reload that may be needed for elevated auth. */}
            <TermsGuardedRoute
              path="/token/rosa/show"
              history={history}
              render={() => <TokensROSA show />}
            />
            <TermsGuardedRoute
              path="/token/rosa"
              history={history}
              render={() => <TokensROSA show={false} showPath="/token/rosa/show" />}
            />
            <Route path="/token/show" render={() => <Tokens show />} />
            <Route path="/token" render={() => <Tokens show={false} showPath="/token/show" />} />

            <Route path="/install/aws/installer-provisioned" component={InstallAWSIPI} />
            <Route path="/install/aws/user-provisioned" component={InstallAWSUPI} />
            <Route path="/install/aws/arm" component={InstallAwsARM} />
            <Route path="/install/aws" component={InstallAWS} />
            <Route path="/install/gcp/installer-provisioned" component={InstallGCPIPI} />
            <Route path="/install/gcp/user-provisioned" component={InstallGCPUPI} />
            <Route path="/install/gcp" component={InstallGCP} />
            <Route path="/install/openstack/installer-provisioned" component={InstallOSPIPI} />
            <Route path="/install/openstack/user-provisioned" component={InstallOSPUPI} />
            <Route path="/install/openstack" component={InstallOSP} />
            <Route path="/install/rhv/installer-provisioned" component={InstallRHVIPI} />
            <Route path="/install/rhv/user-provisioned" component={InstallRHVUPI} />
            <Route path="/install/rhv" component={InstallRHV} />
            <Route path="/install/azure/installer-provisioned" component={InstallAzureIPI} />
            <Route path="/install/azure/user-provisioned" component={InstallAzureUPI} />
            <Route path="/install/azure" exact component={InstallAzure} />
            <Route path="/install/metal/user-provisioned" component={InstallBMUPI} />
            <Route path="/install/metal/installer-provisioned" component={InstallBMIPI} />
            <Route path="/install/metal" component={GatedMetalInstall} />
            <Route path="/install/vsphere" exact component={InstallVSphere} />
            <Route path="/install/vsphere/user-provisioned" component={InstallVSphereUPI} />
            <Route path="/install/vsphere/installer-provisioned" component={InstallVSphereIPI} />
            <Route path="/install/ibmz/user-provisioned" component={InstallIBM} />
            <Route path="/install/power/user-provisioned" component={InstallPower} />
            <Route path="/install/pre-release" component={InstallPreRelease} />
            <Route path="/install/pull-secret" component={InstallPullSecret} />
            <Route path="/install/azure/aro-provisioned" component={ConnectedInstallPullSecretAzure} />
            <Redirect from="/install" to="/create" />
            <TermsGuardedRoute
              path="/create/osd/aws"
              gobackPath="/create/osd"
              history={history}
              render={() => <CreateOSDPage cloudProviderID="aws" product={normalizedProducts.OSD} />}
            />
            <TermsGuardedRoute
              path="/create/osd/gcp"
              gobackPath="/create/osd"
              history={history}
              render={() => <CreateOSDPage cloudProviderID="gcp" product={normalizedProducts.OSD} />}
            />
            <TermsGuardedRoute path="/create/osdtrial/aws" gobackPath="/create/osdtrial" render={() => <CreateOSDPage cloudProviderID="aws" product={normalizedProducts.OSDTrial} />} history={history} />
            <TermsGuardedRoute path="/create/osdtrial/gcp" gobackPath="/create/osdtrial" render={() => <CreateOSDPage cloudProviderID="gcp" product={normalizedProducts.OSDTrial} />} history={history} />
            <Route path="/create/osdtrial" render={() => <CloudProviderSelection product={normalizedProducts.OSDTrial} />} />
            <Route path="/create/osdwizard" component={CreateOSDWizard} />
            <Route path="/create/osd" render={() => <CloudProviderSelection product={normalizedProducts.OSD} />} />
            <Route path="/create/cloud" render={props => <CreateClusterPage activeTab="cloud" {...props} />} />
            <Route path="/create/datacenter" render={props => <CreateClusterPage activeTab="datacenter" {...props} />} />
            <Route path="/create/local" render={props => <CreateClusterPage activeTab="local" {...props} />} />
            <Route path="/create" component={CreateClusterPage} />
            <Route path="/details/s/:subscriptionID/insights/:reportId/:errorKey" component={InsightsRuleDetails} />
            <Route path="/details/s/:id" component={ClusterDetails} />
            <Route path="/details/:id/insights/:reportId/:errorKey" render={props => <ClusterDetailsRedirector isInsightsRuleDetails {...props} />} />
            <Route path="/details/:id" component={ClusterDetailsRedirector} />
            <Route path="/register" component={RegisterCluster} />
            <Route path="/quota/resource-limits" render={props => <Quota marketplace {...props} />} />
            <Route path="/quota" render={props => <Quota {...props} />} />
            <Route path="/archived" component={ArchivedClusterList} />
            <Route path="/overview" exact component={Overview} />
            <Route path="/releases" exact component={Releases} />
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
