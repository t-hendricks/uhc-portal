/*
Copyright (c) 2020 Red Hat, Inc.

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

import { produce } from 'immer';

import { AccessRequest, AccessRequestList, Decision } from '~/types/access_transparency.v1';

import { getErrorState } from '../../common/errors';
import { AccessRequestAction } from '../actions/accessRequestActions';
import { accessRequestConstants } from '../constants';
import {
  RESET_ACCESS_REQUEST,
  RESET_ACCESS_REQUESTS,
  RESET_CAN_MAKE_ACCESS_REQUEST_DECISION,
  RESET_GET_PENDING_ACCESS_REQUESTS,
  RESET_ORGANIZATION_PENDING_ACCESS_REQUESTS,
  RESET_POST_ACCESS_REQUEST_DECISION,
} from '../constants/accessRequestConstants';
import {
  baseRequestState,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
} from '../reduxHelpers';
import type { PromiseActionType, PromiseReducerState } from '../types';

type State = {
  accessRequests: PromiseReducerState<AccessRequestList>;
  accessRequest: PromiseReducerState<AccessRequest>;
  pendingAccessRequests: PromiseReducerState<AccessRequestList>;
  pendingOrganizationAccessRequests: PromiseReducerState<AccessRequestList>;
  postAccessRequestDecision: PromiseReducerState<Decision>;
  canMakeDecision: PromiseReducerState<{ allowed: boolean }>;
};

const initialState: State = {
  accessRequests: {
    ...baseRequestState,
  },
  accessRequest: {
    ...baseRequestState,
  },
  pendingAccessRequests: {
    ...baseRequestState,
  },
  pendingOrganizationAccessRequests: {
    ...baseRequestState,
  },
  postAccessRequestDecision: {
    ...baseRequestState,
  },
  canMakeDecision: {
    ...baseRequestState,
    allowed: false,
  },
};

function accessRequestReducer(
  state = initialState,
  action: PromiseActionType<AccessRequestAction>,
): State {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // GET_ACCESS_REQUESTS
      case REJECTED_ACTION(accessRequestConstants.GET_ACCESS_REQUESTS):
        draft.accessRequests = {
          ...initialState.accessRequests,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(accessRequestConstants.GET_ACCESS_REQUESTS):
        draft.accessRequests.pending = true;
        break;
      case FULFILLED_ACTION(accessRequestConstants.GET_ACCESS_REQUESTS):
        draft.accessRequests = {
          ...baseRequestState,
          fulfilled: true,
          ...action.payload.data,
        };
        break;

      // GET_ACCESS_REQUEST
      case REJECTED_ACTION(accessRequestConstants.GET_ACCESS_REQUEST):
        draft.accessRequest = {
          ...initialState.accessRequest,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(accessRequestConstants.GET_ACCESS_REQUEST):
        draft.accessRequest.pending = true;
        break;
      case FULFILLED_ACTION(accessRequestConstants.GET_ACCESS_REQUEST):
        draft.accessRequest = {
          ...baseRequestState,
          fulfilled: true,
          ...action.payload.data,
        };
        break;

      // GET_PENDING_ACCESS_REQUESTS
      case REJECTED_ACTION(accessRequestConstants.GET_PENDING_ACCESS_REQUESTS):
        draft.pendingAccessRequests = {
          ...initialState.pendingAccessRequests,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(accessRequestConstants.GET_PENDING_ACCESS_REQUESTS):
        draft.pendingAccessRequests.pending = true;
        break;
      case FULFILLED_ACTION(accessRequestConstants.GET_PENDING_ACCESS_REQUESTS):
        draft.pendingAccessRequests = {
          ...baseRequestState,
          fulfilled: true,
          ...action.payload.data,
        };
        break;

      // GET_ORGANIZATION_PENDING_ACCESS_REQUESTS
      case REJECTED_ACTION(accessRequestConstants.GET_ORGANIZATION_PENDING_ACCESS_REQUESTS):
        draft.pendingOrganizationAccessRequests = {
          ...initialState.pendingOrganizationAccessRequests,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(accessRequestConstants.GET_ORGANIZATION_PENDING_ACCESS_REQUESTS):
        draft.pendingOrganizationAccessRequests.pending = true;
        break;
      case FULFILLED_ACTION(accessRequestConstants.GET_ORGANIZATION_PENDING_ACCESS_REQUESTS):
        draft.pendingOrganizationAccessRequests = {
          ...baseRequestState,
          fulfilled: true,
          ...action.payload.data,
        };
        break;

      // POST_ACCESS_REQUEST_DECISION
      case REJECTED_ACTION(accessRequestConstants.POST_ACCESS_REQUEST_DECISION):
        draft.postAccessRequestDecision = {
          ...initialState.pendingAccessRequests,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(accessRequestConstants.POST_ACCESS_REQUEST_DECISION):
        draft.postAccessRequestDecision.pending = true;
        break;
      case FULFILLED_ACTION(accessRequestConstants.POST_ACCESS_REQUEST_DECISION):
        draft.postAccessRequestDecision = {
          ...baseRequestState,
          fulfilled: true,
          ...action.payload.data,
        };
        break;

      // CAN_MAKE_ACCESS_REQUEST_DECISION
      case REJECTED_ACTION(accessRequestConstants.CAN_MAKE_ACCESS_REQUEST_DECISION):
        draft.canMakeDecision = {
          ...initialState.pendingAccessRequests,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(accessRequestConstants.CAN_MAKE_ACCESS_REQUEST_DECISION):
        draft.canMakeDecision.pending = true;
        break;
      case FULFILLED_ACTION(accessRequestConstants.CAN_MAKE_ACCESS_REQUEST_DECISION):
        draft.canMakeDecision = {
          ...baseRequestState,
          fulfilled: true,
          allowed: action.payload.data.allowed,
        };
        break;

      // RESET OPERATIONS
      case RESET_ACCESS_REQUESTS:
        draft.accessRequests = initialState.accessRequests;
        break;

      case RESET_ACCESS_REQUEST:
        draft.accessRequest = initialState.accessRequest;
        break;

      case RESET_GET_PENDING_ACCESS_REQUESTS:
        draft.pendingAccessRequests = initialState.pendingAccessRequests;
        break;

      case RESET_POST_ACCESS_REQUEST_DECISION:
        draft.postAccessRequestDecision = initialState.postAccessRequestDecision;
        break;

      case RESET_ORGANIZATION_PENDING_ACCESS_REQUESTS:
        draft.pendingOrganizationAccessRequests = initialState.pendingOrganizationAccessRequests;
        break;

      case RESET_CAN_MAKE_ACCESS_REQUEST_DECISION:
        draft.canMakeDecision = initialState.canMakeDecision;
        break;
    }
  });
}
accessRequestReducer.initialState = initialState;

export { accessRequestReducer, initialState };

export default accessRequestReducer;
