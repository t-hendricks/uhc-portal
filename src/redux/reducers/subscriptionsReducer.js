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
import helpers, { setStateProp } from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { subscriptionsConstants } from '../constants';

const baseState = {
  error: false,
  errorMessage: '',
  errorDetails: null,
  pending: false,
  fulfilled: false,
};

const initialState = {
  account: {
    ...baseState,
    valid: false,
    data: {},
  },
  subscriptions: {
    ...baseState,
    valid: false,
    items: [],
  },
  quotaSummary: {
    ...baseState,
    valid: false,
    items: [],
  },
};

function subscriptionsReducer(state = initialState, action) {
  switch (action.type) {
    // GET_ACCOUNT
    case helpers.INVALIDATE_ACTION(subscriptionsConstants.GET_ACCOUNT):
      return setStateProp(
        'account',
        {
          valid: false,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(subscriptionsConstants.GET_ACCOUNT):
      return setStateProp(
        'account',
        {
          ...getErrorState(action),
          valid: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(subscriptionsConstants.GET_ACCOUNT):
      return setStateProp(
        'account',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(subscriptionsConstants.GET_ACCOUNT):
      return setStateProp(
        'account',
        {
          data: action.payload.data,
          pending: false,
          fulfilled: true,
          valid: true,
        },
        {
          state,
          initialState,
        },
      );

    // GET_SUBSCRIPTIONS
    case helpers.INVALIDATE_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
      return setStateProp(
        'subscriptions',
        {
          valid: false,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
      return setStateProp(
        'subscriptions',
        {
          ...getErrorState(action),
          valid: true,
          items: state.subscriptions.items,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
      return setStateProp(
        'subscriptions',
        {
          pending: true,
          items: state.subscriptions.items,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
      return setStateProp(
        'subscriptions',
        {
          items: action.payload.data.items,
          pending: false,
          fulfilled: action.payload.data.items && action.payload.data.items.length > 0,
          valid: true,
        },
        {
          state,
          initialState,
        },
      );

    // GET_QUOTA_SUMMARY
    case helpers.INVALIDATE_ACTION(subscriptionsConstants.GET_QUOTA_SUMMARY):
      return setStateProp(
        'quotaSummary',
        {
          valid: false,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(subscriptionsConstants.GET_QUOTA_SUMMARY):
      return setStateProp(
        'quotaSummary',
        {
          ...getErrorState(action),
          valid: true,
          items: state.quotaSummary.items,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(subscriptionsConstants.GET_QUOTA_SUMMARY):
      return setStateProp(
        'quotaSummary',
        {
          pending: true,
          items: state.quotaSummary.items,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(subscriptionsConstants.GET_QUOTA_SUMMARY):
      return setStateProp(
        'quotaSummary',
        {
          items: action.payload.data.items,
          pending: false,
          fulfilled: action.payload.data.items && action.payload.data.items.length > 0,
          valid: true,
        },
        {
          state,
          initialState,
        },
      );

    default:
      return state;
  }
}

subscriptionsReducer.initialState = initialState;

export { initialState, subscriptionsReducer };

export default subscriptionsReducer;
