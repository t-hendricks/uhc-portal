import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION,
  setStateProp, baseRequestState,
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
  deleteClusterAddOnResponse: {
    ...baseRequestState,
  },
};

function AddOnsReducer(state = initialState, action) {
  switch (action.type) {
    case AddOnsConstants.CLEAR_CLUSTER_ADDON_RESPONSES:
      return {
        ...initialState,
        addOns: state.addOns,
      };

    // GET_ADDONS
    case REJECTED_ACTION(AddOnsConstants.GET_ADDONS):
      return setStateProp(
        'addOns',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(AddOnsConstants.GET_ADDONS):
      return setStateProp(
        'addOns',
        {
          pending: true,
          items: state.addOns.items,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(AddOnsConstants.GET_ADDONS):
      return setStateProp(
        'addOns',
        {
          fulfilled: true,
          items: action.payload.addOns.data.items,
          resourceNames: action.payload.resourceNames,
        },
        {
          state,
          initialState,
        },
      );

    // GET_CLUSTER_ADDONS
    case REJECTED_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
      return setStateProp(
        'clusterAddOns',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
      return setStateProp(
        'clusterAddOns',
        {
          pending: true,
          items: state.clusterAddOns.items,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
      return setStateProp(
        'clusterAddOns',
        {
          fulfilled: true,
          clusterID: action.payload.clusterID,
          items: action.payload.clusterAddOns.data.items,
        },
        {
          state,
          initialState,
        },
      );

    // ADD_CLUSTER_ADDON
    case REJECTED_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
      return setStateProp(
        'addClusterAddOnResponse',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
      return setStateProp(
        'addClusterAddOnResponse',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
      return setStateProp(
        'addClusterAddOnResponse',
        {
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    // DELETE_CLUSTER_ADDON
    case REJECTED_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
      return setStateProp(
        'deleteClusterAddOnResponse',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
      return setStateProp(
        'deleteClusterAddOnResponse',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
      return setStateProp(
        'deleteClusterAddOnResponse',
        {
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

AddOnsReducer.initialState = initialState;

export { initialState, AddOnsReducer };

export default AddOnsReducer;
