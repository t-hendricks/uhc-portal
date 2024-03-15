import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { useGlobalState } from '~/redux/hooks';

import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { HCP_USE_NODE_UPGRADE_POLICIES } from '~/redux/constants/featureConstants';
import { getMachineOrNodePools } from '../../../MachinePoolsActions';

const useMachinePools = (cluster?: Cluster) => {
  const dispatch = useDispatch();
  const useNodeUpgradePolicies = useFeatureGate(HCP_USE_NODE_UPGRADE_POLICIES);
  const hypershiftCluster = isHypershiftCluster(cluster);
  React.useEffect(() => {
    if (cluster?.id) {
      getMachineOrNodePools(
        cluster.id,
        hypershiftCluster,
        cluster.version?.id,
        useNodeUpgradePolicies,
      )(dispatch);
    }
  }, [dispatch, cluster?.id, hypershiftCluster, cluster?.version?.id, useNodeUpgradePolicies]);

  const machinePoolsResponse = useGlobalState((state) => state.machinePools.getMachinePools);

  return machinePoolsResponse;
};

export default useMachinePools;
