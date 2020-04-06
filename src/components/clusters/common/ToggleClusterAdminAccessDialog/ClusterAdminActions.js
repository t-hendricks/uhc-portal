import { clusterService } from '../../../../services';
import { EDIT_CLUSTER } from '../../../../redux/constants/clustersConstants';

const toggleClusterAdminAccess = (clusterID, currentState) => ({
  type: EDIT_CLUSTER,
  payload: clusterService.editCluster(clusterID, { cluster_admin_enabled: !currentState }),
});


export default toggleClusterAdminAccess;
