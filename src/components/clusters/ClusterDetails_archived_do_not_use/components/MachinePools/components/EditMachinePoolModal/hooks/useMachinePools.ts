import * as React from 'react';
import { useDispatch } from 'react-redux';

import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { useGlobalState } from '~/redux/hooks';
import { ClusterFromSubscription } from '~/types/types';

import { getMachineOrNodePools } from '../../../MachinePoolsActions';

const useMachinePools = (cluster?: ClusterFromSubscription) => {
  const dispatch = useDispatch();
  const hypershiftCluster = isHypershiftCluster(cluster);
  React.useEffect(() => {
    if (cluster?.id) {
      getMachineOrNodePools(cluster.id, hypershiftCluster, cluster.version?.id)(dispatch);
    }
  }, [dispatch, cluster?.id, hypershiftCluster, cluster?.version?.id]);

  const machinePoolsResponse = useGlobalState((state) => state.machinePools.getMachinePools);

  return machinePoolsResponse;
};

export default useMachinePools;
