import produce from 'immer';
import get from 'lodash/get';
import { userConstants } from '../constants';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

const initialState = {
  keycloakProfile: {},
  organization: {
    details: null,
    quotaList: {},
    ...baseRequestState,
  },
};

function userProfile(state = initialState, action) {
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case userConstants.USER_INFO_RESPONSE:
        draft.keycloakProfile = action.payload;
        break;

        // GET_ORGANIZATION
      case REJECTED_ACTION(userConstants.GET_ORGANIZATION):
        draft.organization = {
          ...initialState.organization,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(userConstants.GET_ORGANIZATION):
        draft.organization.pending = true;
        break;
      case FULFILLED_ACTION(userConstants.GET_ORGANIZATION):
        draft.organization = {
          ...initialState.organization,
          fulfilled: true,
          details: action.payload.organization.data,
          quotaList: get(action.payload, 'quota', {}),
        };
        break;
    }
  });
}

export default userProfile;
