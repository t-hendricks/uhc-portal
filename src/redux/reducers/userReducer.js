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
  quota: {
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
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    // GET_ORG_QUOTA
    case helpers.PENDING_ACTION(userConstants.GET_ORG_QUOTA):
      return helpers.setStateProp(
        'quota',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );
    case helpers.FULFILLED_ACTION(userConstants.GET_ORG_QUOTA):
      return helpers.setStateProp(
        'quota',
        {
          pending: false,
          error: false,
          fulfilled: true,
          quotaList: action.payload.data,
        },
        {
          state,
          initialState,
        },
      );
    case helpers.REJECTED_ACTION(userConstants.GET_ORG_QUOTA):
      return helpers.setStateProp(
        'quota',
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
