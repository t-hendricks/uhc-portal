import produce from 'immer';
import get from 'lodash/get';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../../common/errors';
import UsersConstants from './UsersConstants';

const initialState = {
  groupUsers: {
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
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      //  GET USERS
      case PENDING_ACTION(UsersConstants.GET_USERS):
        draft.groupUsers.pending = true;
        break;

      case FULFILLED_ACTION(UsersConstants.GET_USERS): {
        const users = [];

        // attach group to each user and merge users from all groups into one array
        action.payload.data.items.forEach((group) =>
          get(group, 'users.items', []).forEach((user) => users.push({ ...user, group: group.id })),
        );

        draft.groupUsers = {
          ...baseRequestState,
          fulfilled: true,
          clusterID: action.payload.clusterID,
          users,
        };
        break;
      }

      case REJECTED_ACTION(UsersConstants.GET_DEDICATED_ADMNIS):
        draft.groupUsers = {
          ...initialState.groupUsers,
          ...getErrorState(action),
        };
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
