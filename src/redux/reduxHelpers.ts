const INVALIDATE_ACTION = (base) => `${base}_INVALIDATE`;

// redux-middleware-promise
const FULFILLED_ACTION = (base) => `${base}_FULFILLED`;
const PENDING_ACTION = (base) => `${base}_PENDING`;
const REJECTED_ACTION = (base) => `${base}_REJECTED`;

/** Build a dict mapping a cluster ID to a specific permission state
 * @param {*} response - a response from selfResourceReview
 */
const buildPermissionDict = (response) => {
  const ret = {};
  if (!response || !response.data || !response.data.cluster_ids) {
    return ret;
  }
  response.data.cluster_ids.forEach((clusterID) => {
    ret[clusterID] = true;
  });
  return ret;
};

const actionTypes = {
  INVALIDATE_ACTION,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
};

const baseRequestState = {
  error: false,
  errorMessage: '',
  errorDetails: null,
  pending: false,
  fulfilled: false,
};

export {
  INVALIDATE_ACTION,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  actionTypes,
  baseRequestState,
  buildPermissionDict,
};
