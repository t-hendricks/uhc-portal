import produce from 'immer';
import sortBy from 'lodash/sortBy';

import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../../common/errors';

import {
  GET_ROLES,
  GET_GRANTS,
  ADD_GRANT,
  CLEAR_ADD_GRANT_RESPONSE,
  DELETE_GRANT,
} from './NetworkSelfServiceConstants';

const initialState = {
  roles: {
    ...baseRequestState,
    data: [],
  },
  grants: {
    ...baseRequestState,
    data: [],
  },
  addGrantResponse: {
    ...baseRequestState,
  },
  deleteGrantResponse: {
    ...baseRequestState,
  },
};

function NetworkSelfServiceReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // GET_ROLES
      case PENDING_ACTION(GET_ROLES):
        draft.roles.pending = true;
        break;

      case FULFILLED_ACTION(GET_ROLES):
        draft.roles = {
          ...initialState.roles,
          fulfilled: true,
          data: action.payload.data.items.map((role) => ({
            id: role.id,
            displayName: role.display_name || role.id,
            description: role.description,
          })),
        };
        break;

      case REJECTED_ACTION(GET_ROLES):
        draft.roles = {
          ...initialState.roles,
          ...getErrorState(action),
        };
        break;

      // GET_GRANTS
      case PENDING_ACTION(GET_GRANTS):
        draft.grants.pending = true;
        break;

      case FULFILLED_ACTION(GET_GRANTS):
        draft.grants = {
          ...initialState.grants,
          fulfilled: true,
          data: sortBy(action.payload.data.items, ['user_arn', 'role.id']),
        };
        break;

      case REJECTED_ACTION(GET_GRANTS):
        draft.grants = {
          ...initialState.grants,
          ...getErrorState(action),
        };
        break;

      // ADD GRANT
      case PENDING_ACTION(ADD_GRANT):
        draft.addGrantResponse.pending = true;
        break;

      case FULFILLED_ACTION(ADD_GRANT):
        draft.addGrantResponse = {
          ...initialState.addGrantResponse,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(ADD_GRANT):
        draft.addGrantResponse = {
          ...initialState.addGrantResponse,
          ...getErrorState(action),
        };
        break;

      // CLEAR ADD GRANT RESPONSE
      case CLEAR_ADD_GRANT_RESPONSE:
        draft.addGrantResponse = { ...initialState.addGrantResponse };
        break;

      // DELETE GRANT
      case PENDING_ACTION(DELETE_GRANT):
        draft.deleteGrantResponse.pending = true;
        break;

      case FULFILLED_ACTION(DELETE_GRANT):
        draft.deleteGrantResponse = {
          ...initialState.deleteGrantResponse,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(DELETE_GRANT):
        draft.deleteGrantResponse = {
          ...initialState.addGrantResponse,
          ...getErrorState(action),
        };
        break;
    }
  });
}

NetworkSelfServiceReducer.initialState = initialState;

export default NetworkSelfServiceReducer;
