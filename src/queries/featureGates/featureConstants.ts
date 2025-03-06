export const HYPERSHIFT_WIZARD_FEATURE = 'hypershift-creation-wizard';
export const HCP_USE_UNMANAGED = 'hcp-use-unmanaged-policies';
export const ENABLE_MACHINE_CONFIGURATION = 'enable-machine-configuration';
export const CLI_SSO_AUTHORIZATION = 'cli-sso-authorization';
export const MULTIREGION_PREVIEW_ENABLED = 'multi-region-support';
export const CLUSTER_OWNERSHIP_TRANSFER = 'cluster-ownership-transfer';
export const OSD_GCP_WIF = 'gcp-workload-identity-federation';
export const CREATE_CLUSTER_YAML_EDITOR = 'enable-create-cluster-yaml-editor';
export const UNSTABLE_CLUSTER_VERSIONS = 'ocmui-unstable-cluster-versions';
export const EDIT_BILLING_ACCOUNT = 'ocmui-edit-billing-account';
export const PRIVATE_SERVICE_CONNECT = 'ocmui-gcp-private-service-connect';
export const BYPASS_COMPUTE_NODE_COUNT_LIMIT_CLASSIC_OSD_GCP =
  'bypass-compute-node-count-limit-classic-osd-gcp';
export const OCMUI_MAX_NODES_TOTAL_249 = 'ocmui-max-nodes-total-249';
export const OCMUI_ENHANCED_HTPASSWRD = 'ocmui-enhanced-htpasswrd';

export default {
  HYPERSHIFT_WIZARD_FEATURE,
  HCP_USE_UNMANAGED,
  ENABLE_MACHINE_CONFIGURATION,
  CLI_SSO_AUTHORIZATION,
  MULTIREGION_PREVIEW_ENABLED,
  CLUSTER_OWNERSHIP_TRANSFER,
  OSD_GCP_WIF,
  CREATE_CLUSTER_YAML_EDITOR,
  UNSTABLE_CLUSTER_VERSIONS,
  EDIT_BILLING_ACCOUNT,
  PRIVATE_SERVICE_CONNECT,
  BYPASS_COMPUTE_NODE_COUNT_LIMIT_CLASSIC_OSD_GCP,
  OCMUI_MAX_NODES_TOTAL_249,
  OCMUI_ENHANCED_HTPASSWRD,
} as const;
