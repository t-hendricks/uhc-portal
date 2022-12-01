import { billingModels } from '~/common/subscriptionTypes';
import { CloudProviderType } from './ClusterSettings/CloudProvider/types';

export enum FieldId {
  BillingModel = 'billing_model',
  Byoc = 'byoc',
  Product = 'product',
  MultiAz = 'multi_az',
  CloudProvider = 'cloud_provider',
  AccountId = 'account_id',
  AccessKeyId = 'access_key_id',
  SecretAccessKey = 'secret_access_key',
  GcpServiceAccount = 'gcp_service_account',
  NodesCompute = 'nodes_compute',
  MinReplicas = 'min_replicas',
  MaxReplicas = 'max_replicas',
  Region = 'region',
  MachineTypeForceChoice = 'machine_type_force_choice',
  MachineType = 'machine_type',
  AcknowledgePrereq = 'acknowledge_prerequisites',
  CustomerManagedKey = 'customer_managed_key',
  CustomerOperatorRolesPrefix = 'custom_operator_roles_prefix',
  ClusterVersion = 'cluster_version',
  PersistentStorage = 'persistent_storage',
  ClusterName = 'name',
  LoadBalancers = 'load_balancers',
  EnableUserWorkloadMonitoring = 'enable_user_workload_monitoring',
  EtcdEncryption = 'etcd_encryption',
  AutoscalingEnabled = 'autoscalingEnabled',
  NodeLabels = 'node_labels',
  ClusterPrivacy = 'cluster_privacy',
  ConfigureProxy = 'configure_proxy',
  ConfigureClusterProxy = 'configure_cluster_proxy',
  InstallToVpc = 'install_to_vpc',
  UsePrivateLink = 'use_privatelink',
  PublicSubnetId = 'public_subnet_id',
  PrivateSubnetId = 'private_subnet_id',
  KeyLocation = 'key_location',
  KeyRing = 'key_ring',
  KeyName = 'key_name',
  KmsKeyArn = 'kms_key_arn',
  KmsServiceAccount = 'kms_service_account',
}

export enum StepName {
  BillingModel = 'Billing model',
  ClusterSettings = 'Cluster settings',
  CloudProvider = 'Cloud provider',
  Details = 'Details',
  MachinePool = 'Machine pool',
  Networking = 'Networking',
  Configuration = 'Configuration',
  CidrRanges = 'CIDR ranges',
  ClusterUpdates = 'Cluster updates',
  Review = 'Review and create',
}

export enum StepId {
  BillingModel = 'billing-model',
  ClusterSettings = 'cluster-settings',
  ClusterSettingsCloudProvider = 'cluster-settings-cloud-provider',
  ClusterSettingsDetails = 'cluster-settings-details',
  ClusterSettingsMachinePool = 'cluster-settings-machine-pool',
  Networking = 'networking',
  NetworkingConfiguration = 'networking-config',
  NetworkingCidrRanges = 'networking-cidr-ranges',
  ClusterUpdates = 'cluster-updates',
  Review = 'review',
}

export enum UrlPath {
  Create = '/create',
  CreateOsd = '/create/osd',
  CreateCloud = '/create/cloud',
}

export const breadcrumbs = [
  { label: 'Clusters' },
  { label: 'Create', path: UrlPath.Create },
  { label: 'OpenShift Dedicated', path: UrlPath.CreateOsd },
];

export const initialValues = {
  [FieldId.Product]: 'OSD',
  [FieldId.BillingModel]: billingModels.STANDARD,
  [FieldId.Byoc]: 'false',
  [FieldId.CloudProvider]: CloudProviderType.Aws,
  [FieldId.AcknowledgePrereq]: false,
  [FieldId.MultiAz]: 'false',
  [FieldId.EnableUserWorkloadMonitoring]: true,
  [FieldId.NodeLabels]: [{ key: '', value: '' }],
};

export const clusterNameHint =
  'This name identifies your cluster in OpenShift Cluster Manager and forms part of the cluster console subdomain.';
