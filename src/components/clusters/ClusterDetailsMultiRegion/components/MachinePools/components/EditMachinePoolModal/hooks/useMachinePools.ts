import * as React from 'react';
import { useDispatch } from 'react-redux';

import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { useGlobalState } from '~/redux/hooks';
import { Cluster } from '~/types/clusters_mgmt.v1';

import { getMachineOrNodePools } from '../../../MachinePoolsActions';

const useMachinePools = (cluster?: Cluster) => {
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
