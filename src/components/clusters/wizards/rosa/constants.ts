import { FormikValues } from 'formik';

import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { BreadcrumbPath } from '~/components/common/Breadcrumbs';
import {
  FieldId as CommonFieldId,
  CloudProviderType,
  IMDSType,
} from '~/components/clusters/wizards/common/constants';
// TODO: use versionHelpers instead
import { splitMajorMinor } from '../../common/Upgrades/UpgradeAcknowledge/UpgradeAcknowledgeSelectors';

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
  { label: 'Get Started with ROSA', path: UrlPath.CreateGetStarted },
  { label: 'Create a ROSA Cluster' },
];

export const initialValues: FormikValues = {
  [FieldId.Product]: normalizedProducts.ROSA,
  [FieldId.CloudProvider]: CloudProviderType.Aws,
  [FieldId.Byoc]: 'true',
  [FieldId.BillingModel]: billingModels.STANDARD,
  [FieldId.NodeLabels]: [{ key: '', value: '' }],
  [FieldId.IMDS]: IMDSType.V1_and_V2,
};

export const canSelectImds = (clusterVersionRawId: string): boolean => {
  const [major, minor] = splitMajorMinor(clusterVersionRawId);
  return major > 4 || (major === 4 && minor >= 11);
};
