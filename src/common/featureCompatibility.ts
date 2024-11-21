import { ClusterFromSubscription } from '~/types/types';

enum SupportedFeature {
  SECURITY_GROUPS = 'securityGroups',
  AWS_SHARED_VPC = 'sharedVPC',
}
type ClusterParams = Partial<ClusterFromSubscription>;

const checkAWSSecurityGroupsCompatibility = (clusterParams: ClusterParams) => {
  const cloudProvider = clusterParams?.cloud_provider?.id;
  if (cloudProvider !== 'aws') {
    return false;
  }

  // Narrowing it down to AWS BYO-VPC clusters
  const byoVPCSubnets = clusterParams?.aws?.subnet_ids || [];
  if (!byoVPCSubnets?.length) {
    return false;
  }
  return true;
};

/**
 * Checks is a given feature is compatible with the provided options
 * @param feature feature to validate for compatibility
 * @param clusterParams cluster features necessary to determine compatibility
 * @param options when not provided an option, it's assumed it doesn't affect the compatibility status
 */
const isCompatibleFeature = (feature: SupportedFeature, clusterParams: ClusterParams) => {
  switch (feature) {
    case SupportedFeature.SECURITY_GROUPS:
      return checkAWSSecurityGroupsCompatibility(clusterParams);
    default:
      return false;
  }
};

export { isCompatibleFeature, SupportedFeature };
