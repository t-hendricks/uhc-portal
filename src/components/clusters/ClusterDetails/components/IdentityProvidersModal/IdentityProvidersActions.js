import { identityProvidersConstants } from './IdentityProvidersConstants';
import { clusterService } from '../../../../../services';

const getClusterIdentityProviders = clusterID => dispatch => dispatch({
  type: identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS,
  payload: clusterService.getIdentityProviders(clusterID),
});

const createClusterIdentityProvider = (clusterID, params) => dispatch => dispatch({
  type: identityProvidersConstants.CREATE_CLUSTER_IDENTITY_PROVIDER,
  payload: clusterService
    .createClusterIdentityProvider(clusterID, params)
    .then(response => (response)),
});

const resetCreatedClusterIDPResponse = () => dispatch => dispatch({
  type: identityProvidersConstants.RESET_CREATED_CLUSTER_IDP_RESPONSE,
});

const deleteIDP = (clusterID, idpID) => dispatch => dispatch({
  type: identityProvidersConstants.DELETE_IDENTITY_PROVIDER,
  payload: clusterService.deleteIdentityProvider(clusterID, idpID),
});

const resetDeletedIDPResponse = () => dispatch => dispatch({
  type: identityProvidersConstants.RESET_DELETED_IDP_RESPONSE,
});

const resetIdentityProvidersState = () => dispatch => dispatch({
  type: identityProvidersConstants.RESET_IDENTITY_PROVIDERS_STATE,
});

const clusterIdentityActions = {
  getClusterIdentityProviders,
  createClusterIdentityProvider,
  resetCreatedClusterIDPResponse,
  deleteIDP,
  resetDeletedIDPResponse,
  resetIdentityProvidersState,
};

export {
  clusterIdentityActions,
  getClusterIdentityProviders,
  createClusterIdentityProvider,
  resetCreatedClusterIDPResponse,
  deleteIDP,
  resetDeletedIDPResponse,
  resetIdentityProvidersState,
};
