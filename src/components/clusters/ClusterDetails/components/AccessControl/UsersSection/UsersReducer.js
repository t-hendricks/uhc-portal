import produce from 'immer';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../../common/errors';
import UsersConstants from './UsersConstants';

const initialState = {
  groupUsers: {
    // later on this will need to change to support many arbitrary groups
    ...baseRequestState,
    clusterID: undefined,
    users: [],
    errors: [],
  },
  deleteUserResponse: {
    ...baseRequestState,
  },
  addUserResponse: {
    ...baseRequestState,
  },
};

function UsersReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // GET USERS
      case PENDING_ACTION(UsersConstants.GET_USERS):
        draft.groupUsers.pending = true;
        break;

      case FULFILLED_ACTION(UsersConstants.GET_USERS):
        draft.groupUsers = {
          clusterID: action.payload.clusterID,
          pending: false,
          fulfilled: true,
          users: action.payload.users,
        };

        // handle REJECTED_ACTION(UsersConstants.GET_USERS) if any here
        if (action.payload.errors) {
          const errors = [];
          action.payload.errors.forEach((error) => {
            if (error) {
              errors.push(
                { userGroup: error.userGroup, ...getErrorState({ payload: error.errorData }) },
              );
            }
          });
          draft.groupUsers.errors = errors;
        }
        break;

      // ADD USER
      case PENDING_ACTION(UsersConstants.ADD_USER):
        draft.addUserResponse.pending = true;
        break;

      case FULFILLED_ACTION(UsersConstants.ADD_USER):
        draft.addUserResponse = {
          pending: false,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(UsersConstants.ADD_USER):
        draft.addUserResponse = {
          ...initialState,
          ...getErrorState(action),
        };
        break;


      // DELETE USER
      case PENDING_ACTION(UsersConstants.DELETE_USER):
        draft.deleteUserResponse.pending = true;
        break;

      case FULFILLED_ACTION(UsersConstants.DELETE_USER):
        draft.deleteUserResponse = {
          pending: false,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(UsersConstants.DELETE_USER):
        draft.deleteUserResponse = {
          ...initialState,
          ...getErrorState(action),
        };
        break;

      case UsersConstants.CLEAR_ADD_USER_RESPONSES:
        draft.addUserResponse = {
          ...baseRequestState,
        };
        break;

      case UsersConstants.CLEAR_USER_RESPONSES:
        return initialState;
    }
  });
}

UsersReducer.initialState = initialState;

export { initialState, UsersReducer };

export default UsersReducer;
