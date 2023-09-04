import { action, ActionType } from 'typesafe-actions';
import { ClusterAutoscaler } from '~/types/clusters_mgmt.v1';
import {
  getClusterAutoScalingSubmitSettings,
  getDefaultClusterAutoScaling,
} from '~/components/clusters/CreateOSDPage/clusterAutoScalingValues';
import { clusterAutoscalerConstants } from '../constants';
import { clusterService } from '../../services';

const getClusterAutoscaler = (clusterID: string) =>
  action(
    clusterAutoscalerConstants.GET_CLUSTER_AUTOSCALER,
    clusterService.getClusterAutoscaler(clusterID).then((response) => response.data),
  );

const clearClusterAutoscalerResponse = () =>
  action(clusterAutoscalerConstants.CLEAR_GET_CLUSTER_AUTOSCALER_RESPONSE);

const enableClusterAutoscaler = (clusterID: string) =>
  action(
    clusterAutoscalerConstants.ENABLE_CLUSTER_AUTOSCALER,
    clusterService
      .enableClusterAutoscaler(
        clusterID,
        getClusterAutoScalingSubmitSettings(getDefaultClusterAutoScaling()),
      )
      .then((response) => response.data),
  );

const disableClusterAutoscaler = (clusterID: string) =>
  action(
    clusterAutoscalerConstants.DISABLE_CLUSTER_AUTOSCALER,
    clusterService.disableClusterAutoscaler(clusterID).then((response) => response.data),
  );

const updateClusterAutoscaler = (clusterID: string, autoscaler: ClusterAutoscaler) =>
  action(
    clusterAutoscalerConstants.UPDATE_CLUSTER_AUTOSCALER,
    clusterService.updateClusterAutoscaler(clusterID, autoscaler).then((response) => response.data),
  );

const setHasInitialClusterAutoscaler = (hasAutoscaler: boolean) =>
  action(clusterAutoscalerConstants.SET_HAS_INITIAL_AUTOSCALER, hasAutoscaler);

const clearLastAutoscalerActionResult = () =>
  action(clusterAutoscalerConstants.CLEAR_LAST_ACTION_RESULT);

const clusterAutoscalerActions = {
  getClusterAutoscaler,
  enableClusterAutoscaler,
  disableClusterAutoscaler,
  updateClusterAutoscaler,
  clearLastAutoscalerActionResult,
  clearClusterAutoscalerResponse,
  setHasInitialClusterAutoscaler,
};

type ClusterAutoscalerAction = ActionType<typeof clusterAutoscalerActions>;

export { clusterAutoscalerActions, ClusterAutoscalerAction };
