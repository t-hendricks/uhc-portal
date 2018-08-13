import { combineReducers } from 'redux';
import { CREATE_CLUSTER_RESPONSE } from '../actions/createCluster';

const createCluster = (state = {}, action) => {
  switch (action.type) {
    case CREATE_CLUSTER_RESPONSE:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  createCluster,
});
