import { ActionType, action } from 'typesafe-actions';
import { ViewOptions } from '~/types/types';
import { createServiceLogQueryObject } from '../../../../../common/queryHelpers';
import { clusterLogConstants } from '../../../../../redux/constants';
import serviceLogService from '../../../../../services/serviceLogService';

const getClusterHistory = (
  externalClusterID: string | undefined,
  clusterID: string | undefined,
  params: ViewOptions,
) =>
  action(
    clusterLogConstants.GET_CLUSTER_LOGS,
    serviceLogService
      .getClusterHistory(externalClusterID, clusterID, createServiceLogQueryObject(params))
      .then((response) => ({
        externalClusterID,
        logs: response,
      })),
  );

const resetClusterHistory = () => action(clusterLogConstants.RESET_CLUSTER_HISTORY);

const clusterLogActions = {
  getClusterHistory,
  resetClusterHistory,
} as const;

export type ClusterLogAction = ActionType<
  (typeof clusterLogActions)[keyof typeof clusterLogActions]
>;
export { clusterLogActions };
