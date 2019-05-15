import { deleteClusterDialogConstants } from './DeleteClusterDialogConstants';
import { clusterService } from '../../../../services';

const deleteCluster = clusterID => ({
  type: deleteClusterDialogConstants.DELETE_CLUSTER,
  payload: clusterService.deleteCluster(clusterID),
});

// This updates the cluster (typically for AWS credentials and such) so that it can be deleted
const updateAndDeleteCluster = (clusterID, attrs) => ({
  type: deleteClusterDialogConstants.DELETE_CLUSTER,
  payload: clusterService.editCluster(clusterID, attrs)
    .then(() => clusterService.deleteCluster(clusterID)),
});

const deletedClusterResponse = () => ({
  type: deleteClusterDialogConstants.CLEAR_DELETE_CLUSTER_RESPONSE,
});

const deleteClusterDialogActions = {
  deleteCluster,
  updateAndDeleteCluster,
  deletedClusterResponse,
};

export {
  deleteClusterDialogActions,
  deleteCluster,
  updateAndDeleteCluster,
  deletedClusterResponse,
};
