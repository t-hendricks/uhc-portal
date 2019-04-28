import helpers from '../../../../../common/helpers';
import UsersConstants from './UsersConstants';

const initialState = {
  groupUsers: {
    // later on this will need to change to support many arbitrary groups
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    clusterID: undefined,
    users: [],
  },
  deleteUserResponse: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  },
  addUserResponse: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  },
};

function UsersReducer(state = initialState, action) {
  switch (action.type) {
    // GET_USERS
    case helpers.REJECTED_ACTION(UsersConstants.GET_USERS):
      return helpers.setStateProp(
        'groupUsers',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessage(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(UsersConstants.GET_USERS):
      return helpers.setStateProp(
        'groupUsers',
        {
          fulfilled: false,
          pending: true,
          users: state.groupUsers.users, // this is needed to preserve previous user list on refresh
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(UsersConstants.GET_USERS):
      return helpers.setStateProp(
        'groupUsers',
        {
          clusterID: action.payload.clusterID,
          pending: false,
          fulfilled: true,
          users: action.payload.users.data,
        },
        {
          state,
          initialState,
        },
      );

    // ADD_USER
    case helpers.REJECTED_ACTION(UsersConstants.ADD_USER):
      return helpers.setStateProp(
        'addUserResponse',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessage(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(UsersConstants.ADD_USER):
      return helpers.setStateProp(
        'addUserResponse',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(UsersConstants.ADD_USER):
      return helpers.setStateProp(
        'addUserResponse',
        {
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    // DELETE_USER
    case helpers.REJECTED_ACTION(UsersConstants.DELETE_USER):
      return helpers.setStateProp(
        'deleteUserResponse',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessage(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(UsersConstants.DELETE_USER):
      return helpers.setStateProp(
        'deleteUserResponse',
        {
          fulfilled: false,
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(UsersConstants.DELETE_USER):
      return helpers.setStateProp(
        'deleteUserResponse',
        {
          pending: false,
          fulfilled: true,
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

UsersReducer.initialState = initialState;

export { initialState, UsersReducer };

export default UsersReducer;
