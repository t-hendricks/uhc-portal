export const ADD_CLUSTER_LIST_FILTER = 'ADD_CLUSTER_LIST_FILTER';

export const REMOVE_CLUSTER_LIST_FILTER = 'REMOVE_CLUSTER_LIST_FILTER';

export const CLEAR_CLUSTER_LIST_FILTER = 'CLEAR_CLUSTER_LIST_FILTER';

const clusterListFilterAdded = filter => ({
  filter,
  type: ADD_CLUSTER_LIST_FILTER,
});

const clusterListFilterRemoved = filter => ({
  filter,
  type: REMOVE_CLUSTER_LIST_FILTER,
});

const clusterListFilterCleared = () => ({
  type: CLEAR_CLUSTER_LIST_FILTER,
});

export const addClusterListFilter = filter => (dispatch) => {
  dispatch(clusterListFilterAdded(filter));
};

export const removeClusterListFilter = filter => (dispatch) => {
  dispatch(clusterListFilterRemoved(filter));
};

export const clearClusterListFilter = () => (dispatch) => {
  dispatch(clusterListFilterCleared());
};
