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
import helpers, { setStateProp } from '../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../common/errors';
import { identityProvidersConstants } from './IdentityProvidersConstants';

const initialState = {
  clusterIdentityProviders: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    clusterIDPList: [],
  },
  createdClusterIDP: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    data: {},
  },
  deletedIDP: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  },
};

function IdentityProvidersReducer(state = initialState, action) {
  switch (action.type) {
    case identityProvidersConstants.RESET_IDENTITY_PROVIDERS_STATE:
      return initialState;
    // GET_CLUSTER_IDENTITY_PROVIDERS
    case helpers.REJECTED_ACTION(identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS):
      return setStateProp(
        'clusterIdentityProviders',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS):
      return setStateProp(
        'clusterIdentityProviders',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS):
      return setStateProp(
        'clusterIdentityProviders',
        {
          clusterIDPList: action.payload.data.items || [],
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    // CREATE_CLUSTER_IDENTITY_PROVIDER
    case helpers.REJECTED_ACTION(identityProvidersConstants.CREATE_CLUSTER_IDENTITY_PROVIDER):
      return setStateProp(
        'createdClusterIDP',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(identityProvidersConstants.CREATE_CLUSTER_IDENTITY_PROVIDER):
      return setStateProp(
        'createdClusterIDP',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(identityProvidersConstants.CREATE_CLUSTER_IDENTITY_PROVIDER):
      return setStateProp(
        'createdClusterIDP',
        {
          clusterIdentityProviders: action.payload.data,
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    // RESET_CREATED_CLUSTER_IDP_RESPONSE
    case identityProvidersConstants.RESET_CREATED_CLUSTER_IDP_RESPONSE:
      return setStateProp(
        'createdClusterIDP',
        initialState.createdClusterIDP,
        {
          state,
          initialState,
        },
      );


    // DELETE_IDP
    case helpers.PENDING_ACTION(identityProvidersConstants.DELETE_IDENTITY_PROVIDER):
      return setStateProp(
        'deletedIDP',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(identityProvidersConstants.DELETE_IDENTITY_PROVIDER):
      return setStateProp(
        'deletedIDP',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );


    case helpers.FULFILLED_ACTION(identityProvidersConstants.DELETE_IDENTITY_PROVIDER):
      return setStateProp(
        'deletedIDP',
        {
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    case identityProvidersConstants.RESET_DELETED_IDP_RESPONSE:
      return setStateProp(
        'deletedIDP',
        initialState.deletedIDP,
        {
          state,
          initialState,
        },
      );

    default:
      return state;
  }
}

IdentityProvidersReducer.initialState = initialState;

export { initialState, IdentityProvidersReducer };

export default IdentityProvidersReducer;
