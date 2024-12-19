import { clusterService } from '../../../../../services';

import { deleteClusterDialogConstants } from './DeleteClusterDialogConstants';

const deleteCluster = (clusterID) => ({
  type: deleteClusterDialogConstants.DELETE_CLUSTER,
  payload: clusterService.deleteCluster(clusterID),
});

const deletedClusterResponse = () => ({
  type: deleteClusterDialogConstants.CLEAR_DELETE_CLUSTER_RESPONSE,
});

const deleteClusterDialogActions = {
  deleteCluster,
  deletedClusterResponse,
};

export { deleteClusterDialogActions, deleteCluster, deletedClusterResponse };
