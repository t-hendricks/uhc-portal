import produce from 'immer';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../common/errors';
import AddOnsConstants from './AddOnsConstants';

const initialState = {
  addOns: {
    ...baseRequestState,
    items: [],
    resourceNames: [],
  },
  clusterAddOns: {
    ...baseRequestState,
    clusterID: undefined,
    items: [],
  },
  addClusterAddOnResponse: {
    ...baseRequestState,
  },
  updateClusterAddOnResponse: {
    ...baseRequestState,
  },
  deleteClusterAddOnResponse: {
    ...baseRequestState,
  },
};

function AddOnsReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case AddOnsConstants.CLEAR_CLUSTER_ADDON_RESPONSES:
        return {
          ...initialState,
          addOns: state.addOns,
          clusterAddOns: state.clusterAddOns,
        };

      // GET_ADDONS
      case REJECTED_ACTION(AddOnsConstants.GET_ADDONS):
        draft.addOns = {
          ...initialState.addOns,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(AddOnsConstants.GET_ADDONS):
        draft.addOns.pending = true;
        break;

      case FULFILLED_ACTION(AddOnsConstants.GET_ADDONS):
        draft.addOns = {
          ...initialState.addOns,
          fulfilled: true,
          items: action.payload.items,
          resourceNames: action.payload.resourceNames,
        };
        break;

      // GET_CLUSTER_ADDONS
      case REJECTED_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
        draft.clusterAddOns = {
          ...initialState.clusterAddOns,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
        draft.clusterAddOns.pending = true;
        break;
      case FULFILLED_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
        draft.clusterAddOns = {
          ...initialState.clusterAddOns,
          fulfilled: true,
          clusterID: action.payload.clusterID,
          items: action.payload.items,
        };
        break;

      // ADD_CLUSTER_ADDON
      case REJECTED_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
        draft.addClusterAddOnResponse = {
          ...initialState.addClusterAddOnResponse,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
        draft.addClusterAddOnResponse.pending = true;
        break;
      case FULFILLED_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
        draft.addClusterAddOnResponse = {
          ...initialState.addClusterAddOnResponse,
          fulfilled: true,
        };
        break;

      // UPDATE_CLUSTER_ADDON
      case REJECTED_ACTION(AddOnsConstants.UPDATE_CLUSTER_ADDON):
        draft.updateClusterAddOnResponse = {
          ...initialState.updateClusterAddOnResponse,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(AddOnsConstants.UPDATE_CLUSTER_ADDON):
        draft.updateClusterAddOnResponse.pending = true;
        break;
      case FULFILLED_ACTION(AddOnsConstants.UPDATE_CLUSTER_ADDON):
        draft.updateClusterAddOnResponse = {
          ...initialState.updateClusterAddOnResponse,
          fulfilled: true,
        };
        break;

      // DELETE_CLUSTER_ADDON
      case REJECTED_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
        draft.deleteClusterAddOnResponse = {
          ...initialState.deleteClusterAddOnResponse,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
        draft.deleteClusterAddOnResponse.pending = true;
        break;
      case FULFILLED_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
        draft.deleteClusterAddOnResponse = {
          ...initialState,
          fulfilled: true,
        };
        break;
    }
  });
}

AddOnsReducer.initialState = initialState;

export { initialState, AddOnsReducer };

export default AddOnsReducer;
