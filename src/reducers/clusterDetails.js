import { CLUSTER_DETAILS_RESPONSE } from '../actions/clusterDetails';

const clusterDetails = (state = {}, action) => {
  switch (action.type) {
    case CLUSTER_DETAILS_RESPONSE:
      return action.payload;
    default:
      return state;
  }
};

export default clusterDetails;
