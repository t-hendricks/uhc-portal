import { WifConfig } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/tempWifTypes/WifConfig';

export enum CloudProviderType {
  Aws = 'aws',
  Gcp = 'gcp',
}

export enum GCPAuthType {
  WorkloadIdentityFederation = 'workloadIdentityFederation',
  ServiceAccounts = 'serviceAccounts',
}

export interface WifConfigList {
  items: WifConfig[];
  page: number;
  size: number;
  total: number;
}
