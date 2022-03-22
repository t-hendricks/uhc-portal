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

import { OCM } from 'openshift-assisted-ui-lib';

import TermsGuardedRoute from './TermsGuardedRoute';
import apiRequest from '../../services/apiRequest';
import ApiError from './ApiError';
import Overview from '../overview';
import ClustersList from '../clusters/ClusterList';
import ArchivedClusterList from '../clusters/ArchivedClusterList';
import CreateClusterPage from '../clusters/CreateClusterPage';
import RegisterCluster from '../clusters/RegisterCluster';
import CreateOSDPage from '../clusters/CreateOSDPage';
import CreateOSDWizard from '../clusters/CreateOSDPage/CreateOSDWizard';
import CreateROSAWizard from '../clusters/CreateROSAPage/CreateROSAWizard';
import ConnectedInstallAlibaba from '../clusters/install/InstallAlibaba';
import ConnectedInstallArmAWSIPI from '../clusters/install/InstallArmAWSIPI';
import InstallAWS from '../clusters/install/InstallAWS';
import ConnectedInstallAWSUPI from '../clusters/install/InstallAWSUPI';
import ConnectedInstallAWSIPI from '../clusters/install/InstallAWSIPI';
import InstallBareMetal from '../clusters/install/InstallBareMetal';
import InstallAzure from '../clusters/install/InstallAzure';
import ConnectedInstallASHIPI from '../clusters/install/InstallASHIPI';
import ConnectedInstallAzureIPI from '../clusters/install/InstallAzureIPI';
import ConnectedInstallAzureUPI from '../clusters/install/InstallAzureUPI';
import InstallGCP from '../clusters/install/InstallGCP';
import ConnectedInstallGCPIPI from '../clusters/install/InstallGCPIPI';
import ConnectedInstallGCPUPI from '../clusters/install/InstallGCPUPI';
import ConnectedInstallIBMCloud from '../clusters/install/InstallIBMCloud';
import InstallOSP from '../clusters/install/InstallOSP';
import ConnectedInstallOSPIPI from '../clusters/install/InstallOSPIPI';
import ConnectedInstallOSPUPI from '../clusters/install/InstallOSPUPI';
import InstallRHV from '../clusters/install/InstallRHV';
import ConnectedInstallRHVIPI from '../clusters/install/InstallRHVIPI';
import ConnectedInstallRHVUPI from '../clusters/install/InstallRHVUPI';
import ConnectedInstallVSphereUPI from '../clusters/install/InstallVSphereUPI';
import ConnectedInstallVSphereIPI from '../clusters/install/InstallVSphereIPI';
import InstallVSphere from '../clusters/install/InstallVSphere';
import ConnectedInstallPlatformAgnostic from '../clusters/install/InstallPlatformAgnostic';
import ConnectedInstallPreRelease from '../clusters/install/InstallPreRelease';
import ConnectedInstallPullSecret from '../clusters/install/InstallPullSecret';
import ConnectedInstallPullSecretAzure from '../clusters/install/InstallPullSecretAzure';
import ConnectedInstallIBM from '../clusters/install/InstallIBM';
import ConnectedInstallIBMPreRelease from '../clusters/install/InstallIBMPreRelease';
import ConnectedInstallPower from '../clusters/install/InstallPower';
import ConnectedInstallPowerPreRelease from '../clusters/install/InstallPowerPreRelease';
import ConnectedInstallArmPreRelease from '../clusters/install/InstallArmPreRelease';
import DownloadsPage from '../downloads/DownloadsPage';
import Tokens from '../tokens/Tokens';
import TokensROSA from '../tokens/TokensROSA';
import NotFoundError from './NotFoundError';
import Quota from '../quota';
import Insights from './Insights';
import CloudProviderSelection from '../clusters/CreateOSDPage/CloudProviderSelection';
import withFeatureGate from '../features/with-feature-gate';
import { ASSISTED_INSTALLER_FEATURE, OSD_CREATION_WIZARD_FEATURE } from '../../redux/constants/featureConstants';
import InstallBMUPI from '../clusters/install/InstallBareMetalUPI';
import InstallBMIPI from '../clusters/install/InstallBareMetalIPI';
import InstallArmBMUPI from '../clusters/install/InstallArmBareMetalUPI';
import { normalizedProducts } from '../../common/subscriptionTypes';
import Releases from '../releases/index';
import IdentityProvidersPage from '../clusters/ClusterDetails/components/IdentityProvidersPage';
import CreateROSAWelcome from '../clusters/CreateROSAPage/CreateROSAWelcome';
import EntitlementConfig from '../common/EntitlementConfig/index';
import InsightsAdvisorRedirector from '../clusters/InsightsAdvisorRedirector';
import ClusterDetailsSubscriptionId from '../clusters/ClusterDetails/ClusterDetailsSubscriptionId';
import ClusterDetailsClusterOrExternalId from '../clusters/ClusterDetails/ClusterDetailsClusterOrExternalId';

const { AssistedUiRouter } = OCM;

const GatedAssistedUiRouter = withFeatureGate(AssistedUiRouter, ASSISTED_INSTALLER_FEATURE);
const GatedMetalInstall = withFeatureGate(
  InstallBareMetal, ASSISTED_INSTALLER_FEATURE, InstallBMUPI, InstallBMIPI,
);
const GatedCreationWizard = withFeatureGate(
  CreateOSDWizard, OSD_CREATION_WIZARD_FEATURE, CloudProviderSelection,
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
              render={() => (
                <>
                  <TokensROSA show />
                  <EntitlementConfig />
                </>
              )}
            />
            <TermsGuardedRoute
              path="/token/rosa"
              history={history}
              render={() => (
                <>
                  <TokensROSA show={false} showPath="/token/rosa/show" />
                  <EntitlementConfig />
                </>
              )}
            />
            <Route path="/token/show" render={() => <Tokens show />} />
            <Route path="/token" render={() => <Tokens show={false} showPath="/token/show" />} />

            <Route path="/install/alibaba/installer-provisioned" component={ConnectedInstallAlibaba} />
            <Route path="/install/arm/pre-release" component={ConnectedInstallArmPreRelease} />
            <Route path="/install/aws/installer-provisioned" component={ConnectedInstallAWSIPI} />
            <Route path="/install/aws/user-provisioned" component={ConnectedInstallAWSUPI} />
            <Route path="/install/aws/arm" component={ConnectedInstallArmAWSIPI} />
            <Route path="/install/arm" component={InstallArmBMUPI} />
            <Route path="/install/aws" component={InstallAWS} />
            <Route path="/install/gcp/installer-provisioned" component={ConnectedInstallGCPIPI} />
            <Route path="/install/gcp/user-provisioned" component={ConnectedInstallGCPUPI} />
            <Route path="/install/gcp" component={InstallGCP} />
            <Route path="/install/openstack/installer-provisioned" component={ConnectedInstallOSPIPI} />
            <Route path="/install/openstack/user-provisioned" component={ConnectedInstallOSPUPI} />
            <Route path="/install/openstack" component={InstallOSP} />
            <Route path="/install/rhv/installer-provisioned" component={ConnectedInstallRHVIPI} />
            <Route path="/install/rhv/user-provisioned" component={ConnectedInstallRHVUPI} />
            <Route path="/install/rhv" component={InstallRHV} />
            <Route path="/install/azure/installer-provisioned" component={ConnectedInstallAzureIPI} />
            <Route path="/install/azure/user-provisioned" component={ConnectedInstallAzureUPI} />
            <Route path="/install/azure" exact component={InstallAzure} />
            <Route path="/install/azure-stack-hub/installer-provisioned" exact component={ConnectedInstallASHIPI} />
            <Route path="/install/metal/user-provisioned" component={InstallBMUPI} />
            <Route path="/install/metal/installer-provisioned" component={InstallBMIPI} />
            <Route path="/install/metal" component={GatedMetalInstall} />
            <Route path="/install/vsphere" exact component={InstallVSphere} />
            <Route path="/install/vsphere/user-provisioned" component={ConnectedInstallVSphereUPI} />
            <Route path="/install/vsphere/installer-provisioned" component={ConnectedInstallVSphereIPI} />
            <Route path="/install/ibm-cloud" component={ConnectedInstallIBMCloud} />
            <Route path="/install/ibmz/user-provisioned" component={ConnectedInstallIBM} />
            <Route path="/install/ibmz/pre-release" component={ConnectedInstallIBMPreRelease} />
            <Route path="/install/power/user-provisioned" component={ConnectedInstallPower} />
            <Route path="/install/power/pre-release" component={ConnectedInstallPowerPreRelease} />
            <Route path="/install/platform-agnostic" component={ConnectedInstallPlatformAgnostic} />
            <Route path="/install/pre-release" component={ConnectedInstallPreRelease} />
            <Route path="/install/pull-secret" component={ConnectedInstallPullSecret} />
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
            <TermsGuardedRoute path="/create/osdtrial" gobackPath="/create" render={() => <GatedCreationWizard product={normalizedProducts.OSDTrial} />} history={history} />
            <TermsGuardedRoute path="/create/osd" gobackPath="/create" render={() => <GatedCreationWizard product={normalizedProducts.OSD} />} history={history} />
            <Route path="/create/cloud" render={props => <CreateClusterPage activeTab="cloud" {...props} />} />
            <Route path="/create/datacenter" render={props => <CreateClusterPage activeTab="datacenter" {...props} />} />
            <Route path="/create/local" render={props => <CreateClusterPage activeTab="local" {...props} />} />
            <TermsGuardedRoute path="/create/rosa/welcome" history={history} render={() => <CreateROSAWelcome />} />
            {/* TODO: ROSA product is not OSD! */}
            <TermsGuardedRoute path="/create/rosa/wizard" history={history} component={CreateROSAWizard} />
            <Route path="/create" component={CreateClusterPage} />
            <Route path="/details/s/:id/insights/:reportId/:errorKey" component={InsightsAdvisorRedirector} />
            <Route path="/details/s/:id/add-idp/:idpTypeName" component={IdentityProvidersPage} />
            <Route path="/details/s/:id/edit-idp/:idpName" render={({ match }) => <IdentityProvidersPage isEditForm match={match} />} />
            <Route path="/details/s/:id" component={ClusterDetailsSubscriptionId} />
            <Route path="/details/:id/insights/:reportId/:errorKey" component={InsightsAdvisorRedirector} />
            <Route path="/details/:id" component={ClusterDetailsClusterOrExternalId} />
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
