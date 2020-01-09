import helpers, { setStateProp } from '../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../common/errors';
import AddOnsConstants from './AddOnsConstants';

const request = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
};

const initialState = {
  addOns: {
    ...request,
    items: [],
    resourceNames: [],
  },
  clusterAddOns: {
    ...request,
    clusterID: undefined,
    items: [],
  },
  addClusterAddOnResponse: {
    ...request,
  },
  deleteClusterAddOnResponse: {
    ...request,
  },
};

function AddOnsReducer(state = initialState, action) {
  switch (action.type) {
    case AddOnsConstants.CLEAR_ADDON_RESPONSES:
      return initialState;

    // GET_ADDONS
    case helpers.REJECTED_ACTION(AddOnsConstants.GET_ADDONS):
      return setStateProp(
        'addOns',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(AddOnsConstants.GET_ADDONS):
      return setStateProp(
        'addOns',
        {
          fulfilled: false,
          pending: true,
          items: state.addOns.items,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(AddOnsConstants.GET_ADDONS):
      return setStateProp(
        'addOns',
        {
          pending: false,
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
    case helpers.REJECTED_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
      return setStateProp(
        'clusterAddOns',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
      return setStateProp(
        'clusterAddOns',
        {
          fulfilled: false,
          pending: true,
          items: state.clusterAddOns.items,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
      return setStateProp(
        'clusterAddOns',
        {
          pending: false,
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
    case helpers.REJECTED_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
      return setStateProp(
        'addClusterAddOnResponse',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
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

    case helpers.FULFILLED_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
      return setStateProp(
        'addClusterAddOnResponse',
        {
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    // DELETE_CLUSTER_ADDON
    case helpers.REJECTED_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
      return setStateProp(
        'deleteClusterAddOnResponse',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
      return setStateProp(
        'deleteClusterAddOnResponse',
        {
          fulfilled: false,
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
      return setStateProp(
        'deleteClusterAddOnResponse',
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

AddOnsReducer.initialState = initialState;

export { initialState, AddOnsReducer };

export default AddOnsReducer;
