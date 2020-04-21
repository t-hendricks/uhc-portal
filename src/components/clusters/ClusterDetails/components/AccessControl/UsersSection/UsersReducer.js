import produce from 'immer';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../../common/errors';
import UsersConstants from './UsersConstants';

const initialState = {
  groupUsers: {
    dedicatedAdmins: {
      ...baseRequestState,
      clusterID: undefined,
      users: [],
    },
    clusterAdmins: {
      ...baseRequestState,
      clusterID: undefined,
      users: [],
    },
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
      // GET DEDICATED ADMNIS
      case PENDING_ACTION(UsersConstants.GET_DEDICATED_ADMNIS):
        draft.groupUsers.dedicatedAdmins.pending = true;
        break;

      case FULFILLED_ACTION(UsersConstants.GET_DEDICATED_ADMNIS):
        draft.groupUsers.dedicatedAdmins = {
          ...baseRequestState,
          fulfilled: true,
          clusterID: action.payload.clusterID,
          users: action.payload.data.items,
        };
        break;

      case REJECTED_ACTION(UsersConstants.GET_DEDICATED_ADMNIS):
        draft.groupUsers.dedicatedAdmins = {
          ...initialState.groupUsers.dedicatedAdmins,
          ...getErrorState(action),
        };
        break;


      // GET CLUSTER ADMINS
      case PENDING_ACTION(UsersConstants.GET_CLUSTER_ADMINS):
        draft.groupUsers.clusterAdmins.pending = true;
        break;

      case FULFILLED_ACTION(UsersConstants.GET_CLUSTER_ADMINS):
        draft.groupUsers.clusterAdmins = {
          ...baseRequestState,
          fulfilled: true,
          clusterID: action.payload.clusterID,
          users: action.payload.data.items,
        };
        break;

      case REJECTED_ACTION(UsersConstants.GET_CLUSTER_ADMINS):
        draft.groupUsers.clusterAdmins = {
          ...initialState.groupUsers.clusterAdmins,
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
