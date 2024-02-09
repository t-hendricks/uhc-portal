import { FormikTouched, FormikValues } from 'formik';
import { FieldId as CommonFieldId } from '~/components/clusters/wizards/common/constants';

export enum RosaFieldId {
  Hypershift = 'hypershift',
  AssociatedAwsId = 'associated_aws_id',
  BillingAccountId = 'billing_account_id',
  InstallerRoleArn = 'installer_role_arn',
  SupportRoleArn = 'support_role_arn',
  WorkerRoleArn = 'worker_role_arn',
  ControlPlaneRoleArn = 'control_plane_role_arn',
  RosaMaxOsVersion = 'rosa_max_os_version',
  InstallToVpc = 'install_to_vpc',
  UsePrivatelink = 'use_privatelink',
  ConfigureProxy = 'configure_proxy',
  ClusterVersion = 'cluster_version',
  SharedVpc = 'shared_vpc',
  DetectedOcmAndUserRoles = 'detected_ocm_and_user_roles',
}

export const FieldId = { ...CommonFieldId, ...RosaFieldId };

export enum StepName {
  AccountsAndRoles = 'Accounts and roles',
  ClusterSettings = 'Cluster settings',
  Details = 'Details',
  MachinePool = 'Machine pool',
  Networking = 'Networking',
  Configuration = 'Configuration',
  VpcSettings = 'VPC settings',
  ClusterProxy = 'Cluster-wide proxy',
  CidrRanges = 'CIDR ranges',
  ClusterRolesAndPolicies = 'Cluster roles and policies',
  ClusterUpdates = 'Cluster updates',
  Review = 'Review and create',
}

export enum StepId {
  AccountsAndRoles = 'accounts-and-roles',
  ClusterSettings = 'cluster-settings',
  ClusterSettingsDetails = 'cluster-settings-details',
  ClusterSettingsMachinePool = 'cluster-settings-machine-pool',
  Networking = 'networking',
  NetworkingConfiguration = 'networking-config',
  NetworkingVpcSettings = 'networking-vpc-settings',
  NetworkingClusterProxy = 'networking-cluster-proxy',
  NetworkingCidrRanges = 'networking-cidr-ranges',
  ClusterRolesAndPolicies = 'cluster-roles-and-policies',
  ClusterUpdates = 'cluster-updates',
  Review = 'review',
}

export const initialValues: FormikValues = {
  [FieldId.Hypershift]: 'true',
};

export const initialTouched: FormikTouched<FormikValues> = {
  [FieldId.Hypershift]: true,
};
