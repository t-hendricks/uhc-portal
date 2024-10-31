import { action, ActionType } from 'typesafe-actions';

import authorizationsService from '../../services/authorizationsService';
import {
  CLI_SSO_AUTHORIZATION,
  CLUSTER_OWNERSHIP_TRANSFER,
  CREATE_CLUSTER_YAML_EDITOR,
  ENABLE_MACHINE_CONFIGURATION,
  HCP_USE_UNMANAGED,
  HYPERSHIFT_WIZARD_FEATURE,
  MAX_COMPUTE_NODES_500,
  MULTIREGION_PREVIEW_ENABLED,
  OCMUI_EDIT_BILLING_ACCOUNT,
  OSD_GCP_WIF,
  SET_FEATURE,
  UNSTABLE_CLUSTER_VERSIONS,
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
  getSimpleUnleashFeature('hcp-use-unmanaged-policies', HCP_USE_UNMANAGED),
  getSimpleUnleashFeature('ocmui-unstable-cluster-versions', UNSTABLE_CLUSTER_VERSIONS),
  getSimpleUnleashFeature('ocmui-edit-billing-account', OCMUI_EDIT_BILLING_ACCOUNT),
  getSimpleUnleashFeature('enable-machine-configuration', ENABLE_MACHINE_CONFIGURATION),
  getSimpleUnleashFeature('cli-sso-authorization', CLI_SSO_AUTHORIZATION),
  getSimpleUnleashFeature('multi-region-support', MULTIREGION_PREVIEW_ENABLED),
  getSimpleUnleashFeature('cluster-ownership-transfer', CLUSTER_OWNERSHIP_TRANSFER),
  getSimpleUnleashFeature('gcp-workload-identity-federation', OSD_GCP_WIF),
  getSimpleUnleashFeature('enable-create-cluster-yaml-editor', CREATE_CLUSTER_YAML_EDITOR),
  getSimpleUnleashFeature('max-compute-nodes-500', MAX_COMPUTE_NODES_500),
];

export const detectFeatures = (): AppThunk => (dispatch) => {
  features.forEach(({ name, action: featureAction }) =>
    featureAction()
      .then((enabled) => dispatch(setFeatureAction(name, enabled)))
      .catch(() => dispatch(setFeatureAction(name, false))),
  );
};

export type FeatureAction = ActionType<typeof setFeatureAction>;
