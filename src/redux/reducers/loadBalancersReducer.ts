import produce from 'immer';

import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { loadBalancerConstants } from '../constants';

const initialState = {
  ...baseRequestState,
  values: [],
};

function loadBalancersReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case REJECTED_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
        return {
          ...initialState,
          ...getErrorState(action),
        };

      case PENDING_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
        draft.pending = true;
        break;

      case FULFILLED_ACTION(loadBalancerConstants.GET_LOAD_BALANCER_VALUES):
        return {
          ...initialState,
          fulfilled: true,
          values: action.payload,
        };
    }
  });
}

loadBalancersReducer.initialState = initialState;

export { initialState, loadBalancersReducer };

export default loadBalancersReducer;
