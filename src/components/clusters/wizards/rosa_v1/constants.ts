import { FormikValues } from 'formik';

import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { isMajorMinorEqualOrGreater, splitVersion } from '~/common/versionHelpers';
import {
  CloudProviderType,
  FieldId as CommonFieldId,
  IMDSType,
} from '~/components/clusters/wizards/common/constants';
import { BreadcrumbPath } from '~/components/common/Breadcrumbs';

export enum RosaFieldId {}

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

export enum UrlPath {
  Create = '/create',
  CreateGetStarted = '/create/rosa/getstarted',
}

export const breadcrumbs: BreadcrumbPath[] = [
  { label: 'Clusters' },
  { label: 'Cluster Type', path: UrlPath.Create },
  { label: 'Set up ROSA', path: UrlPath.CreateGetStarted },
  { label: 'Create a ROSA Cluster' },
];

export const initialValues: FormikValues = {
  [FieldId.Product]: normalizedProducts.ROSA,
  [FieldId.CloudProvider]: CloudProviderType.Aws,
  [FieldId.Byoc]: 'true',
  [FieldId.BillingModel]: billingModels.STANDARD,
  [FieldId.NodeLabels]: [{ key: '', value: '' }],
  [FieldId.IMDS]: IMDSType.V1AndV2,
};

export const canSelectImds = (clusterVersionRawId: string): boolean => {
  const [major, minor] = splitVersion(clusterVersionRawId);
  return major > 4 || (major === 4 && minor >= 11);
};

export const canConfigureDayOneManagedIngress = (clusterVersionRawId: string): boolean =>
  isMajorMinorEqualOrGreater(clusterVersionRawId, 4, 14);
