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
import merge from 'lodash/merge';
import { produce } from 'immer';
import axios from 'axios';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  INVALIDATE_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';
import { versionComparator } from '../../common/versionComparator';
import { clustersConstants } from '../constants';
import type { PromiseActionType, PromiseReducerState } from '../types';
import type { ClusterAction } from '../actions/clustersActions';
import type { UpgradeGateAction } from '../actions/upgradeGateActions';
import type { Cluster, ClusterStatus, VersionGate, Version } from '../../types/clusters_mgmt.v1';
import type { ErrorState, AugmentedCluster, ClusterWithPermissions } from '../../types/types';

type State = {
  clusters: PromiseReducerState & {
    valid: boolean;
    meta: {
      clustersServiceError?: ErrorState;
    };
    clusters: ClusterWithPermissions[];
    queryParams?: {
      page: number;
      ['page_size']: number;
      filter?: string | undefined;
      fields?: string | undefined;
      order?: string | undefined;
    };
  };
  clusterStatus: PromiseReducerState & {
    status: ClusterStatus;
  };
  clusterVersions: PromiseReducerState & {
    versions: Version[];
  };
  details: PromiseReducerState & {
    cluster: AugmentedCluster;
  };
  createdCluster: PromiseReducerState & {
    cluster: Cluster;
  };
  editedCluster: PromiseReducerState;
  archivedCluster: PromiseReducerState;
  unarchivedCluster: PromiseReducerState;
  hibernatingCluster: PromiseReducerState;
  resumeHibernatingCluster: PromiseReducerState;
  upgradeGates: PromiseReducerState & {
    gates: VersionGate[];
  };
  upgradedCluster: PromiseReducerState & {
    cluster: Cluster;
  };
};

const baseState = {
  ...baseRequestState,
  valid: true,
};

// Fields here, that are *also* known to be always present from backend -> normalize.js results,
// can be assumed always present.
const emptyCluster = {
  managed: false,
  ccs: {
    enabled: false,
  },
};

const initialState: State = {
  clusters: {
    ...baseState,
    valid: false,
    meta: {},
    clusters: [],
    queryParams: {
      page: 0,
      page_size: 0,
    },
  },
  clusterStatus: {
    ...baseState,
    status: {},
  },
  clusterVersions: {
    ...baseState,
    versions: [],
  },
  details: {
    ...baseState,
    // TODO cast required due to missing metrics
    cluster: emptyCluster as AugmentedCluster,
  },
  createdCluster: {
    ...baseState,
    cluster: emptyCluster,
  },
  editedCluster: {
    ...baseState,
  },
  archivedCluster: {
    ...baseState,
  },
  unarchivedCluster: {
    ...baseState,
  },
  hibernatingCluster: {
    ...baseState,
  },
  resumeHibernatingCluster: {
    ...baseState,
  },
  upgradeGates: {
    ...baseState,
    gates: [],
  },
  upgradedCluster: {
    ...baseState,
    cluster: emptyCluster,
  },
};

const filterAndSortClusterVersions = (versions: Version[]) => {
  const now = Date.now();
  const filteredVersions = versions.filter((version) => {
    if (!version.end_of_life_timestamp) {
      return true;
    }
    const eolTimestamp = new Date(version.end_of_life_timestamp).getTime();
    return eolTimestamp > now;
  });
  // descending version numbers
  return filteredVersions.sort((e1, e2) => versionComparator(e2.raw_id!, e1.raw_id!));
};

const clustersReducer = (
  state = initialState,
  action: PromiseActionType<ClusterAction | UpgradeGateAction>,
): State =>
  // eslint-disable-next-line consistent-return
  produce(state, (draft) => {
    switch (action.type) {
      // GET_CLUSTERS
      case INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS):
        draft.clusters = { ...initialState.clusters };
        break;
      case REJECTED_ACTION(clustersConstants.GET_CLUSTERS):
        draft.clusters = {
          ...initialState.clusters,
          ...getErrorState(action),
          valid: true,
          clusters: state.clusters.clusters,
        };
        break;
      case PENDING_ACTION(clustersConstants.GET_CLUSTERS):
        draft.clusters = {
          ...initialState.clusters,
          pending: true,
          valid: true,
          clusters: state.clusters.clusters,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.GET_CLUSTERS): {
        const { data } = action.payload;
        const clustersServiceError =
          'meta' in data && !!data.meta?.clustersServiceError
            ? getErrorState({
                payload: axios.isAxiosError(data.meta.clustersServiceError)
                  ? data.meta.clustersServiceError
                  : undefined,
              })
            : undefined;
        draft.clusters = {
          ...baseState,
          clusters: data.items,
          queryParams: data.queryParams,
          meta: {
            clustersServiceError:
              clustersServiceError?.error === true ? clustersServiceError : undefined,
          },
          fulfilled: true,
        };
        break;
      }
      case clustersConstants.SET_CLUSTER_DETAILS: {
        const { cluster, mergeDetails } = action.payload;
        draft.details = {
          ...baseState,
          cluster: mergeDetails ? merge({}, state.details.cluster, cluster) : cluster,
          fulfilled: true,
        };
        break;
      }
      // GET_CLUSTER_DETAILS
      case REJECTED_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
        draft.details = {
          ...initialState.details,
          ...getErrorState(action),
          cluster: state.details.cluster, // preserve previous cluster even on error
        };
        break;
      case PENDING_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
        draft.details = {
          ...initialState.details,
          pending: true,
          cluster: state.details.cluster,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
        draft.details = {
          ...baseState,
          fulfilled: true,
          cluster: action.payload.data,
        };
        break;

      // CREATE_CLUSTER
      case REJECTED_ACTION(clustersConstants.CREATE_CLUSTER):
        draft.createdCluster = {
          ...initialState.createdCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.CREATE_CLUSTER):
        draft.createdCluster = {
          ...initialState.createdCluster,
          pending: true,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.CREATE_CLUSTER):
        draft.createdCluster = {
          ...baseState,
          cluster: action.payload.data,
          fulfilled: true,
        };
        break;
      case clustersConstants.RESET_CREATED_CLUSTER_RESPONSE:
        draft.createdCluster = {
          ...initialState.createdCluster,
        };
        break;

      // EDIT_CLUSTER
      case REJECTED_ACTION(clustersConstants.EDIT_CLUSTER):
        draft.editedCluster = {
          ...initialState.editedCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.EDIT_CLUSTER):
        draft.editedCluster = {
          ...initialState.editedCluster,
          pending: true,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.EDIT_CLUSTER):
        draft.editedCluster = {
          ...baseState,
          fulfilled: true,
        };
        break;
      case clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE:
        draft.editedCluster = {
          ...initialState.editedCluster,
        };
        break;

      // Archive cluster
      case FULFILLED_ACTION(clustersConstants.ARCHIVE_CLUSTER):
        draft.archivedCluster = {
          ...baseState,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(clustersConstants.ARCHIVE_CLUSTER):
        draft.archivedCluster = {
          ...initialState.archivedCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.ARCHIVE_CLUSTER):
        draft.archivedCluster = {
          ...initialState.archivedCluster,
          pending: true,
        };
        break;
      case clustersConstants.CLEAR_CLUSTER_ARCHIVE_RESPONSE:
        draft.archivedCluster = {
          ...initialState.archivedCluster,
        };
        break;

      // Hibernate cluster
      case FULFILLED_ACTION(clustersConstants.HIBERNATE_CLUSTER):
        draft.hibernatingCluster = {
          ...baseState,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(clustersConstants.HIBERNATE_CLUSTER):
        draft.hibernatingCluster = {
          ...initialState.hibernatingCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.HIBERNATE_CLUSTER):
        draft.hibernatingCluster = {
          ...initialState.hibernatingCluster,
          pending: true,
        };
        break;
      case clustersConstants.CLEAR_CLUSTER_HIBERNATE_RESPONSE:
        draft.hibernatingCluster = {
          ...initialState.hibernatingCluster,
        };
        break;

      // Resume cluster
      case FULFILLED_ACTION(clustersConstants.RESUME_CLUSTER):
        draft.resumeHibernatingCluster = {
          ...baseState,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(clustersConstants.RESUME_CLUSTER):
        draft.resumeHibernatingCluster = {
          ...initialState.resumeHibernatingCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.RESUME_CLUSTER):
        draft.resumeHibernatingCluster = {
          ...initialState.resumeHibernatingCluster,
          pending: true,
        };
        break;
      case clustersConstants.CLEAR_RESUME_CLUSTER_RESPONSE:
        draft.resumeHibernatingCluster = {
          ...initialState.resumeHibernatingCluster,
        };
        break;

      // UnArchive cluster
      case FULFILLED_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
        draft.unarchivedCluster = {
          ...baseState,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
        draft.unarchivedCluster = {
          ...initialState.unarchivedCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
        draft.unarchivedCluster = {
          ...initialState.unarchivedCluster,
          pending: true,
        };
        break;
      case clustersConstants.CLEAR_CLUSTER_UNARCHIVE_RESPONSE:
        draft.unarchivedCluster = {
          ...initialState.unarchivedCluster,
        };
        break;

      // Upgrade trial cluster
      case FULFILLED_ACTION(clustersConstants.UPGRADE_TRIAL_CLUSTER):
        draft.upgradedCluster = {
          ...baseState,
          cluster: action.payload.data,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(clustersConstants.UPGRADE_TRIAL_CLUSTER):
        draft.upgradedCluster = {
          ...initialState.upgradedCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.UPGRADE_TRIAL_CLUSTER):
        draft.upgradedCluster = {
          ...initialState.upgradedCluster,
          pending: true,
        };
        break;
      case clustersConstants.CLEAR_UPGRADE_TRIAL_CLUSTER_RESPONSE:
        draft.upgradedCluster = {
          ...initialState.upgradedCluster,
        };
        break;

      // GET_CLUSTER_STATUS
      case REJECTED_ACTION(clustersConstants.GET_CLUSTER_STATUS):
        draft.clusterStatus = {
          ...initialState.clusterStatus,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.GET_CLUSTER_STATUS):
        draft.clusterStatus = {
          ...initialState.clusterStatus,
          pending: true,
          status: state.clusterStatus.status,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.GET_CLUSTER_STATUS):
        draft.clusterStatus = {
          ...baseState,
          fulfilled: true,
          status: action.payload.data,
        };
        break;

      // GET_CLUSTER_VERSIONS
      case REJECTED_ACTION(clustersConstants.GET_CLUSTER_VERSIONS):
        draft.clusterVersions = {
          ...initialState.clusterVersions,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.GET_CLUSTER_VERSIONS):
        draft.clusterVersions = {
          ...initialState.clusterVersions,
          pending: true,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.GET_CLUSTER_VERSIONS):
        draft.clusterVersions = {
          ...baseState,
          fulfilled: true,
          versions: action.payload.data.items
            ? filterAndSortClusterVersions(action.payload.data.items)
            : [],
        };
        break;

      case REJECTED_ACTION(clustersConstants.GET_UPGRADE_GATES):
        draft.upgradeGates = {
          ...initialState.upgradeGates,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.GET_UPGRADE_GATES):
        draft.upgradeGates.pending = true;
        break;

      case FULFILLED_ACTION(clustersConstants.GET_UPGRADE_GATES):
        draft.upgradeGates = {
          ...baseState,
          gates: action.payload ?? [],
          fulfilled: true,
        };
        break;

      case clustersConstants.SET_CLUSTER_UPGRADE_GATE:
        draft.details.cluster.upgradeGates = [
          ...(state.details.cluster.upgradeGates ?? []),
          { version_gate: { id: action.payload } },
        ];
        break;

      default:
        return state;
    }
  });

clustersReducer.initialState = initialState;

export { initialState, clustersReducer };

export default clustersReducer;
