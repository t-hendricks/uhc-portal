import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import { strToCleanObject } from '../../../../../common/helpers';
import { networkingConstants } from './NetworkingConstants';
import { clusterService } from '../../../../../services';

const getClusterRouters = clusterID => dispatch => dispatch({
  type: networkingConstants.GET_CLUSTER_ROUTERS,
  payload: clusterService.getIngresses(clusterID),
});

const editClusterRouters = (clusterID, data) => dispatch => dispatch({
  type: networkingConstants.EDIT_CLUSTER_ROUTERS,
  payload: clusterService.editIngresses(clusterID, data),
});

const resetEditRoutersResponse = () => dispatch => dispatch({
  type: networkingConstants.RESET_EDIT_ROUTERS_RESPONSE,
});

const resetClusterRouters = () => dispatch => dispatch({
  type: networkingConstants.RESET_CLUSTER_ROUTERS,
});

const sendNetworkConfigRequests = (newData, currentData, clusterID) => {
  const promises = [];
  let result;

  // API privacy setting changed
  if (currentData.APIPrivate !== newData.private_api) {
    const clusterRequest = {
      api: {
        listening: newData.private_api,
      },
    };
    promises.push(clusterService.editCluster(clusterID, clusterRequest));
  }

  const requestDefaultRouter = {
    id: currentData.default.routerID,
  };
  const requestAdditionalRouter = {};
  const hadAdditionalRouter = has(currentData, 'additional');
  const additionalRouterDeleted = hadAdditionalRouter && !newData.enable_additional_router;
  const additionalRouterCreated = !hadAdditionalRouter && newData.enable_additional_router;
  const defaultRouterEdited = newData.private_default_router !== currentData.default.isPrivate;

  // Edit default router
  if (defaultRouterEdited) {
    requestDefaultRouter.listening = newData.private_default_router ? 'internal' : 'external';
  }

  // Edit existing additional router
  if (!additionalRouterDeleted && hadAdditionalRouter) {
    if (newData.private_additional_router !== currentData.additional.isPrivate) {
      requestAdditionalRouter.listening = newData.private_additional_router ? 'internal' : 'external';
      requestAdditionalRouter.id = currentData.additional.routerID;
    }
    if (newData.labels_additional_router !== currentData.additional.routeSelectors) {
      requestAdditionalRouter.route_selectors = strToCleanObject(newData.labels_additional_router, '=');
      requestAdditionalRouter.id = currentData.additional.routerID;
    }
  }

  // Add new additional router
  if (additionalRouterCreated) {
    requestAdditionalRouter.listening = newData.private_additional_router ? 'internal' : 'external';
    requestAdditionalRouter.route_selectors = strToCleanObject(newData.labels_additional_router, '=');
  }

  if (defaultRouterEdited) {
    promises.push(
      clusterService.editIngress(clusterID, requestDefaultRouter.id, requestDefaultRouter)
        .then((response) => {
          result = response;
        }),
    );
  }
  if (additionalRouterDeleted) {
    promises.push(
      clusterService.deleteAdditionalIngress(
        clusterID, currentData.additional.routerID, requestDefaultRouter,
      ).then((response) => {
        result = response;
      }),
    );
  }
  if (!isEmpty(requestAdditionalRouter)) {
    if (additionalRouterCreated) {
      promises.push(
        clusterService.addAdditionalIngress(clusterID, requestAdditionalRouter)
          .then((response) => { result = response; }),
      );
    } else {
      promises.push(
        clusterService.editIngress(clusterID, requestAdditionalRouter.id, requestAdditionalRouter)
          .then((response) => { result = response; }),
      );
    }
  }
  return Promise.all(promises)
    .then(() => result);
};

const saveNetworkingConfiguration = (newData, currentData, clusterID) => dispatch => dispatch({
  type: networkingConstants.EDIT_CLUSTER_ROUTERS,
  payload: sendNetworkConfigRequests(newData, currentData, clusterID),
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
