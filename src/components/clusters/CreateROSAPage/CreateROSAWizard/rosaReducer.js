import produce from 'immer';

import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import {
  LIST_ASSOCIATED_AWS_IDS,
  GET_AWS_ACCOUNT_ROLES_ARNS,
  GET_OCM_ROLE,
  CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
  CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
  CLEAR_GET_OCM_ROLE_RESPONSE,
} from './rosaConstants';

const initialState = {
  getAWSAccountIDsResponse: {
    ...baseRequestState,
  },
  getAWSAccountRolesARNsResponse: {
    ...baseRequestState,
  },
  getOCMRoleResponse: {
    ...baseRequestState,
  },
};

function rosaReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // LIST_ASSOCIATED_AWS_IDS
      case PENDING_ACTION(LIST_ASSOCIATED_AWS_IDS):
        draft.getAWSAccountIDsResponse.pending = true;
        break;

      case FULFILLED_ACTION(LIST_ASSOCIATED_AWS_IDS):
        draft.getAWSAccountIDsResponse = {
          ...baseRequestState,
          fulfilled: true,
          data: action.payload,
        };
        break;

      case REJECTED_ACTION(LIST_ASSOCIATED_AWS_IDS):
        draft.getAWSAccountIDsResponse = {
          ...baseRequestState,
          ...getErrorState(action),
          data: {},
        };
        break;

      // GET_AWS_ACCOUNT_ROLES_ARNS
      case PENDING_ACTION(GET_AWS_ACCOUNT_ROLES_ARNS):
        draft.getAWSAccountRolesARNsResponse.pending = true;
        break;

      case FULFILLED_ACTION(GET_AWS_ACCOUNT_ROLES_ARNS):
        draft.getAWSAccountRolesARNsResponse = {
          ...baseRequestState,
          fulfilled: true,
          data: action.payload,
        };
        break;

      case REJECTED_ACTION(GET_AWS_ACCOUNT_ROLES_ARNS):
        draft.getAWSAccountRolesARNsResponse = {
          ...baseRequestState,
          ...getErrorState(action),
          data: {},
        };
        break;

      // GET_OCM_ROLE
      case PENDING_ACTION(GET_OCM_ROLE):
        draft.getOCMRoleResponse.pending = true;
        break;

      case FULFILLED_ACTION(GET_OCM_ROLE):
        draft.getOCMRoleResponse = {
          ...baseRequestState,
          fulfilled: true,
          data: action.payload,
        };
        break;

      case REJECTED_ACTION(GET_OCM_ROLE):
        draft.getOCMRoleResponse = {
          ...baseRequestState,
          ...getErrorState(action),
          data: {},
        };
        break;

      // CLEARs
      case CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE:
        draft.getAWSAccountRolesARNsResponse = {
          ...baseRequestState,
        };
        break;

      case CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE:
        draft.getAWSAccountIDsResponse = {
          ...baseRequestState,
        };
        break;

      case CLEAR_GET_OCM_ROLE_RESPONSE:
        draft.getOCMRoleResponse = {
          ...baseRequestState,
          data: {},
        };
        break;
    }
  });
}

rosaReducer.initialState = initialState;

export { initialState };

export default rosaReducer;
