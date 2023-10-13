import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGlobalState } from '~/redux/hooks';

import { getAWSCloudProviderVPCs } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';

/**
 * React hook fetching VPCs for a node pool. Request args extracted from cluster in global redux state.
 * @returns current vpcs state.
 */
export const useAWSVPCsFromCluster = (options?: { includeSecurityGroups: boolean }) => {
  const dispatch = useDispatch();
  const cluster = useGlobalState((state) => state.clusters.details.cluster);
  const vpcs = useGlobalState((state) => state.ccsInquiries.vpcs);

  useEffect(() => {
    const subnet =
      cluster.aws && cluster.aws.subnet_ids && cluster.aws.subnet_ids[0]
        ? cluster.aws.subnet_ids[0]
        : undefined;
    const roleArn = cluster.aws?.sts?.role_arn;
    if (roleArn) {
      dispatch(
        getAWSCloudProviderVPCs({
          awsCredentials: { sts: { role_arn: roleArn } },
          region: cluster.region?.id || '',
          subnet,
          options,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return vpcs;
};
