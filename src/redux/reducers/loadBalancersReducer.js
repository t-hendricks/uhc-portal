import {
  setStateProp, REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { loadBalancerConstants } from '../constants';

const initialState = {
  loadBalancerValues: {
    ...baseRequestState,
    values: [],
  },
};

function loadBalancersReducer(state = initialState, action) {
  switch (action.type) {
    case REJECTED_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return setStateProp(
        'loadBalancerValues',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return setStateProp(
        'loadBalancerValues',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return setStateProp(
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
