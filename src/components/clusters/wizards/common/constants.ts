import { FormikValues } from 'formik';

// Fields that are used in both OSD and ROSA wizards.
export enum FieldId {
  // In ROSA wizard, some e.g. 'byoc' are not user-changable but
  // we still set them to fixed values, to reuse code that depends on them.
  Byoc = 'byoc',
  Product = 'product',
  CloudProvider = 'cloud_provider',
  BillingModel = 'billing_model',
  AcknowledgePrereq = 'acknowledge_prerequisites',
  CidrDefaultValuesEnabled = 'cidr_default_values_enabled',
  UpgradePolicy = 'upgrade_policy',
  AutomaticUpgradeSchedule = 'automatic_upgrade_schedule',
  NodeDrainGracePeriod = 'node_drain_grace_period',
  MachineType = 'machine_type',
  AutoscalingEnabled = 'autoscalingEnabled',
  ClusterAutoscaling = 'cluster_autoscaling',
  NodeLabels = 'node_labels',
  MinReplicas = 'min_replicas',
  MaxReplicas = 'max_replicas',
  MultiAz = 'multi_az',
  NodesCompute = 'nodes_compute',
  MachineTypeForceChoice = 'machine_type_force_choice',
  FipsCryptography = 'fips',
  IMDS = 'imds',
  ApplicationIngress = 'applicationIngress',
  DefaultRouterSelectors = 'defaultRouterSelectors',
  DefaultRouterExcludedNamespacesFlag = 'defaultRouterExcludedNamespacesFlag',
  IsDefaultRouterNamespaceOwnershipPolicyStrict = 'isDefaultRouterNamespaceOwnershipPolicyStrict',
  IsDefaultRouterWildcardPolicyAllowed = 'isDefaultRouterWildcardPolicyAllowed',
}

export const initialValues: FormikValues = {
  [FieldId.AutomaticUpgradeSchedule]: '0 0 * * 0',
};

export enum CloudProviderType {
  Aws = 'aws',
  Gcp = 'gcp',
}

export enum UpgradePolicyType {
  Automatic = 'automatic',
  Manual = 'manual',
}

export enum IMDSType {
  V1AndV2 = 'optional',
  V2Only = 'required',
}
