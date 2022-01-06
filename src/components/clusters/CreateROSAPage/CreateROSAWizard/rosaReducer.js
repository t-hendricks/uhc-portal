import produce from 'immer';

import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import rosaConstants from './rosaActions';

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
      case PENDING_ACTION(rosaConstants.LIST_ASSOCIATED_AWS_IDS):
        draft.getAWSAccountIDsResponse.pending = true;
        break;

      case FULFILLED_ACTION(rosaConstants.LIST_ASSOCIATED_AWS_IDS):
        draft.getAWSAccountIDsResponse = {
          ...baseRequestState,
          fulfilled: true,
          data: action.payload.data,
        };
        break;

      case rosaConstants.CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE:
        draft.getAWSAccountIDsResponse = {
          ...baseRequestState,
          data: {},
        };
        break;

      // mock
      case rosaConstants.LIST_ASSOCIATED_AWS_IDS:
        draft.getAWSAccountIDsResponse = {
          ...baseRequestState,
          fulfilled: true,
          data: action.payload.data,
        };
        break;

      case REJECTED_ACTION(rosaConstants.LIST_ASSOCIATED_AWS_IDS):
        draft.getAWSAccountIDsResponse = {
          ...baseRequestState,
          ...getErrorState(action),
          data: {},
        };
        break;

      case PENDING_ACTION(rosaConstants.GET_AWS_ACCOUNT_ROLES_ARNS):
        draft.getAWSAccountRolesARNsResponse.pending = true;
        break;

      // mock
      case rosaConstants.GET_AWS_ACCOUNT_ROLES_ARNS:
        draft.getAWSAccountRolesARNsResponse = {
          ...baseRequestState,
          fulfilled: true,
          data: action.payload.data,
        };
        break;

      case rosaConstants.CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE:
        draft.getAWSAccountRolesARNsResponse = {
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
