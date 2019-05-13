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
import helpers from '../../../../../common/helpers';
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
};

function IdentityProvidersReducer(state = initialState, action) {
  switch (action.type) {
    // GET_CLUSTER_IDENTITY_PROVIDERS
    case helpers.REJECTED_ACTION(identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS):
      return helpers.setStateProp(
        'clusterIdentityProviders',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessage(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(identityProvidersConstants.GET_CLUSTER_IDENTITY_PROVIDERS):
      return helpers.setStateProp(
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
      return helpers.setStateProp(
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
      return helpers.setStateProp(
        'createdClusterIDP',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessage(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(identityProvidersConstants.CREATE_CLUSTER_IDENTITY_PROVIDER):
      return helpers.setStateProp(
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
      return helpers.setStateProp(
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
      return helpers.setStateProp(
        'createdClusterIDP',
        initialState.createdClusterIDP,
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
