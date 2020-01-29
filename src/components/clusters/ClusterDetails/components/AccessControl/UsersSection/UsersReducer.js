import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION,
  setStateProp, baseRequestState,
} from '../../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../../common/errors';
import UsersConstants from './UsersConstants';

const initialState = {
  groupUsers: {
    // later on this will need to change to support many arbitrary groups
    ...baseRequestState,
    clusterID: undefined,
    users: [],
  },
  deleteUserResponse: {
    ...baseRequestState,
  },
  addUserResponse: {
    ...baseRequestState,
  },
};

function UsersReducer(state = initialState, action) {
  switch (action.type) {
    case UsersConstants.CLEAR_USER_RESPONSES:
      return initialState;
    // GET_USERS
    case REJECTED_ACTION(UsersConstants.GET_USERS):
      return setStateProp(
        'groupUsers',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(UsersConstants.GET_USERS):
      return setStateProp(
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

    case FULFILLED_ACTION(UsersConstants.GET_USERS):
      return setStateProp(
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
    case REJECTED_ACTION(UsersConstants.ADD_USER):
      return setStateProp(
        'addUserResponse',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(UsersConstants.ADD_USER):
      return setStateProp(
        'addUserResponse',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(UsersConstants.ADD_USER):
      return setStateProp(
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
    case REJECTED_ACTION(UsersConstants.DELETE_USER):
      return setStateProp(
        'deleteUserResponse',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(UsersConstants.DELETE_USER):
      return setStateProp(
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

    case FULFILLED_ACTION(UsersConstants.DELETE_USER):
      return setStateProp(
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
