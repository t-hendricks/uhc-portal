import { userConstants } from '../constants';
import helpers from '../../common/helpers';

const initialState = {
  keycloakProfile: {},
  organization: {
    details: null,
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
          details: action.payload.data,
        },
        {
          state,
          initialState,
        },
      );
    case helpers.REJECTED_ACTION(userConstants.GET_ORGANIZATION):
      return helpers.setStateProp(
        'organization',
        {
          error: action.error,
          errorMessage: helpers.getErrorMessage(action.payload),
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

export default userProfile;
