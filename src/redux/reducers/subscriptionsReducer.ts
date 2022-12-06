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
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  INVALIDATE_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { normalizeQuotaCost } from '../../common/normalize';
import { subscriptionsConstants } from '../constants';
import { PromiseActionType, PromiseReducerState } from '../types';
import { SubscriptionsAction } from '../actions/subscriptionsActions';
import { Account } from '../../types/accounts_mgmt.v1/models/Account';
import { Subscription } from '../../types/accounts_mgmt.v1/models/Subscription';
import { QuotaCost } from '../../types/accounts_mgmt.v1/models/QuotaCost';

export type State = {
  account: PromiseReducerState<{
    valid: boolean;
    data: Account;
  }>;
  subscriptions: PromiseReducerState<{
    valid: boolean;
    items: Subscription[];
  }>;
  quotaSummary: PromiseReducerState<{
    valid: boolean;
    items: QuotaCost[];
  }>;
  quotaCost: PromiseReducerState<{
    valid: boolean;
    items: QuotaCost[];
  }>;
  subscriptionID: PromiseReducerState<{
    id?: string;
  }>;
};

const initialState: State = {
  account: {
    ...baseRequestState,
    valid: false,
    data: {} as Account,
  },
  subscriptions: {
    ...baseRequestState,
    valid: false,
    items: [],
  },
  quotaSummary: {
    ...baseRequestState,
    valid: false,
    items: [],
  },
  quotaCost: {
    ...baseRequestState,
    valid: false,
    items: [],
  },
  subscriptionID: {
    ...baseRequestState,
    id: undefined,
  },
};

function subscriptionsReducer(
  state = initialState,
  action: PromiseActionType<SubscriptionsAction>,
): State {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case REJECTED_ACTION(subscriptionsConstants.GET_ACCOUNT):
        draft.account = {
          ...initialState.account,
          ...getErrorState(action),
          valid: true,
        };
        break;
      case PENDING_ACTION(subscriptionsConstants.GET_ACCOUNT):
        draft.account.pending = true;
        break;
      case FULFILLED_ACTION(subscriptionsConstants.GET_ACCOUNT):
        draft.account = {
          ...baseRequestState,
          fulfilled: true,
          valid: true,
          data: action.payload.data,
        };
        break;
      // GET_SUBSCRIPTIONS
      case INVALIDATE_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
        draft.subscriptions = {
          ...initialState.subscriptions,
          valid: false,
        };
        break;
      case REJECTED_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
        draft.subscriptions = {
          ...initialState.subscriptions,
          ...getErrorState(action),
          valid: true,
          items: state.subscriptions.items,
        };
        break;
      case PENDING_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
        draft.subscriptions.pending = true;
        break;
      case FULFILLED_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
        draft.subscriptions = {
          ...baseRequestState,
          fulfilled: true,
          valid: true,
          items: action.payload.data.items ?? [],
        };
        break;
      // GET_SUBSCRIPTION_ID
      case REJECTED_ACTION(subscriptionsConstants.GET_SUBSCRIPTION_ID):
        draft.subscriptionID = {
          ...initialState.subscriptionID,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(subscriptionsConstants.GET_SUBSCRIPTION_ID):
        draft.subscriptionID.pending = true;
        break;
      case FULFILLED_ACTION(subscriptionsConstants.GET_SUBSCRIPTION_ID):
        draft.subscriptionID = {
          ...baseRequestState,
          fulfilled: true,
          id: action.payload,
        };
        break;
      case subscriptionsConstants.CLEAR_SUBSCRIPTION_ID:
        draft.subscriptionID = {
          ...initialState.subscriptionID,
        };
        break;
      case REJECTED_ACTION(subscriptionsConstants.GET_QUOTA_COST):
        draft.quotaCost = {
          ...initialState.quotaCost,
          ...getErrorState(action),
          valid: true,
          items: state.quotaCost.items,
        };
        break;
      case PENDING_ACTION(subscriptionsConstants.GET_QUOTA_COST):
        draft.quotaCost.pending = true;
        break;
      case FULFILLED_ACTION(subscriptionsConstants.GET_QUOTA_COST):
        draft.quotaCost = {
          ...baseRequestState,
          fulfilled: true,
          valid: true,
          items: action.payload.data.items?.map(normalizeQuotaCost) ?? [],
        };
    }
  });
}

subscriptionsReducer.initialState = initialState;

export { initialState, subscriptionsReducer };

export default subscriptionsReducer;
