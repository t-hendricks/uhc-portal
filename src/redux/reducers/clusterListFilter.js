import { combineReducers } from 'redux';
import _ from 'lodash/collection';
import { isEqual } from 'lodash/lang';
import { ADD_CLUSTER_LIST_FILTER, REMOVE_CLUSTER_LIST_FILTER, CLEAR_CLUSTER_LIST_FILTER } from '../actions/clusterListFilter';

const clusterListFilters = (state = [], action) => {
  switch (action.type) {
    case ADD_CLUSTER_LIST_FILTER:
      return [...state, action.filter];
    case REMOVE_CLUSTER_LIST_FILTER:
      return _.filter(state, o => !isEqual(o, action.filter));
    case CLEAR_CLUSTER_LIST_FILTER:
      return [];
    default:
      return state;
  }
};

export default combineReducers({ clusterListFilters });
