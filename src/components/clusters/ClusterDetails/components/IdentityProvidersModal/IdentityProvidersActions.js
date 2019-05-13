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

const clusterIdentityActions = {
  getClusterIdentityProviders,
  createClusterIdentityProvider,
  resetCreatedClusterIDPResponse,
};

export {
  clusterIdentityActions,
  getClusterIdentityProviders,
  createClusterIdentityProvider,
  resetCreatedClusterIDPResponse,
};
