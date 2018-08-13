export const CREATE_CLUSTER_REQUEST = 'CREATE_CLUSTER_REQUEST';
export const CREATE_CLUSTER_RESPONSE = 'CREATE_CLUSTER_RESPONSE';

export const createClusterRequest = () => ({
  type: CREATE_CLUSTER_REQUEST,
});

export const createClusterResponse = payload => ({
  payload,
  type: CREATE_CLUSTER_RESPONSE,
});
