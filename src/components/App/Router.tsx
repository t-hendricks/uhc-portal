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

import * as OCM from '@openshift-assisted/ui-lib/ocm';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { ConnectedRouter } from 'connected-react-router';
import get from 'lodash/get';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useLocation,
  withRouter,
} from 'react-router-dom';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { normalizedProducts } from '../../common/subscriptionTypes';
import {
  ASSISTED_INSTALLER_FEATURE,
  HYPERSHIFT_WIZARD_FEATURE,
  OSD_WIZARD_V1,
  OSD_WIZARD_V2_FEATURE,
} from '../../redux/constants/featureConstants';
import apiRequest from '../../services/apiRequest';
import ArchivedClusterList from '../clusters/ArchivedClusterList';
import ClusterDetailsClusterOrExternalId from '../clusters/ClusterDetails/ClusterDetailsClusterOrExternalId';
import ClusterDetailsSubscriptionId from '../clusters/ClusterDetails/ClusterDetailsSubscriptionId';
import IdentityProvidersPage from '../clusters/ClusterDetails/components/IdentityProvidersPage';
import ClustersList from '../clusters/ClusterList';
import CreateClusterPage from '../clusters/CreateClusterPage';
import CreateOSDWizard from '../clusters/CreateOSDPage/CreateOSDWizard';
import CreateROSAWizard from '../clusters/CreateROSAPage/CreateROSAWizard';
import GetStartedWithROSA from '../clusters/CreateROSAPage/CreateROSAWizard/CreateRosaGetStarted';
import InsightsAdvisorRedirector from '../clusters/InsightsAdvisorRedirector';
import RegisterCluster from '../clusters/RegisterCluster';
import InstallASH from '../clusters/install/InstallASH';
import ConnectedInstallASHIPI from '../clusters/install/InstallASHIPI';
import ConnectedInstallASHUPI from '../clusters/install/InstallASHUPI';
import InstallAWS from '../clusters/install/InstallAWS';
import ConnectedInstallAWSIPI from '../clusters/install/InstallAWSIPI';
import ConnectedInstallAWSUPI from '../clusters/install/InstallAWSUPI';
import ConnectedInstallAlibaba from '../clusters/install/InstallAlibaba';
import InstallArmAWS from '../clusters/install/InstallArmAWS';
import ConnectedInstallArmAWSIPI from '../clusters/install/InstallArmAWSIPI';
import ConnectedInstallArmAWSUPI from '../clusters/install/InstallArmAWSUPI';
import ConnectedInstallArmAzureIPI from '../clusters/install/InstallArmAzureIPI';
import InstallArmBareMetal from '../clusters/install/InstallArmBareMetal';
import InstallArmBMIPI from '../clusters/install/InstallArmBareMetalIPI';
import InstallArmBMUPI from '../clusters/install/InstallArmBareMetalUPI';
import ConnectedInstallArmPreRelease from '../clusters/install/InstallArmPreRelease';
import InstallAzure from '../clusters/install/InstallAzure';
import ConnectedInstallAzureIPI from '../clusters/install/InstallAzureIPI';
import ConnectedInstallAzureUPI from '../clusters/install/InstallAzureUPI';
import InstallBareMetal from '../clusters/install/InstallBareMetal';
import InstallBMABI from '../clusters/install/InstallBareMetalABI';
import InstallBMIPI from '../clusters/install/InstallBareMetalIPI';
import InstallBMUPI from '../clusters/install/InstallBareMetalUPI';
import InstallGCP from '../clusters/install/InstallGCP';
import ConnectedInstallGCPIPI from '../clusters/install/InstallGCPIPI';
import ConnectedInstallGCPUPI from '../clusters/install/InstallGCPUPI';
import ConnectedInstallIBMCloud from '../clusters/install/InstallIBMCloud';
import InstallIBMZ from '../clusters/install/InstallIBMZ';
import ConnectedInstallIBMZPreRelease from '../clusters/install/InstallIBMZPreRelease';
import ConnectedInstallIBMZUPI from '../clusters/install/InstallIBMZUPI';
import ConnectedInstallMultiAWSIPI from '../clusters/install/InstallMultiAWSIPI';
import ConnectedInstallMultiAzureIPI from '../clusters/install/InstallMultiAzureIPI';
import InstallMultiBMUPI from '../clusters/install/InstallMultiBareMetalUPI';
import ConnectedInstallMultiPreRelease from '../clusters/install/InstallMultiPreRelease';
import InstallNutanix from '../clusters/install/InstallNutanix';
import ConnectedInstallNutanixIPI from '../clusters/install/InstallNutanixIPI';
import InstallOSP from '../clusters/install/InstallOSP';
import ConnectedInstallOSPIPI from '../clusters/install/InstallOSPIPI';
import ConnectedInstallOSPUPI from '../clusters/install/InstallOSPUPI';
import InstallPlatformAgnostic from '../clusters/install/InstallPlatformAgnostic';
import ConnectedInstallPlatformAgnosticABI from '../clusters/install/InstallPlatformAgnosticABI';
import ConnectedInstallPlatformAgnosticUPI from '../clusters/install/InstallPlatformAgnosticUPI';
import InstallPower from '../clusters/install/InstallPower';
import ConnectedInstallPowerPreRelease from '../clusters/install/InstallPowerPreRelease';
import ConnectedInstallPowerUPI from '../clusters/install/InstallPowerUPI';
import InstallPowerVSIPI from '../clusters/install/InstallPowerVirtualServerIPI';
import ConnectedInstallPreRelease from '../clusters/install/InstallPreRelease';
import ConnectedInstallPullSecret from '../clusters/install/InstallPullSecret';
import ConnectedInstallPullSecretAzure from '../clusters/install/InstallPullSecretAzure';
import InstallRHV from '../clusters/install/InstallRHV';
import ConnectedInstallRHVIPI from '../clusters/install/InstallRHVIPI';
import ConnectedInstallRHVUPI from '../clusters/install/InstallRHVUPI';
import InstallVSphere from '../clusters/install/InstallVSphere';
import ConnectedInstallVSphereABI from '../clusters/install/InstallVSphereABI';
import ConnectedInstallVSphereIPI from '../clusters/install/InstallVSphereIPI';
import ConnectedInstallVSphereUPI from '../clusters/install/InstallVSphereUPI';
import { CreateOsdWizard } from '../clusters/wizards';
import EntitlementConfig from '../common/EntitlementConfig/index';
import DownloadsPage from '../downloads/DownloadsPage';
import withFeatureGate from '../features/with-feature-gate';
import Overview from '../overview';
import Quota from '../quota';
import Releases from '../releases/index';
import Tokens from '../tokens';
import TokensROSA from '../tokens/TokensROSA';
import ApiError from './ApiError';
import { AppPage } from './AppPage';
import GovCloudPage from '../clusters/GovCloud/GovCloudPage';
import Insights from './Insights';
import NotFoundError from './NotFoundError';
import TermsGuardedRoute from './TermsGuardedRoute';
import { useFeatures } from './hooks/useFeatures';
import { is404, metadataByRoute } from './routeMetadata';

const { Routes: AssistedInstallerRoutes } = OCM;
const AssistedUiRouterPage: typeof AssistedInstallerRoutes = (props) => (
  <AppPage>
    <AssistedInstallerRoutes {...props} />
  </AppPage>
);

const GatedAssistedUiRouter = withFeatureGate(AssistedUiRouterPage, ASSISTED_INSTALLER_FEATURE);
const GatedMetalInstall = withFeatureGate(
  InstallBareMetal,
  ASSISTED_INSTALLER_FEATURE,
  // TODO remove ts-ignore when `withFeatureGate` and InstallBMUPI are converted to typescript
  // @ts-ignore
  InstallBMUPI, // InstallBMIPI,
);
interface RouterProps extends RouteComponentProps {
  planType: string;
  clusterId: string;
  externalClusterId: string;
}

const Router: React.FC<RouterProps> = ({ history, planType, clusterId, externalClusterId }) => {
  const { pathname } = useLocation();

  const {
    segment: { setPageMetadata },
  } = useChrome();

  const isHypershiftWizardEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);
  // OSD_WIZARD_V2_FEATURE enabled in staging, disabled in production (via Unleashed)
  const isOSDv2WizardEnabled = useFeatureGate(OSD_WIZARD_V2_FEATURE);
  // OSD_WIZARD_V1 can be enabled in staging by appending `?features={"osd-wizard-v1":"true"}`
  const { [OSD_WIZARD_V1]: showOSDWizardV1 } = useFeatures();

  // For testing purposes, show which major features are enabled/disabled
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.info(
      '---------------Features---------------\n',
      `HYPERSHIFT_WIZARD_FEATURE: ${isHypershiftWizardEnabled ? 'Enabled' : 'Disabled'}\n`,
      `OSD_WIZARD_V2_FEATURE: ${isOSDv2WizardEnabled ? 'Enabled' : 'Disabled'}\n`,
      `OSD_WIZARD_V1: ${showOSDWizardV1 ? 'Enabled' : 'Disabled'}\n`,
      '-------------------------------------',
    );
  }, [isHypershiftWizardEnabled, isOSDv2WizardEnabled, showOSDWizardV1]);

  useEffect(() => {
    setPageMetadata({
      ...metadataByRoute(pathname, planType, clusterId, externalClusterId),
      ...(is404() ? { title: '404 Not Found' } : {}),
    });
  }, [pathname, planType, clusterId, externalClusterId, setPageMetadata]);

  return (
    <>
      <Insights />
      <ConnectedRouter history={history}>
        <ApiError apiRequest={apiRequest}>
          <Switch>
            {/*
              IMPORTANT!
              When adding new routes, make sure to add the route both here and in Router.test.jsx,
              to ensure the route is tested.

              When adding new top-level entries to left navigation, see also getNavClickParams.js.
            */}
            <Redirect
              from="/install/osp/installer-provisioned"
              to="/install/openstack/installer-provisioned"
            />
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
                <AppPage>
                  <TokensROSA show />
                  <EntitlementConfig />
                </AppPage>
              )}
            />
            <TermsGuardedRoute
              path="/token/rosa"
              history={history}
              render={() => (
                <AppPage>
                  <TokensROSA show={false} showPath="/token/rosa/show" />
                  <EntitlementConfig />
                </AppPage>
              )}
            />
            <Route path="/token/show" render={() => <Tokens show />} />
            <Route path="/token" render={() => <Tokens show={false} showPath="/token/show" />} />

            <Route
              path="/install/alibaba/installer-provisioned"
              component={ConnectedInstallAlibaba}
            />
            <Route path="/install/arm/installer-provisioned" component={InstallArmBMIPI} />
            <Route path="/install/arm/user-provisioned" component={InstallArmBMUPI} />
            <Route path="/install/arm/pre-release" component={ConnectedInstallArmPreRelease} />
            <Route path="/install/arm" component={InstallArmBareMetal} />
            <Route path="/install/aws/installer-provisioned" component={ConnectedInstallAWSIPI} />
            <Route path="/install/aws/user-provisioned" component={ConnectedInstallAWSUPI} />
            <Route
              path="/install/aws/arm/installer-provisioned"
              component={ConnectedInstallArmAWSIPI}
            />
            <Route path="/install/aws/arm/user-provisioned" component={ConnectedInstallArmAWSUPI} />
            <Route path="/install/aws/arm" component={InstallArmAWS} />
            <Route
              path="/install/aws/multi/installer-provisioned"
              component={ConnectedInstallMultiAWSIPI}
            />
            <Route path="/install/aws" component={InstallAWS} />
            <Route path="/install/gcp/installer-provisioned" component={ConnectedInstallGCPIPI} />
            <Route path="/install/gcp/user-provisioned" component={ConnectedInstallGCPUPI} />
            <Route path="/install/gcp" component={InstallGCP} />
            <Route path="/install/nutanix" exact component={InstallNutanix} />
            <Route
              path="/install/nutanix/installer-provisioned"
              component={ConnectedInstallNutanixIPI}
            />
            <Route
              path="/install/openstack/installer-provisioned"
              component={ConnectedInstallOSPIPI}
            />
            <Route path="/install/openstack/user-provisioned" component={ConnectedInstallOSPUPI} />
            <Route path="/install/openstack" component={InstallOSP} />
            <Route path="/install/rhv/installer-provisioned" component={ConnectedInstallRHVIPI} />
            <Route path="/install/rhv/user-provisioned" component={ConnectedInstallRHVUPI} />
            <Route path="/install/rhv" component={InstallRHV} />
            <Route
              path="/install/azure/arm/installer-provisioned"
              component={ConnectedInstallArmAzureIPI}
            />
            <Route
              path="/install/azure/multi/installer-provisioned"
              component={ConnectedInstallMultiAzureIPI}
            />
            <Route
              path="/install/azure/installer-provisioned"
              component={ConnectedInstallAzureIPI}
            />
            <Route path="/install/azure/user-provisioned" component={ConnectedInstallAzureUPI} />
            <Route path="/install/azure" exact component={InstallAzure} />
            <Route
              path="/install/azure-stack-hub/installer-provisioned"
              exact
              component={ConnectedInstallASHIPI}
            />
            <Route
              path="/install/azure-stack-hub/user-provisioned"
              exact
              component={ConnectedInstallASHUPI}
            />
            <Route path="/install/azure-stack-hub" exact component={InstallASH} />
            <Route path="/install/metal/user-provisioned" component={InstallBMUPI} />
            <Route path="/install/metal/installer-provisioned" component={InstallBMIPI} />
            <Route path="/install/metal/agent-based" component={InstallBMABI} />
            <Route path="/install/metal/multi" component={InstallMultiBMUPI} />
            <Route path="/install/metal" component={GatedMetalInstall} />
            <Route path="/install/multi/pre-release" component={ConnectedInstallMultiPreRelease} />
            <Route path="/install/vsphere" exact component={InstallVSphere} />
            <Route path="/install/vsphere/agent-based" component={ConnectedInstallVSphereABI} />
            <Route
              path="/install/vsphere/user-provisioned"
              component={ConnectedInstallVSphereUPI}
            />
            <Route
              path="/install/vsphere/installer-provisioned"
              component={ConnectedInstallVSphereIPI}
            />
            <Route path="/install/ibm-cloud" component={ConnectedInstallIBMCloud} />
            <Route path="/install/ibmz/user-provisioned" component={ConnectedInstallIBMZUPI} />
            <Route path="/install/ibmz/pre-release" component={ConnectedInstallIBMZPreRelease} />
            <Route path="/install/ibmz" exact component={InstallIBMZ} />
            <Route path="/install/power/user-provisioned" component={ConnectedInstallPowerUPI} />
            <Route path="/install/power/pre-release" component={ConnectedInstallPowerPreRelease} />
            <Route path="/install/power" exact component={InstallPower} />
            <Route path="/install/powervs/installer-provisioned" component={InstallPowerVSIPI} />
            <Route
              path="/install/platform-agnostic/agent-based"
              component={ConnectedInstallPlatformAgnosticABI}
            />
            <Route
              path="/install/platform-agnostic/user-provisioned"
              component={ConnectedInstallPlatformAgnosticUPI}
            />
            <Route path="/install/platform-agnostic" component={InstallPlatformAgnostic} />
            <Route path="/install/pre-release" component={ConnectedInstallPreRelease} />
            <Route path="/install/pull-secret" component={ConnectedInstallPullSecret} />
            <Route
              path="/install/azure/aro-provisioned"
              component={ConnectedInstallPullSecretAzure}
            />
            <Redirect from="/install" to="/create" />
            <Redirect from="/create/osd/aws" to="/create/osd" />
            <Redirect from="/create/osd/gcp" to="/create/osd" />
            <Redirect from="/create/osdtrial/aws" to="/create/osdtrial" />
            <Redirect from="/create/osdtrial/gcp" to="/create/osdtrial" />
            {isOSDv2WizardEnabled && !showOSDWizardV1 ? (
              <TermsGuardedRoute
                path="/create/osdtrial"
                gobackPath="/create"
                render={() => <CreateOsdWizard product={normalizedProducts.OSDTrial} />}
                history={history}
              />
            ) : (
              <TermsGuardedRoute
                path="/create/osdtrial"
                gobackPath="/create"
                render={() => <CreateOSDWizard product={normalizedProducts.OSDTrial} />}
                history={history}
              />
            )}
            {isOSDv2WizardEnabled && !showOSDWizardV1 ? (
              <TermsGuardedRoute
                path="/create/osd"
                gobackPath="/create"
                component={CreateOsdWizard}
                history={history}
              />
            ) : (
              <TermsGuardedRoute
                path="/create/osd"
                gobackPath="/create"
                render={() => <CreateOSDWizard product={normalizedProducts.OSD} />}
                history={history}
              />
            )}

            <Route
              path="/create/cloud"
              render={(props) => <CreateClusterPage activeTab="cloud" {...props} />}
            />
            <Route
              path="/create/datacenter"
              render={(props) => <CreateClusterPage activeTab="datacenter" {...props} />}
            />
            <Route
              path="/create/local"
              render={(props) => <CreateClusterPage activeTab="local" {...props} />}
            />

            <Redirect from="/create/rosa/welcome" to="/create/rosa/getstarted" />
            <TermsGuardedRoute
              path="/create/rosa/getstarted"
              history={history}
              component={GetStartedWithROSA}
            />
            <Route path="/create/rosa/govcloud" component={GovCloudPage} />

            <TermsGuardedRoute
              path="/create/rosa/wizard"
              history={history}
              component={CreateROSAWizard}
            />

            <Route path="/create" component={CreateClusterPage} />

            <Route
              path="/details/s/:id/insights/:reportId/:errorKey"
              component={InsightsAdvisorRedirector}
            />
            <Route path="/details/s/:id/add-idp/:idpTypeName" component={IdentityProvidersPage} />
            <Route
              path="/details/s/:id/edit-idp/:idpName"
              render={({ match }) => <IdentityProvidersPage isEditForm match={match} />}
            />
            <Route path="/details/s/:id" component={ClusterDetailsSubscriptionId} />
            <Route
              path="/details/:id/insights/:reportId/:errorKey"
              component={InsightsAdvisorRedirector}
            />
            <Route path="/details/:id" component={ClusterDetailsClusterOrExternalId} />
            <Route path="/register" component={RegisterCluster} />
            <Route path="/quota/resource-limits" render={() => <Quota marketplace />} />
            <Route path="/quota" component={Quota} />
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
};

type RouterState = {
  clusters: any;
};
const mapStateToProps = (state: RouterState) => {
  const { cluster } = state.clusters.details;
  return {
    planType: get(cluster, 'subscription.plan.type', normalizedProducts.UNKNOWN),
    clusterId: get(cluster, 'subscription.cluster_id'),
    externalClusterId: get(cluster, 'subscription.external_cluster_id'),
  };
};

export default connect(mapStateToProps)(withRouter(Router));
