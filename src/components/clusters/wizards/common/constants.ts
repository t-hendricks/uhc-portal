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
  CidrDefaultValuesToggle = 'cidr_default_values_toggle',
  NetworkMachineCidr = 'network_machine_cidr',
  NetworkServiceCidr = 'network_service_cidr',
  NetworkPodCidr = 'network_pod_cidr',
  NetworkHostPrefix = 'network_host_prefix',
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
  EnableUserWorkloadMonitoring = 'enable_user_workload_monitoring',
  NodesCompute = 'nodes_compute',
  MachineTypeForceChoice = 'machine_type_force_choice',
  FipsCryptography = 'fips',
  IMDS = 'imds',
  ApplicationIngress = 'applicationIngress',
  DefaultRouterSelectors = 'defaultRouterSelectors',
  DefaultRouterExcludedNamespacesFlag = 'defaultRouterExcludedNamespacesFlag',
  IsDefaultRouterNamespaceOwnershipPolicyStrict = 'isDefaultRouterNamespaceOwnershipPolicyStrict',
  IsDefaultRouterWildcardPolicyAllowed = 'isDefaultRouterWildcardPolicyAllowed',
  SecurityGroupIds = 'securityGroupIds',
  ComputeSubnet = 'compute_subnet',
  ControlPlaneSubnet = 'control_plane_subnet',
  MachinePoolsSubnets = 'machinePoolsSubnets', // OSD AWS / ROSA classic
  Region = 'region',
  VpcName = 'vpc_name', // OSD GCP (shared VPC)
  SelectedVpc = 'selected_vpc', // OSD AWS / ROSA classic
  ClusterName = 'name',
  ClusterVersion = 'cluster_version',
  CustomerManagedKey = 'customer_managed_key',
  KmsKeyArn = 'kms_key_arn',
  EtcdEncryption = 'etcd_encryption',
  ConfigureProxy = 'configure_proxy',
  UsePrivateLink = 'use_privatelink',
  InstallerRoleArn = 'installer_role_arn',
  InstallToVpc = 'install_to_vpc',
  GcpServiceAccount = 'gcp_service_account',
  DomainPrefix = 'domain_prefix',
  HasDomainPrefix = 'has_domain_prefix',
  AccountId = 'account_id',
  AccessKeyId = 'access_key_id',
  AdditionalTrustBundle = 'additional_trust_bundle',
  ByoOidcConfigId = 'byo_oidc_config_id',
  ByoOidcConfigIdManaged = 'byo_oidc_config_id_managed',
  CustomOperatorRolesPrefix = 'custom_operator_roles_prefix',
  DetectedOcmRole = 'detected_ocm_role',
  DisableScpChecks = 'disable_scp_checks',
  HttpProxyUrl = 'http_proxy_url',
  HttpsProxyUrl = 'https_proxy_url',
  NoProxyDomains = 'no_proxy_domains',
  RosaCreatorArn = 'rosa_creator_arn',
  RosaRolesProviderCreationMode = 'rosa_roles_provider_creation_mode',
  SecretAccessKey = 'secret_access_key',
  SecurityGroups = 'securityGroups',
  EnableExteranlAuthentication = 'enable_external_authentication',
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

export const AWS_DEFAULT_REGION = 'us-east-1';
export const GCP_DEFAULT_REGION = 'us-east1';

export const emptyAWSSubnet = () => ({
  availabilityZone: '',
  privateSubnetId: '',
  publicSubnetId: '',
});
