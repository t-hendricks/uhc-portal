import get from 'lodash/get';
import { userConstants } from '../constants';
import helpers from '../../common/helpers';

const initialState = {
  keycloakProfile: {},
  organization: {
    details: null,
    quotaList: {},
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  },
};

function userProfile(state = initialState, action) {
  switch (action.type) {
    case userConstants.USER_INFO_RESPONSE:
      return helpers.setStateProp(
        'keycloakProfile',
        action.payload,
        {
          state,
          initialState,
        },
      );

    // GET_ORGANIZATION
    case helpers.PENDING_ACTION(userConstants.GET_ORGANIZATION):
      return helpers.setStateProp(
        'organization',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );
    case helpers.FULFILLED_ACTION(userConstants.GET_ORGANIZATION):
      return helpers.setStateProp(
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
    case helpers.REJECTED_ACTION(userConstants.GET_ORGANIZATION):
      return helpers.setStateProp(
        'organization',
        helpers.getErrorState(action),
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
