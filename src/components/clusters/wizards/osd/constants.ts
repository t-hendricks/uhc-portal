import { FormikValues } from 'formik';

import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import {
  HOST_PREFIX_DEFAULT,
  MACHINE_CIDR_DEFAULT,
  SERVICE_CIDR_DEFAULT,
} from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/networkingConstants';
import {
  FieldId as CommonFieldId,
  CloudProviderType,
  UpgradePolicyType,
} from '~/components/clusters/wizards/common/constants';
import { BreadcrumbPath } from '~/components/common/Breadcrumbs';
import { ClusterPrivacyType } from './Networking/constants';

export enum OsdFieldId {
  // TODO: many fields here should move to common/constants.
  AccountId = 'account_id',
  AccessKeyId = 'access_key_id',
  SecretAccessKey = 'secret_access_key',
  GcpServiceAccount = 'gcp_service_account',
  Region = 'region',
  CustomerManagedKey = 'customer_managed_key',
  CustomerOperatorRolesPrefix = 'custom_operator_roles_prefix',
  ClusterVersion = 'cluster_version',
  PersistentStorage = 'persistent_storage',
  ClusterName = 'name',
  LoadBalancers = 'load_balancers',
  EnableUserWorkloadMonitoring = 'enable_user_workload_monitoring',
  EtcdEncryption = 'etcd_encryption',
  ClusterPrivacy = 'cluster_privacy',
  ConfigureProxy = 'configure_proxy',
  InstallToVpc = 'install_to_vpc',
  UsePrivateLink = 'use_privatelink',
  PublicSubnetId = 'public_subnet_id',
  PrivateSubnetId = 'private_subnet_id',
  KeyLocation = 'key_location',
  KeyRing = 'key_ring',
  KeyName = 'key_name',
  KmsKeyArn = 'kms_key_arn',
  KmsServiceAccount = 'kms_service_account',
  VpcName = 'vpc_name',
  ComputeSubnet = 'compute_subnet',
  ControlPlaneSubnet = 'control_plane_subnet',
  FirstAvailabilityZone = 'az_0',
  SecondAvailabilityZone = 'az_1',
  ThirdAvailabilityZone = 'az_2',
  HttpProxyUrl = 'http_proxy_url',
  HttpsProxyUrl = 'https_proxy_url',
  AdditionalTrustBundle = 'additional_trust_bundle',
  DisableScpChecks = 'disable_scp_checks',
  NoProxyDomains = 'no_proxy_domains',
  NetworkMachineCidr = 'network_machine_cidr',
  NetworkServiceCidr = 'network_service_cidr',
  NetworkPodCidr = 'network_pod_cidr',
  NetworkHostPrefix = 'network_host_prefix',
  NetworkMachineCidrSingleAz = 'network_machine_cidr_single_az',
  NetworkMachineCidrMultiAz = 'network_machine_cidr_multi_az',
}

export const FieldId = { ...CommonFieldId, ...OsdFieldId };

export enum StepName {
  BillingModel = 'Billing model',
  ClusterSettings = 'Cluster settings',
  CloudProvider = 'Cloud provider',
  Details = 'Details',
  MachinePool = 'Machine pool',
  Networking = 'Networking',
  Configuration = 'Configuration',
  VpcSettings = 'VPC settings',
  ClusterProxy = 'Cluster-wide proxy',
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
  NetworkingVpcSettings = 'networking-vpc-settings',
  NetworkingClusterProxy = 'networking-cluster-proxy',
  NetworkingCidrRanges = 'networking-cidr-ranges',
  ClusterUpdates = 'cluster-updates',
  Review = 'review',
}

export enum UrlPath {
  Create = '/create',
  CreateOsd = '/create/osd',
  CreateCloud = '/create/cloud',
}

export const breadcrumbs: BreadcrumbPath[] = [
  { label: 'Clusters' },
  { label: 'Cluster Type', path: UrlPath.Create },
  { label: 'OpenShift Dedicated', path: UrlPath.CreateOsd },
];

export const initialValues: FormikValues = {
  [FieldId.Product]: normalizedProducts.OSD,
  [FieldId.Byoc]: 'false',
  [FieldId.CloudProvider]: CloudProviderType.Aws,
  [FieldId.AcknowledgePrereq]: false,
  [FieldId.BillingModel]: billingModels.STANDARD,
  [FieldId.MultiAz]: 'false',
  [FieldId.EnableUserWorkloadMonitoring]: true,
  [FieldId.NodeLabels]: [{ key: '', value: '' }],
  [FieldId.ClusterPrivacy]: ClusterPrivacyType.External,
  [FieldId.CidrDefaultValuesEnabled]: true,
  [FieldId.NetworkMachineCidr]: MACHINE_CIDR_DEFAULT,
  [FieldId.NetworkServiceCidr]: SERVICE_CIDR_DEFAULT,
  [FieldId.NetworkHostPrefix]: HOST_PREFIX_DEFAULT,
  [FieldId.UpgradePolicy]: UpgradePolicyType.Manual,
  [FieldId.AutomaticUpgradeSchedule]: '0 0 * * 0',
  [FieldId.NodeDrainGracePeriod]: 60,
  [FieldId.PersistentStorage]: '107374182400',
  [FieldId.LoadBalancers]: 0,
  [FieldId.DisableScpChecks]: false,
  [FieldId.CustomerManagedKey]: 'false',
};

export const initialTouched = {
  [FieldId.AcknowledgePrereq]: true,
};

export const clusterNameHint =
  'This name identifies your cluster in OpenShift Cluster Manager and forms part of the cluster console subdomain.';
export const documentTitle =
  'Create an OpenShift Dedicated cluster | Red Hat OpenShift Cluster Manager';
export const ariaLabel = 'Create OpenShift Dedicated cluster wizard';
