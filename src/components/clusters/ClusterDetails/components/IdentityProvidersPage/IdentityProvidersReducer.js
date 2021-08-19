/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import produce from 'immer';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../common/errors';
import { identityProvidersConstants } from './IdentityProvidersConstants';

const initialState = {
  clusterIdentityProviders: {
    ...baseRequestState,
    clusterIDPList: [],
  },
  createdClusterIDP: {
    ...baseRequestState,
    data: {},
  },
  deletedIDP: {
    ...baseRequestState,
  },
  editClusterIDP: {
    ...baseRequestState,
    data: {},
  },
};

function IdentityProvidersReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case identityProvidersConstants.RESET_IDENTITY_PROVIDERS_STATE:
        return initialState;
      // GET_CLUSTER_IDENTITY_PROVIDERS
      case REJECTED_ACTION(identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS):
        draft.clusterIdentityProviders = {
          ...initialState.clusterIdentityProviders,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS):
        draft.clusterIdentityProviders.pending = true;
        break;
      case FULFILLED_ACTION(identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS):
        draft.clusterIdentityProviders = {
          ...initialState.clusterIdentityProviders,
          clusterIDPList: action.payload.data.items || [],
          fulfilled: true,
        };
        break;

      // CREATE_CLUSTER_IDENTITY_PROVIDER
      case REJECTED_ACTION(identityProvidersConstants.CREATE_CLUSTER_IDENTITY_PROVIDER):
        draft.createdClusterIDP = {
          ...initialState.createdClusterIDP,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(identityProvidersConstants.CREATE_CLUSTER_IDENTITY_PROVIDER):
        draft.createdClusterIDP.pending = true;
        break;
      case FULFILLED_ACTION(identityProvidersConstants.CREATE_CLUSTER_IDENTITY_PROVIDER):
        draft.createdClusterIDP = {
          ...initialState.createdClusterIDP,
          fulfilled: true,
          clusterIdentityProviders: action.payload.data,
        };
        break;
        // UPDATE_CLUSTER_IDENTITY_PROVIDER
      case REJECTED_ACTION(identityProvidersConstants.UPDATE_CLUSTER_IDENTITY_PROVIDER):
        draft.editClusterIDP = {
          ...initialState.editClusterIDP,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(identityProvidersConstants.UPDATE_CLUSTER_IDENTITY_PROVIDER):
        draft.editClusterIDP.pending = true;
        break;
      case FULFILLED_ACTION(identityProvidersConstants.UPDATE_CLUSTER_IDENTITY_PROVIDER):
        draft.editClusterIDP = {
          ...initialState.editClusterIDP,
          fulfilled: true,
          clusterIdentityProviders: action.payload.data,
        };
        break;

      // RESET_CREATED_CLUSTER_IDP_RESPONSE
      case identityProvidersConstants.RESET_CREATED_CLUSTER_IDP_RESPONSE:
        draft.createdClusterIDP = {
          ...initialState.createdClusterIDP,
        };
        draft.editClusterIDP = {
          ...initialState.editClusterIDP,
        };
        break;

        // DELETE_IDP
      case PENDING_ACTION(identityProvidersConstants.DELETE_IDENTITY_PROVIDER):
        draft.deletedIDP.pending = true;
        break;
      case REJECTED_ACTION(identityProvidersConstants.DELETE_IDENTITY_PROVIDER):
        draft.deletedIDP = {
          ...initialState.deletedIDP,
          ...getErrorState(action),
        };
        break;
      case FULFILLED_ACTION(identityProvidersConstants.DELETE_IDENTITY_PROVIDER):
        draft.deletedIDP = {
          ...initialState.deletedIDP,
          fulfilled: true,
        };
        break;
      // RESET_DELETED_CLUSTER_IDP_RESPONSE
      case identityProvidersConstants.RESET_DELETED_IDP_RESPONSE:
        draft.deletedIDP = {
          ...initialState.deletedIDP,
        };
        break;
    }
  });
}

IdentityProvidersReducer.initialState = initialState;

export { initialState, IdentityProvidersReducer };

export default IdentityProvidersReducer;
