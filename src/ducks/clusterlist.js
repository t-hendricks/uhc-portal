/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import * as fromClusterList from '../apis/clusterList';

const DEFAULT_PAGE_SIZE = 5;

// SELECTORS
export const getClustersRequested = state => state.clusterList.requested;

export const getClustersErrored = state => state.clusterList.errored;

export const getCluster = (state, id) => state.clusterList.byId[id];

const getClustersById = state => state.clusterList.byId;

const getClusterIds = state => state.clusterList.ids;

export const getClusters = createSelector(
  [getClustersById, getClusterIds],
  (pById, pIds) => pIds.map(o => pById[o]),
);

export const getClustersCurrentPage = state => state.clusterList.currentPage;
export const getClustersPageSize = state => state.clusterList.pageSize;
export const getClustersClusterCount = state => state.clusterList.clusterCount;
export const getClustersLastPage = state => state.clusterList.lastPage;

const getIsPageFetched = (state, page) => state.clusterList.pages[page] !== undefined;

const getClustersIdsPaged = (state) => {
  const page = state.clusterList.currentPage;
  const pageIds = state.clusterList.pages[page];
  if (pageIds === undefined) {
    return [];
  }
  return pageIds;
};

export const getClustersPaged = createSelector(
  [getClustersById, getClustersIdsPaged],
  (pById, pIds) => pIds.map(o => pById[o]),
);

// ACTIONS
const FETCH_CLUSTERS_REQUEST = 'FETCH_CLUSTERS_REQUEST';

const FETCH_CLUSTERS_RESPONSE = 'FETCH_CLUSTERS_RESPONSE';

const SET_CLUSTERS_CURRENT_PAGE = 'SET_CLUSTERS_CURRENT_PAGE';
const SET_CLUSTERS_PAGE_SIZE = 'SET_CLUSTERS_PAGE_SIZE';

const fetchClustersRequest = () => ({
  type: FETCH_CLUSTERS_REQUEST,
});

const fetchClustersResponse = (payload, error) => {
  if (error) {
    return {
      error: true,
      payload,
      type: FETCH_CLUSTERS_RESPONSE,
    };
  }
  return {
    payload,
    type: FETCH_CLUSTERS_RESPONSE,
  };
};

const setClustersCurrentPage = page => ({
  payload: page,
  type: SET_CLUSTERS_CURRENT_PAGE,
});

export const fetchClusters = params => (dispatch, getState) => {
  const state = getState();
  const { clustersCurrentPage, clustersPageSize } = params;
  const offset = clustersCurrentPage * clustersPageSize;
  dispatch(setClustersCurrentPage(clustersCurrentPage));
  if (getIsPageFetched(state, clustersCurrentPage)) {
    return;
  }
  dispatch(fetchClustersRequest());
  fromClusterList.fetchClusters({
    limit: clustersPageSize,
    offset,
    page: clustersCurrentPage,
  })
    .then((response) => {
      const pageCount = Math.ceil(response.total / clustersPageSize);
      dispatch(fetchClustersResponse({
        items: response.items,
        page: clustersCurrentPage,
        pageCount,
        clusterCount: response.total,
      }));
    }).catch(() => dispatch(fetchClustersResponse('500', true)));
};

// REDUCER
const requested = (state = false, action) => {
  switch (action.type) {
    case FETCH_CLUSTERS_REQUEST:
      return true;
    case FETCH_CLUSTERS_RESPONSE:
      return false;
    default:
      return state;
  }
};

const byId = (state = {}, action) => {
  const entry = {}; // OUTSIDE BECAUSE OF LINTER
  switch (action.type) {
    case FETCH_CLUSTERS_RESPONSE:
      if (action.error) {
        return state;
      }
      for (let i = 0; i < action.payload.items.length; i += 1) {
        const cluster = action.payload.items[i];
        entry[cluster.id] = cluster;
      }
      return {
        ...state,
        ...entry,
      };
    default:
      return state;
  }
};

const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_CLUSTERS_RESPONSE:
      if (action.error) {
        return state;
      }
      return [
        ...state,
        ...action.payload.items.map(o => o.id),
      ];
    default:
      return state;
  }
};

const errored = (state = false, action) => {
  switch (action.type) {
    case FETCH_CLUSTERS_REQUEST:
      return false;
    case FETCH_CLUSTERS_RESPONSE:
      return action.error === true;
    default:
      return state;
  }
};

const currentPage = (state = 0, action) => {
  switch (action.type) {
    case SET_CLUSTERS_CURRENT_PAGE:
      return action.payload;
    default:
      return state;
  }
};

const pageSize = (state = DEFAULT_PAGE_SIZE, action) => {
  switch (action.type) {
    case SET_CLUSTERS_PAGE_SIZE:
      return action.payload;
    default:
      return state;
  }
};

const clusterCount = (state = 0, action) => {
  switch (action.type) {
    case FETCH_CLUSTERS_RESPONSE:
      if (action.error) {
        return state;
      }
      return action.payload.clusterCount;
    default:
      return state;
  }
};

const lastPage = (state = 0, action) => {
  switch (action.type) {
    case FETCH_CLUSTERS_RESPONSE:
      if (action.error) {
        return state;
      }
      return action.payload.pageCount - 1;
    default:
      return state;
  }
};

const pages = (state = {}, action) => {
  let pageIds;
  switch (action.type) {
    case FETCH_CLUSTERS_RESPONSE:
      if (action.error) {
        return state;
      }
      pageIds = action.payload.items.map(cluster => cluster.id);
      return {
        ...state,
        [action.payload.page]: pageIds,
      };
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  currentPage,
  pageSize,
  clusterCount,
  errored,
  ids,
  lastPage,
  pages,
  requested,
});
