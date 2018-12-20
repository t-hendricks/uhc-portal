import { clusterConstants } from './ClusterConstants';
import { clusterService } from '../../services';

const deleteCluster = clusterID => ({
  type: clusterConstants.DELETE_CLUSTER,
  payload: clusterService.deleteCluster(clusterID),
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
