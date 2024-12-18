import { action, ActionType } from 'typesafe-actions';

import authorizationsService from '../../services/authorizationsService';
import {
  BYPASS_COMPUTE_NODE_COUNT_LIMIT_CLASSIC_OSD_GCP,
  CLI_SSO_AUTHORIZATION,
  CLUSTER_OWNERSHIP_TRANSFER,
  CREATE_CLUSTER_YAML_EDITOR,
  EDIT_BILLING_ACCOUNT,
  ENABLE_MACHINE_CONFIGURATION,
  HCP_ROOT_DISK_SIZE,
  HCP_USE_UNMANAGED,
  HYPERSHIFT_WIZARD_FEATURE,
  MAX_COMPUTE_NODES_500,
  MULTIREGION_PREVIEW_ENABLED,
  OSD_GCP_WIF,
  PRIVATE_SERVICE_CONNECT,
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
  getSimpleUnleashFeature('ocmui-edit-billing-account', EDIT_BILLING_ACCOUNT),
  getSimpleUnleashFeature('ocmui-gcp-private-service-connect', PRIVATE_SERVICE_CONNECT),
  getSimpleUnleashFeature('enable-machine-configuration', ENABLE_MACHINE_CONFIGURATION),
  getSimpleUnleashFeature('cli-sso-authorization', CLI_SSO_AUTHORIZATION),
  getSimpleUnleashFeature('multi-region-support', MULTIREGION_PREVIEW_ENABLED),
  getSimpleUnleashFeature('cluster-ownership-transfer', CLUSTER_OWNERSHIP_TRANSFER),
  getSimpleUnleashFeature('gcp-workload-identity-federation', OSD_GCP_WIF),
  getSimpleUnleashFeature('enable-create-cluster-yaml-editor', CREATE_CLUSTER_YAML_EDITOR),
  getSimpleUnleashFeature('max-compute-nodes-500', MAX_COMPUTE_NODES_500),
  getSimpleUnleashFeature('ocmui-hcp-root-disk-size', HCP_ROOT_DISK_SIZE),
  getSimpleUnleashFeature(
    'bypass-compute-node-count-limit-classic-osd-gcp',
    BYPASS_COMPUTE_NODE_COUNT_LIMIT_CLASSIC_OSD_GCP,
  ),
];

export const detectFeatures = (): AppThunk => (dispatch) => {
  features.forEach(({ name, action: featureAction }) =>
    featureAction()
      .then((enabled) => dispatch(setFeatureAction(name, enabled)))
      .catch(() => dispatch(setFeatureAction(name, false))),
  );
};

export type FeatureAction = ActionType<typeof setFeatureAction>;
