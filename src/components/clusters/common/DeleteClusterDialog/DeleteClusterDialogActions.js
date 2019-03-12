import { deleteClusterDialogConstants } from './DeleteClusterDialogConstants';
import { clusterService } from '../../../../services';

const deleteCluster = (clusterID, managed) => ({
  type: deleteClusterDialogConstants.DELETE_CLUSTER,
  payload: managed
    ? clusterService.deleteCluster(clusterID)
    : clusterService.deleteSelfManagedCluster(clusterID),
});

const deletedClusterResponse = () => ({
  type: deleteClusterDialogConstants.CLEAR_DELETE_CLUSTER_RESPONSE,
});

const deleteClusterDialogActions = {
  deleteCluster,
  deletedClusterResponse,
};

export {
  deleteClusterDialogActions,
  deleteCluster,
  deletedClusterResponse,
};
