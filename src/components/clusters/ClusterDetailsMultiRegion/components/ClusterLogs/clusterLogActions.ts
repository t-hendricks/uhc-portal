import { action, ActionType } from 'typesafe-actions';

import { ViewOptions } from '~/types/types';

import { createServiceLogQueryObject } from '../../../../../common/queryHelpers';
import serviceLogService from '../../../../../services/serviceLogService';

import { GET_CLUSTER_LOGS, RESET_CLUSTER_HISTORY } from './clusterLogConstants';

/* ARCHIVED DO NOT USE */
/* This file exists to support unused files that are currently archived.  No new imports from this page */

const getClusterHistory = (
  externalClusterID: string | undefined,
  clusterID: string | undefined,
  params: ViewOptions,
) =>
  action(
    GET_CLUSTER_LOGS,
    serviceLogService
      .getClusterHistory(externalClusterID, clusterID, createServiceLogQueryObject(params))
      .then((response) => ({
        externalClusterID,
        logs: response,
      })),
  );

const resetClusterHistory = () => action(RESET_CLUSTER_HISTORY);

const clusterLogActions = {
  getClusterHistory,
  resetClusterHistory,
} as const;

export type ClusterLogAction = ActionType<
  (typeof clusterLogActions)[keyof typeof clusterLogActions]
>;
export { clusterLogActions };
/* ARCHIVED DO NOT USE */
