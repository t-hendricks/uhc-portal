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

import {
  Routes as AssistedInstallerRoutes,
  NoPermissionsError as AINoPermissionsError,
} from '@openshift-assisted/ui-lib/ocm';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { CompatRoute } from 'react-router-dom-v5-compat';
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
import apiRequest from '~/services/apiRequest';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import config from '~/config';
import { normalizedProducts } from '../../common/subscriptionTypes';
import {
  ASSISTED_INSTALLER_FEATURE,
  HYPERSHIFT_WIZARD_FEATURE,
  ROSA_WIZARD_V2_ENABLED,
} from '../../redux/constants/featureConstants';
import ArchivedClusterList from '../clusters/ArchivedClusterList';
import ClusterDetailsClusterOrExternalId from '../clusters/ClusterDetails/ClusterDetailsClusterOrExternalId';
import ClusterDetailsSubscriptionId from '../clusters/ClusterDetails/ClusterDetailsSubscriptionId';
import IdentityProvidersPage from '../clusters/ClusterDetails/components/IdentityProvidersPage';
import ClustersList from '../clusters/ClusterList';
import CreateClusterPage from '../clusters/CreateClusterPage';
import CreateROSAWizard from '../clusters/wizards/rosa_v1';
import CreateROSAWizardV2 from '../clusters/wizards/rosa_v2';
import GetStartedWithROSA from '../clusters/wizards/rosa_v1/CreateRosaGetStarted';
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
import InstallVSphere from '../clusters/install/InstallVSphere';
import ConnectedInstallVSphereABI from '../clusters/install/InstallVSphereABI';
import ConnectedInstallVSphereIPI from '../clusters/install/InstallVSphereIPI';
import ConnectedInstallVSphereUPI from '../clusters/install/InstallVSphereUPI';
import { CreateOsdWizard } from '../clusters/wizards/osd';
import EntitlementConfig from '../common/EntitlementConfig/index';
import DownloadsPage from '../downloads/DownloadsPage';
import withFeatureGate from '../features/with-feature-gate';
import Dashboard from '../dashboard';
import Overview from '../overview';
import Quota from '../quota';
import Releases from '../releases/index';
import Tokens from '../tokens';
import TokensROSA from '../tokens/TokensROSA';
import ApiError from './ApiError';
import { AppPage } from './AppPage';
import GovCloudPage from '../clusters/GovCloud/GovCloudPage';
import RosaServicePage from '../services/rosa/RosaServicePage';
import Insights from './Insights';
import NotFoundError from './NotFoundError';
import TermsGuardedRoute from './TermsGuardedRoute';
import { is404, metadataByRoute } from './routeMetadata';
import RosaHandsOnPage from '../RosaHandsOn/RosaHandsOnPage';

const AssistedUiRouterPage: typeof AssistedInstallerRoutes = (props) => (
  <AppPage>
    <AssistedInstallerRoutes {...props} />
  </AppPage>
);

const GatedAssistedUiRouter = withFeatureGate(
  AssistedUiRouterPage,
  ASSISTED_INSTALLER_FEATURE,
  AINoPermissionsError,
);

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

const TokenShowComponent = () => <Tokens show />;
const TokenNotShowComponent = () => <Tokens show={false} showPath="/token/show" />;
const IdentityProvidersPageEditFormComponent = () => <IdentityProvidersPage isEditForm />;
const CreateClusterPageEmptyTabComponent = () => <CreateClusterPage activeTab="" />;

const Router: React.FC<RouterProps> = ({ history, planType, clusterId, externalClusterId }) => {
  const { pathname } = useLocation();

  const {
    segment: { setPageMetadata },
  } = useChrome();

  const isHypershiftWizardEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);

  // ROSA_WIZARD_V2_ENABLED enabled in staging, disabled in production (via Unleashed)
  const isRosaV2WizardEnabled = useFeatureGate(ROSA_WIZARD_V2_ENABLED);

  // For testing purposes, show which major features are enabled/disabled
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.info(
      '---------------Features---------------\n',
      `HYPERSHIFT_WIZARD_FEATURE: ${isHypershiftWizardEnabled ? 'Enabled' : 'Disabled'}\n`,
      '-------------------------------------',
    );
  }, [isHypershiftWizardEnabled]);

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
            <Redirect from="/insights" to="/dashboard" />
            <Redirect from="/subscriptions" to="/quota" />
            <CompatRoute path="/downloads" component={DownloadsPage} />

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
            <CompatRoute path="/token/show" component={TokenShowComponent} />
            <CompatRoute path="/token" component={TokenNotShowComponent} />

            <CompatRoute
              path="/install/alibaba/installer-provisioned"
              component={ConnectedInstallAlibaba}
            />
            <CompatRoute path="/install/arm/installer-provisioned" component={InstallArmBMIPI} />
            <CompatRoute path="/install/arm/user-provisioned" component={InstallArmBMUPI} />
            <CompatRoute
              path="/install/arm/pre-release"
              component={ConnectedInstallArmPreRelease}
            />
            <CompatRoute path="/install/arm" component={InstallArmBareMetal} />
            <CompatRoute
              path="/install/aws/installer-provisioned"
              component={ConnectedInstallAWSIPI}
            />
            <CompatRoute path="/install/aws/user-provisioned" component={ConnectedInstallAWSUPI} />
            <CompatRoute
              path="/install/aws/arm/installer-provisioned"
              component={ConnectedInstallArmAWSIPI}
            />
            <CompatRoute
              path="/install/aws/arm/user-provisioned"
              component={ConnectedInstallArmAWSUPI}
            />
            <CompatRoute path="/install/aws/arm" component={InstallArmAWS} />
            <CompatRoute
              path="/install/aws/multi/installer-provisioned"
              component={ConnectedInstallMultiAWSIPI}
            />
            <CompatRoute path="/install/aws" component={InstallAWS} />
            <CompatRoute
              path="/install/gcp/installer-provisioned"
              component={ConnectedInstallGCPIPI}
            />
            <CompatRoute path="/install/gcp/user-provisioned" component={ConnectedInstallGCPUPI} />
            <CompatRoute path="/install/gcp" component={InstallGCP} />
            <CompatRoute path="/install/nutanix" exact component={InstallNutanix} />
            <CompatRoute
              path="/install/nutanix/installer-provisioned"
              component={ConnectedInstallNutanixIPI}
            />
            <CompatRoute
              path="/install/openstack/installer-provisioned"
              component={ConnectedInstallOSPIPI}
            />
            <CompatRoute
              path="/install/openstack/user-provisioned"
              component={ConnectedInstallOSPUPI}
            />
            <CompatRoute path="/install/openstack" component={InstallOSP} />
            <CompatRoute
              path="/install/azure/arm/installer-provisioned"
              component={ConnectedInstallArmAzureIPI}
            />
            <CompatRoute
              path="/install/azure/multi/installer-provisioned"
              component={ConnectedInstallMultiAzureIPI}
            />
            <CompatRoute
              path="/install/azure/installer-provisioned"
              component={ConnectedInstallAzureIPI}
            />
            <CompatRoute
              path="/install/azure/user-provisioned"
              component={ConnectedInstallAzureUPI}
            />
            <CompatRoute path="/install/azure" exact component={InstallAzure} />
            <CompatRoute
              path="/install/azure-stack-hub/installer-provisioned"
              exact
              component={ConnectedInstallASHIPI}
            />
            <CompatRoute
              path="/install/azure-stack-hub/user-provisioned"
              exact
              component={ConnectedInstallASHUPI}
            />
            <CompatRoute path="/install/azure-stack-hub" exact component={InstallASH} />
            <CompatRoute path="/install/metal/user-provisioned" component={InstallBMUPI} />
            <CompatRoute path="/install/metal/installer-provisioned" component={InstallBMIPI} />
            <CompatRoute path="/install/metal/agent-based" component={InstallBMABI} />
            <CompatRoute path="/install/metal/multi" component={InstallMultiBMUPI} />
            <CompatRoute path="/install/metal" component={GatedMetalInstall} />
            <CompatRoute
              path="/install/multi/pre-release"
              component={ConnectedInstallMultiPreRelease}
            />
            <CompatRoute path="/install/vsphere" exact component={InstallVSphere} />
            <CompatRoute
              path="/install/vsphere/agent-based"
              component={ConnectedInstallVSphereABI}
            />
            <CompatRoute
              path="/install/vsphere/user-provisioned"
              component={ConnectedInstallVSphereUPI}
            />
            <CompatRoute
              path="/install/vsphere/installer-provisioned"
              component={ConnectedInstallVSphereIPI}
            />
            <CompatRoute path="/install/ibm-cloud" component={ConnectedInstallIBMCloud} />
            <CompatRoute
              path="/install/ibmz/user-provisioned"
              component={ConnectedInstallIBMZUPI}
            />
            <CompatRoute
              path="/install/ibmz/pre-release"
              component={ConnectedInstallIBMZPreRelease}
            />
            <CompatRoute path="/install/ibmz" exact component={InstallIBMZ} />
            <CompatRoute
              path="/install/power/user-provisioned"
              component={ConnectedInstallPowerUPI}
            />
            <CompatRoute
              path="/install/power/pre-release"
              component={ConnectedInstallPowerPreRelease}
            />
            <CompatRoute path="/install/power" exact component={InstallPower} />
            <CompatRoute
              path="/install/powervs/installer-provisioned"
              component={InstallPowerVSIPI}
            />
            <CompatRoute
              path="/install/platform-agnostic/agent-based"
              component={ConnectedInstallPlatformAgnosticABI}
            />
            <CompatRoute
              path="/install/platform-agnostic/user-provisioned"
              component={ConnectedInstallPlatformAgnosticUPI}
            />
            <CompatRoute path="/install/platform-agnostic" component={InstallPlatformAgnostic} />
            <CompatRoute path="/install/pre-release" component={ConnectedInstallPreRelease} />
            <CompatRoute path="/install/pull-secret" component={ConnectedInstallPullSecret} />
            <CompatRoute
              path="/install/azure/aro-provisioned"
              component={ConnectedInstallPullSecretAzure}
            />
            <Redirect from="/install" to="/create" />
            <Redirect from="/create/osd/aws" to="/create/osd" />
            <Redirect from="/create/osd/gcp" to="/create/osd" />
            <Redirect from="/create/osdtrial/aws" to="/create/osdtrial" />
            <Redirect from="/create/osdtrial/gcp" to="/create/osdtrial" />
            <TermsGuardedRoute
              path="/create/osdtrial"
              gobackPath="/create"
              render={() => <CreateOsdWizard product={normalizedProducts.OSDTrial} />}
              history={history}
            />
            <TermsGuardedRoute
              path="/create/osd"
              gobackPath="/create"
              component={CreateOsdWizard}
              history={history}
            />
            <CompatRoute
              path="/create/cloud"
              render={() => <CreateClusterPage activeTab="cloud" />}
            />
            <CompatRoute
              path="/create/datacenter"
              render={() => <CreateClusterPage activeTab="datacenter" />}
            />
            <CompatRoute
              path="/create/local"
              render={() => <CreateClusterPage activeTab="local" />}
            />

            <Redirect from="/create/rosa/welcome" to="/create/rosa/getstarted" />
            <TermsGuardedRoute
              path="/create/rosa/getstarted"
              history={history}
              component={GetStartedWithROSA}
            />
            <CompatRoute path="/create/rosa/govcloud" component={GovCloudPage} />

            <TermsGuardedRoute
              path="/create/rosa/wizard"
              history={history}
              component={
                config.rosaV2 && isRosaV2WizardEnabled ? CreateROSAWizardV2 : CreateROSAWizard
              }
            />

            <CompatRoute path="/create" component={CreateClusterPageEmptyTabComponent} />

            <CompatRoute
              path="/details/s/:id/insights/:reportId/:errorKey"
              component={InsightsAdvisorRedirector}
            />
            <CompatRoute
              path="/details/s/:id/add-idp/:idpTypeName"
              component={IdentityProvidersPage}
            />
            <CompatRoute
              path="/details/s/:id/edit-idp/:idpName"
              component={IdentityProvidersPageEditFormComponent}
            />
            <CompatRoute path="/details/s/:id" component={ClusterDetailsSubscriptionId} />
            <CompatRoute
              path="/details/:id/insights/:reportId/:errorKey"
              component={InsightsAdvisorRedirector}
            />
            <CompatRoute path="/details/:id" component={ClusterDetailsClusterOrExternalId} />
            <CompatRoute path="/register" component={RegisterCluster} />
            <CompatRoute path="/quota/resource-limits" render={() => <Quota marketplace />} />
            <CompatRoute path="/quota" component={Quota} />
            <CompatRoute path="/archived" component={ArchivedClusterList} />
            <CompatRoute path="/dashboard" exact component={Dashboard} />
            <CompatRoute path="/overview/rosa/hands-on" component={RosaHandsOnPage} />
            <CompatRoute path="/overview/rosa" component={RosaServicePage} />
            <CompatRoute path="/overview" exact component={Overview} />
            <CompatRoute path="/releases" exact component={Releases} />
            <CompatRoute path="/assisted-installer" component={GatedAssistedUiRouter} />

            {/* TODO: remove these redirects once links from trials and demo system emails are updated */}
            <Route
              path="/services/rosa/demo"
              render={(props) => (
                <Redirect to={`/overview/rosa/hands-on/${props.location.search}`} />
              )}
            />
            <Route
              path="/services/rosa"
              render={(props) => <Redirect to={`/overview/rosa${props.location.search}`} />}
            />

            <CompatRoute path="/" exact component={ClustersList} />
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
