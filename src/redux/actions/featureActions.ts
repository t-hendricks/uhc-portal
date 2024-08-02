import { action, ActionType } from 'typesafe-actions';

import { SelfAccessReview } from '~/types/accounts_mgmt.v1';

import authorizationsService from '../../services/authorizationsService';
import {
  ACCESS_REQUEST_ENABLED,
  ASSISTED_INSTALLER_FEATURE,
  ASSISTED_INSTALLER_MERGE_LISTS_FEATURE,
  CLI_SSO_AUTHORIZATION,
  CLUSTER_OWNERSHIP_TRANSFER,
  ENABLE_MACHINE_CONFIGURATION,
  HCP_ROSA_GETTING_STARTED_PAGE,
  HCP_USE_NODE_UPGRADE_POLICIES,
  HCP_USE_UNMANAGED,
  HYPERSHIFT_WIZARD_FEATURE,
  LONGER_CLUSTER_NAME_UI,
  MULTIREGION_PREVIEW_ENABLED,
  NETWORK_VALIDATOR_ONDEMAND_FEATURE,
  OSD_GCP_SHARED_VPC_FEATURE,
  OSD_GCP_WIF,
  OSD_GOOGLE_MARKETPLACE_FEATURE,
  SECURITY_GROUPS_FEATURE,
  SECURITY_GROUPS_FEATURE_DAY1,
  SET_FEATURE,
} from '../constants/featureConstants';
import type { AppThunk } from '../types';

export const setFeatureAction = (feature: string, enabled: boolean) =>
  action(SET_FEATURE, { feature, enabled });

const getSimpleUnleashFeature = (unleashFeatureName: string, name: string) => ({
  name,
  action: () =>
    authorizationsService
      .selfFeatureReview(unleashFeatureName)
      .then((unleash) => unleash.data.enabled),
});

// list of features to detect upon app startup
export const features = [
  getSimpleUnleashFeature('hypershift-creation-wizard', HYPERSHIFT_WIZARD_FEATURE),
  getSimpleUnleashFeature('hcp-rosa-getting-started-page', HCP_ROSA_GETTING_STARTED_PAGE),
  getSimpleUnleashFeature('hcp-use-unmanaged-policies', HCP_USE_UNMANAGED),
  getSimpleUnleashFeature('hcp-use-node-upgrade-policies', HCP_USE_NODE_UPGRADE_POLICIES),
  getSimpleUnleashFeature('assisted-installer-merge-lists', ASSISTED_INSTALLER_MERGE_LISTS_FEATURE),
  getSimpleUnleashFeature('osd-google-marketplace', OSD_GOOGLE_MARKETPLACE_FEATURE),
  getSimpleUnleashFeature('osd-gcp-shared-vpc', OSD_GCP_SHARED_VPC_FEATURE),
  getSimpleUnleashFeature('network-validator-ondemand', NETWORK_VALIDATOR_ONDEMAND_FEATURE),
  getSimpleUnleashFeature('security-groups-feature-day1', SECURITY_GROUPS_FEATURE_DAY1), // Handles only Day1
  getSimpleUnleashFeature('security-groups-feature', SECURITY_GROUPS_FEATURE), // Handles only Day2
  getSimpleUnleashFeature('enable-machine-configuration', ENABLE_MACHINE_CONFIGURATION),
  getSimpleUnleashFeature('cli-sso-authorization', CLI_SSO_AUTHORIZATION),
  getSimpleUnleashFeature('multi-region-support', MULTIREGION_PREVIEW_ENABLED),
  getSimpleUnleashFeature('longer-cluster-name-ui', LONGER_CLUSTER_NAME_UI),
  getSimpleUnleashFeature('enable-access-request', ACCESS_REQUEST_ENABLED),
  getSimpleUnleashFeature('cluster-ownership-transfer', CLUSTER_OWNERSHIP_TRANSFER),
  getSimpleUnleashFeature('gcp-workload-identity-federation', OSD_GCP_WIF),
  {
    name: ASSISTED_INSTALLER_FEATURE,
    action: () =>
      Promise.all([
        authorizationsService.selfAccessReview({
          action: SelfAccessReview.action.CREATE,
          // @ts-ignore 'BareMetalCluster' does not exist on SelfAccessReview.resource_type
          resource_type: 'BareMetalCluster',
        }),
        authorizationsService.selfFeatureReview('assisted-installer'),
      ]).then(([resource, unleash]) => resource.data.allowed && unleash.data.enabled),
  },
];

export const detectFeatures = (): AppThunk => (dispatch) => {
  features.forEach(({ name, action: featureAction }) =>
    featureAction()
      .then((enabled) => dispatch(setFeatureAction(name, enabled)))
      .catch(() => dispatch(setFeatureAction(name, false))),
  );
};

export type FeatureAction = ActionType<typeof setFeatureAction>;
