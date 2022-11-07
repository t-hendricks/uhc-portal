import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { loadBalancerConstants } from '../constants';
import { LoadBalancerAction } from '../actions/loadBalancerActions';
import { PromiseActionType, PromiseReducerState } from '../types';

type State = PromiseReducerState<{
  values: number[];
}>;

const initialState: State = {
  ...baseRequestState,
  values: [],
};

function loadBalancersReducer(
  state = initialState,
  action: PromiseActionType<LoadBalancerAction>,
): State {
  switch (action.type) {
    case REJECTED_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return {
        ...initialState,
        ...getErrorState(action),
      };

    case PENDING_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return {
        ...state,
        pending: true,
      };

    case FULFILLED_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
      return {
        ...baseRequestState,
        fulfilled: true,
        values: action.payload,
      };
    default:
      return state;
  }
}

loadBalancersReducer.initialState = initialState;

export { initialState, loadBalancersReducer };

export default loadBalancersReducer;
