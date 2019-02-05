import { clusterConstants } from './ClusterConstants';
import { clusterService } from '../../services';

const deleteCluster = (clusterID, managed) => ({
  type: clusterConstants.DELETE_CLUSTER,
  payload: managed
    ? clusterService.deleteCluster(clusterID)
    : clusterService.deleteSelfManagedCluster(clusterID),
});

const deletedClusterResponse = () => ({
  type: clusterConstants.CLEAR_DELETE_CLUSTER_RESPONSE,
});

const clusterActions = {
  deleteCluster,
  deletedClusterResponse,
};

export {
  clusterActions,
  deleteCluster,
  deletedClusterResponse,
};
