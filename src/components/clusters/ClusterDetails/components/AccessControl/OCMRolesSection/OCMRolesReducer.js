import produce from 'immer';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../../common/errors';
import OCMRolesConstants from './OCMRolesConstants';

const initialState = {
  getOCMRolesResponse: {
    ...baseRequestState,
    data: {},
  },
  grantOCMRoleResponse: {
    ...baseRequestState,
  },
  editOCMRoleResponse: {
    ...baseRequestState,
  },
  deleteOCMRoleResponse: {
    ...baseRequestState,
  },
};

function OCMRolesReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      //  GET_OCM_ROLES
      case PENDING_ACTION(OCMRolesConstants.GET_OCM_ROLES):
        draft.getOCMRolesResponse.pending = true;
        break;

      case FULFILLED_ACTION(OCMRolesConstants.GET_OCM_ROLES): {
        draft.getOCMRolesResponse = {
          ...baseRequestState,
          fulfilled: true,
          data: action.payload.data,
        };
        break;
      }

      case REJECTED_ACTION(OCMRolesConstants.GET_OCM_ROLES):
        draft.getOCMRolesResponse = {
          ...baseRequestState,
          ...getErrorState(action),
          data: {},
        };
        break;

      // GRANT_OCM_ROLE
      case PENDING_ACTION(OCMRolesConstants.GRANT_OCM_ROLE):
        draft.grantOCMRoleResponse.pending = true;
        break;

      case FULFILLED_ACTION(OCMRolesConstants.GRANT_OCM_ROLE):
        draft.grantOCMRoleResponse = {
          ...baseRequestState,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(OCMRolesConstants.GRANT_OCM_ROLE):
        draft.grantOCMRoleResponse = {
          ...baseRequestState,
          ...getErrorState(action),
        };
        break;

      // EDIT_OCM_ROLE
      case PENDING_ACTION(OCMRolesConstants.EDIT_OCM_ROLE):
        draft.editOCMRoleResponse.pending = true;
        break;

      case FULFILLED_ACTION(OCMRolesConstants.EDIT_OCM_ROLE):
        draft.editOCMRoleResponse = {
          ...baseRequestState,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(OCMRolesConstants.EDIT_OCM_ROLE):
        draft.editOCMRoleResponse = {
          ...baseRequestState,
          ...getErrorState(action),
        };
        break;

      // DELETE_OCM_ROLE
      case PENDING_ACTION(OCMRolesConstants.DELETE_OCM_ROLE):
        draft.deleteOCMRoleResponse.pending = true;
        break;

      case FULFILLED_ACTION(OCMRolesConstants.DELETE_OCM_ROLE):
        draft.deleteOCMRoleResponse = {
          ...baseRequestState,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(OCMRolesConstants.DELETE_OCM_ROLE):
        draft.deleteOCMRoleResponse = {
          ...baseRequestState,
          ...getErrorState(action),
        };
        break;

      case OCMRolesConstants.CLEAR_GET_OCM_ROLES_RESPONSE:
        draft.getOCMRolesResponse = {
          ...baseRequestState,
          data: {},
        };
        break;

      case OCMRolesConstants.CLEAR_GRANT_OCM_ROLE_RESPONSE:
        draft.grantOCMRoleResponse = {
          ...baseRequestState,
        };
        break;

      case OCMRolesConstants.CLEAR_EDIT_OCM_ROLE_RESPONSE:
        draft.editOCMRoleResponse = {
          ...baseRequestState,
        };
        break;

      case OCMRolesConstants.CLEAR_DELETE_OCM_ROLE_RESPONSE:
        draft.deleteOCMRoleResponse = {
          ...baseRequestState,
        };
        break;
    }
  });
}

OCMRolesReducer.initialState = initialState;

export { initialState, OCMRolesReducer };

export default OCMRolesReducer;
