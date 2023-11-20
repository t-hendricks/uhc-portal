import { isHypershiftCluster } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { Cluster } from '~/types/clusters_mgmt.v1';

enum SupportedFeatures {
  SECURITY_GROUPS = 'securityGroups',
}

type ClusterParams = Partial<Cluster>;
type CompatibilityOptions = { day1?: boolean; day2?: boolean };

const checkAWSSecurityGroupsCompatibility = (
  clusterParams: ClusterParams,
  options: CompatibilityOptions,
) => {
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

  // For Day2, is must be an STS cluster, as otherwise we can't fetch the VPCs with the Security groups
  const hasSTSRole = clusterParams?.aws?.sts?.role_arn;
  if (options.day2 && !hasSTSRole) {
    return false;
  }

  // TODO camador Oct'23 must be updated to cover Day1 too.
  // Since ATM this function will only be used for Day2, at this point we can return true
  return true;
};

/**
 * Checks is a given feature is compatible with the provided options
 * @param feature feature to validate for compatibility
 * @param clusterParams cluster features necessary to determine compatibility
 * @param options when not provided an option, it's assumed it doesn't affect the compatibility status
 */
const isCompatibleFeature = (
  feature: SupportedFeatures,
  clusterParams: ClusterParams,
  options: CompatibilityOptions,
) => {
  switch (feature) {
    case SupportedFeatures.SECURITY_GROUPS:
      return checkAWSSecurityGroupsCompatibility(clusterParams, options);
    // TODO camador Oct'23: Move functions such as "canConfigureSharedVpc" etc once the code base is stabilised and merged to all branches
    default:
      return false;
  }
};

export { isCompatibleFeature, SupportedFeatures, CompatibilityOptions };
