import get from 'lodash/get';
import { userConstants } from '../constants';
import {
  setStateProp, REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
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
  switch (action.type) {
    case userConstants.USER_INFO_RESPONSE:
      return setStateProp(
        'keycloakProfile',
        action.payload,
        {
          state,
          initialState,
        },
      );

    // GET_ORGANIZATION
    case PENDING_ACTION(userConstants.GET_ORGANIZATION):
      return setStateProp(
        'organization',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );
    case FULFILLED_ACTION(userConstants.GET_ORGANIZATION):
      return setStateProp(
        'organization',
        {
          pending: false,
          error: false,
          fulfilled: true,
          details: action.payload.organization.data,
          quotaList: get(action.payload, 'quota.data', {}),
        },
        {
          state,
          initialState,
        },
      );
    case REJECTED_ACTION(userConstants.GET_ORGANIZATION):
      return setStateProp(
        'organization',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );
    default:
      return state;
  }
}

export default userProfile;
