import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAWSCloudProviderVPCs } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';

/**
 * React hook fetching VPCs for a node pool. Request args extracted from cluster in global redux state.
 * @returns current vpcs state.
 */
export const useAWSVPCsFromCluster = () => {
  const dispatch = useDispatch();
  const cluster = useSelector((state) => state.clusters.details.cluster);
  const vpcs = useSelector((state) => state.ccsInquiries.vpcs);

  useEffect(() => {
    const subnet =
      cluster.aws && cluster.aws.subnet_ids && cluster.aws.subnet_ids[0]
        ? cluster.aws.subnet_ids[0]
        : undefined;
    dispatch(
      getAWSCloudProviderVPCs(
        { sts: { role_arn: cluster.aws.sts.role_arn } },
        cluster.region.id,
        subnet,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return vpcs;
};
