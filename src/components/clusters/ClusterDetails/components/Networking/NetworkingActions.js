import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import { strToCleanObject } from '../../../../../common/helpers';
import { networkingConstants } from './NetworkingConstants';
import { setClusterDetails } from '../../../../../redux/actions/clustersActions';
import { clusterService } from '../../../../../services';

const getClusterRouters = (clusterID) => (dispatch) =>
  dispatch({
    type: networkingConstants.GET_CLUSTER_ROUTERS,
    payload: clusterService.getIngresses(clusterID),
  });

const editClusterRouters = (clusterID, data) => (dispatch) =>
  dispatch({
    type: networkingConstants.EDIT_CLUSTER_ROUTERS,
    payload: clusterService.editIngresses(clusterID, data),
  });

const resetEditRoutersResponse = () => (dispatch) =>
  dispatch({
    type: networkingConstants.RESET_EDIT_ROUTERS_RESPONSE,
  });

const resetClusterRouters = () => (dispatch) =>
  dispatch({
    type: networkingConstants.RESET_CLUSTER_ROUTERS,
  });

const sendNetworkConfigRequests = async (newData, currentData, clusterID, dispatch) => {
  let result;

  // API privacy setting changed
  if (currentData.APIPrivate !== newData.private_api) {
    const clusterRequest = {
      api: {
        listening: newData.private_api ? 'internal' : 'external',
      },
    };
    result = await clusterService.editCluster(clusterID, clusterRequest);
    if (result.status === 204) {
      // editing cluster succeeded.
      // modify the details in state now (instead of waiting for a refresh) to avoid flicker
      dispatch(setClusterDetails(clusterRequest, true));
    }
  }

  const requestDefaultRouter = {
    id: currentData.default.routerID,
  };
  const requestAdditionalRouter = {};
  const hadAdditionalRouter = has(currentData, 'additional');
  const additionalRouterDeleted = hadAdditionalRouter && !newData.enable_additional_router;
  const additionalRouterCreated = !hadAdditionalRouter && newData.enable_additional_router;
  const defaultRouterEdited = newData.private_default_router !== currentData.default.isPrivate;
  const defaultRouterLBEdited =
    newData.load_balancer !== (currentData.default.loadBalancer === 'nlb');

  // Edit default router
  if (defaultRouterEdited) {
    requestDefaultRouter.listening = newData.private_default_router ? 'internal' : 'external';
  }

  if (defaultRouterLBEdited) {
    requestDefaultRouter.load_balancer = newData.load_balancer ? 'nlb' : 'classic';
  }

  // Edit existing additional router
  if (!additionalRouterDeleted && hadAdditionalRouter) {
    if (newData.private_additional_router !== currentData.additional.isPrivate) {
      requestAdditionalRouter.listening = newData.private_additional_router
        ? 'internal'
        : 'external';
      requestAdditionalRouter.id = currentData.additional.routerID;
    }
    if (newData.labels_additional_router !== currentData.additional.routeSelectors) {
      requestAdditionalRouter.route_selectors = strToCleanObject(
        newData.labels_additional_router,
        '=',
      );
      requestAdditionalRouter.id = currentData.additional.routerID;
    }
  }

  // Add new additional router
  if (additionalRouterCreated) {
    requestAdditionalRouter.listening = newData.private_additional_router ? 'internal' : 'external';
    requestAdditionalRouter.route_selectors = strToCleanObject(
      newData.labels_additional_router,
      '=',
    );
  }

  if (defaultRouterEdited || defaultRouterLBEdited) {
    result = await clusterService.editIngress(
      clusterID,
      requestDefaultRouter.id,
      requestDefaultRouter,
    );
  }
  if (additionalRouterDeleted) {
    result = await clusterService.deleteAdditionalIngress(
      clusterID,
      currentData.additional.routerID,
      requestDefaultRouter,
    );
  }
  if (!isEmpty(requestAdditionalRouter)) {
    if (additionalRouterCreated) {
      result = await clusterService.addAdditionalIngress(clusterID, requestAdditionalRouter);
    } else {
      result = await clusterService.editIngress(
        clusterID,
        requestAdditionalRouter.id,
        requestAdditionalRouter,
      );
    }
  }
  return result;
};

const saveNetworkingConfiguration = (newData, currentData, clusterID) => (dispatch) =>
  dispatch({
    type: networkingConstants.EDIT_CLUSTER_ROUTERS,
    payload: sendNetworkConfigRequests(newData, currentData, clusterID, dispatch),
  });

const networkingActions = {
  getClusterRouters,
  editClusterRouters,
  saveNetworkingConfiguration,
  resetClusterRouters,
  resetEditRoutersResponse,
};

export {
  networkingActions,
  getClusterRouters,
  editClusterRouters,
  saveNetworkingConfiguration,
  resetClusterRouters,
  resetEditRoutersResponse,
};
