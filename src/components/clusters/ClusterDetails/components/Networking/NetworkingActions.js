import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';
import { NamespaceOwnershipPolicy } from '~/types/clusters_mgmt.v1/models/NamespaceOwnershipPolicy';
import { WildcardPolicy } from '~/types/clusters_mgmt.v1/models/WildcardPolicy';
import { strToKeyValueObject, stringToArrayTrimmed } from '~/common/helpers';
import { setClusterDetails } from '../../../../../redux/actions/clustersActions';
import { clusterService } from '../../../../../services';
import { networkingConstants } from './NetworkingConstants';

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

export const createDefaultRouterRequest = (newData, currentData) => {
  const requestDefaultRouter = {
    id: currentData.default.routerID,
  };

  // Edit default router
  if (
    newData.private_default_router !== undefined &&
    newData.private_default_router !== currentData.default.isPrivate
  ) {
    requestDefaultRouter.listening = newData.private_default_router ? 'internal' : 'external';
  }

  if (
    newData.defaultRouterSelectors !== undefined &&
    !isEqual(
      strToKeyValueObject(newData.defaultRouterSelectors, ''),
      currentData.default.routeSelectors || {},
    )
  ) {
    requestDefaultRouter.route_selectors = strToKeyValueObject(newData.defaultRouterSelectors, '');
  }

  if (
    newData.defaultRouterExcludedNamespacesFlag !== undefined &&
    !isEqual(
      stringToArrayTrimmed(newData.defaultRouterExcludedNamespacesFlag),
      currentData.default.excludedNamespaces || [],
    )
  ) {
    requestDefaultRouter.excluded_namespaces = stringToArrayTrimmed(
      newData.defaultRouterExcludedNamespacesFlag,
    );
  }

  if (
    newData.isDefaultRouterNamespaceOwnershipPolicyStrict !== undefined &&
    newData.isDefaultRouterNamespaceOwnershipPolicyStrict !==
      currentData.default.isNamespaceOwnershipPolicyStrict
  ) {
    requestDefaultRouter.route_namespace_ownership_policy =
      newData.isDefaultRouterNamespaceOwnershipPolicyStrict
        ? NamespaceOwnershipPolicy.STRICT
        : NamespaceOwnershipPolicy.INTER_NAMESPACE_ALLOWED;
  }

  if (
    newData.isDefaultRouterWildcardPolicyAllowed !== undefined &&
    newData.isDefaultRouterWildcardPolicyAllowed !== currentData.default.isWildcardPolicyAllowed
  ) {
    requestDefaultRouter.route_wildcard_policy = newData.isDefaultRouterWildcardPolicyAllowed
      ? WildcardPolicy.WILDCARDS_ALLOWED
      : WildcardPolicy.WILDCARDS_DISALLOWED;
  }

  if (
    newData.is_nlb_load_balancer !== undefined &&
    newData.is_nlb_load_balancer !== (currentData.default.loadBalancer === LoadBalancerFlavor.NLB)
  ) {
    requestDefaultRouter.load_balancer_type = newData.is_nlb_load_balancer
      ? LoadBalancerFlavor.NLB
      : LoadBalancerFlavor.CLASSIC;
  }

  if (
    newData.clusterRoutesTlsSecretRef !== undefined &&
    newData.clusterRoutesTlsSecretRef !== (currentData.default.tlsSecretRef || '')
  ) {
    requestDefaultRouter.cluster_routes_tls_secret_ref = newData.clusterRoutesTlsSecretRef;
  }

  if (
    newData.clusterRoutesHostname !== undefined &&
    newData.clusterRoutesHostname !== (currentData.default.hostname || '')
  ) {
    // The API does not allow to PATCH the field without the secret ref
    requestDefaultRouter.cluster_routes_hostname = newData.clusterRoutesHostname;
    requestDefaultRouter.cluster_routes_tls_secret_ref = newData.clusterRoutesTlsSecretRef;
  }

  return requestDefaultRouter;
};

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

  const hadAdditionalRouter = has(currentData, 'additional');
  const additionalRouterDeleted = hadAdditionalRouter && !newData.enable_additional_router;

  const requestDefaultRouter = createDefaultRouterRequest(newData, currentData);

  if (Object.getOwnPropertyNames(requestDefaultRouter).length > 1 /* more than just the "id" ? */) {
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

  // All changes to the additional router are disabled due to deprecation. Delete only.

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
