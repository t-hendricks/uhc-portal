import { action, ActionType } from 'typesafe-actions';
import { SelfAccessReview } from '~/types/accounts_mgmt.v1';
import {
  SET_FEATURE,
  ASSISTED_INSTALLER_FEATURE,
  ASSISTED_INSTALLER_MERGE_LISTS_FEATURE,
  HYPERSHIFT_WIZARD_FEATURE,
  OSD_GOOGLE_MARKETPLACE_FEATURE,
  OSD_GCP_SHARED_VPC_FEATURE,
  NETWORK_VALIDATOR_ONDEMAND_FEATURE,
  HCP_ROSA_GETTING_STARTED_PAGE,
  HCP_AWS_BILLING_SHOW,
  HCP_AWS_BILLING_REQUIRED,
  HCP_USE_UNMANAGED,
  SECURITY_GROUPS_FEATURE,
  SECURITY_GROUPS_FEATURE_DAY1,
  HCP_USE_NODE_UPGRADE_POLICIES,
  ENABLE_MACHINE_CONFIGURATION,
  GCP_SECURE_BOOT_UI,
  GCP_SECURE_BOOT_ENHANCEMENTS,
} from '../constants/featureConstants';
import authorizationsService from '../../services/authorizationsService';
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
  getSimpleUnleashFeature('hcp-aws-billing-show', HCP_AWS_BILLING_SHOW),
  getSimpleUnleashFeature('hcp-use-unmanaged-policies', HCP_USE_UNMANAGED),
  getSimpleUnleashFeature('hcp-aws-billing-required', HCP_AWS_BILLING_REQUIRED),
  getSimpleUnleashFeature('hcp-use-node-upgrade-policies', HCP_USE_NODE_UPGRADE_POLICIES),
  getSimpleUnleashFeature('assisted-installer-merge-lists', ASSISTED_INSTALLER_MERGE_LISTS_FEATURE),
  getSimpleUnleashFeature('osd-google-marketplace', OSD_GOOGLE_MARKETPLACE_FEATURE),
  getSimpleUnleashFeature('osd-gcp-shared-vpc', OSD_GCP_SHARED_VPC_FEATURE),
  getSimpleUnleashFeature('network-validator-ondemand', NETWORK_VALIDATOR_ONDEMAND_FEATURE),
  getSimpleUnleashFeature('security-groups-feature-day1', SECURITY_GROUPS_FEATURE_DAY1), // Handles only Day1
  getSimpleUnleashFeature('security-groups-feature', SECURITY_GROUPS_FEATURE), // Handles only Day2
  getSimpleUnleashFeature('enable-machine-configuration', ENABLE_MACHINE_CONFIGURATION),
  getSimpleUnleashFeature('gcp-secure-boot-ui', GCP_SECURE_BOOT_UI),
  getSimpleUnleashFeature('gcp-secure-boot-enhancements', GCP_SECURE_BOOT_ENHANCEMENTS),
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
