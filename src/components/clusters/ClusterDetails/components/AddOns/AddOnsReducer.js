import helpers from '../../../../../common/helpers';
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
      return helpers.setStateProp(
        'addOns',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(AddOnsConstants.GET_ADDONS):
      return helpers.setStateProp(
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
      return helpers.setStateProp(
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
      return helpers.setStateProp(
        'clusterAddOns',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(AddOnsConstants.GET_CLUSTER_ADDONS):
      return helpers.setStateProp(
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
      return helpers.setStateProp(
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
      return helpers.setStateProp(
        'addClusterAddOnResponse',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON):
      return helpers.setStateProp(
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
      return helpers.setStateProp(
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
      return helpers.setStateProp(
        'deleteClusterAddOnResponse',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(AddOnsConstants.DELETE_CLUSTER_ADDON):
      return helpers.setStateProp(
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
      return helpers.setStateProp(
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
