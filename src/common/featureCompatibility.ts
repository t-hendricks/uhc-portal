import { Cluster } from '~/types/clusters_mgmt.v1';
import { isHypershiftCluster } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';

enum SupportedFeature {
  SECURITY_GROUPS = 'securityGroups',
  AWS_SHARED_VPC = 'sharedVPC',
}
type CompatibilityOptions = { day1?: boolean; day2?: boolean };

type ClusterParams = Partial<Cluster>;

const checkAWSSecurityGroupsCompatibility = (
  clusterParams: ClusterParams,
  options: CompatibilityOptions,
) => {
  if (options.day1) {
    // This function only validates Day2, for Day1, the Security Groups section is only displayed when the cluster type allows so
    return false;
  }
  if (isHypershiftCluster(clusterParams)) {
    return false;
  }

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
const isCompatibleFeature = (
  feature: SupportedFeature,
  clusterParams: ClusterParams,
  options: CompatibilityOptions,
) => {
  switch (feature) {
    case SupportedFeature.SECURITY_GROUPS:
      return checkAWSSecurityGroupsCompatibility(clusterParams, options);
    default:
      return false;
  }
};

export { isCompatibleFeature, SupportedFeature, CompatibilityOptions };
