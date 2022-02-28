import produce from 'immer';

import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import {
  LIST_ASSOCIATED_AWS_IDS,
  GET_AWS_ACCOUNT_ROLES_ARNS,
  CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
  CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
} from './rosaConstants';

const initialState = {
  getAWSAccountIDsResponse: {
    ...baseRequestState,
  },
  getAWSAccountRolesARNsResponse: {
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
    }
  });
}

rosaReducer.initialState = initialState;

export { initialState };

export default rosaReducer;
