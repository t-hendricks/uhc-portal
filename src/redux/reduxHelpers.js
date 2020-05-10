const INVALIDATE_ACTION = base => `${base}_INVALIDATE`;

// redux-middleware-promise
const FULFILLED_ACTION = base => `${base}_FULFILLED`;
const PENDING_ACTION = base => `${base}_PENDING`;
const REJECTED_ACTION = base => `${base}_REJECTED`;

const setStateProp = (prop, data, options) => {
  const { state = {}, initialState = {}, reset = true } = options;
  const obj = { ...state };

  if (!state[prop]) {
    console.error(`Error: Property ${prop} does not exist within the passed state.`, state);
  }

  if (reset && !initialState[prop]) {
    console.warn(`Warning: Property ${prop} does not exist within the passed initialState.`, initialState);
  }

  if (reset) {
    obj[prop] = {
      ...state[prop],
      ...initialState[prop],
      ...data,
    };
  } else {
    obj[prop] = {
      ...state[prop],
      ...data,
    };
  }

  return obj;
};

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
  setStateProp,
  baseRequestState,
  buildPermissionDict,
};
