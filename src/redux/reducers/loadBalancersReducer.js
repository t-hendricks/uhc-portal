import helpers from '../../common/helpers';
import { loadBalancerConstants } from '../constants';

const initialState = {
  loadBalancerValues: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    values: [],
  },
};

function loadBalancersReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.REJECTED_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return helpers.setStateProp(
        'loadBalancerValues',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return helpers.setStateProp(
        'loadBalancerValues',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return helpers.setStateProp(
        'loadBalancerValues',
        {
          values: action.payload,
          pending: false,
          fulfilled: true,
          error: false, // Unset error on successful request
          errorMessage: '',
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

loadBalancersReducer.initialState = initialState;

export { initialState, loadBalancersReducer };

export default loadBalancersReducer;
