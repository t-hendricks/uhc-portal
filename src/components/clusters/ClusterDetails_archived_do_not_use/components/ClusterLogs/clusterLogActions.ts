import { action, ActionType } from 'typesafe-actions';

import { ViewOptions } from '~/types/types';

import { createServiceLogQueryObject } from '../../../../../common/queryHelpers';
import serviceLogService from '../../../../../services/serviceLogService';

import { GET_CLUSTER_LOGS, RESET_CLUSTER_HISTORY } from './clusterLogConstants';

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
