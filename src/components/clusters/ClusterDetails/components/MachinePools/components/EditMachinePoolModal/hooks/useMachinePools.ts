import * as React from 'react';
import { useDispatch } from 'react-redux';
import { isHypershiftCluster } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { useGlobalState } from '~/redux/hooks';

import { getMachineOrNodePools } from '../../../MachinePoolsActions';

const useMachinePools = (cluster: Cluster) => {
  const dispatch = useDispatch();
  const hypershiftCluster = isHypershiftCluster(cluster);
  React.useEffect(() => {
    if (cluster?.id) {
      getMachineOrNodePools(cluster.id, hypershiftCluster)(dispatch);
    }
  }, [dispatch, cluster.id, hypershiftCluster]);

  const machinePoolsResponse = useGlobalState((state) => state.machinePools.getMachinePools);

  return machinePoolsResponse;
};

export default useMachinePools;
