import type { AxiosError } from 'axios';
import { action, ActionType } from 'typesafe-actions';
import { clustersConstants } from '../constants';
import { clusterService } from '../../services';
import { REJECTED_ACTION } from '../reduxHelpers';
import { POST_UPGRADE_SCHEDULE } from '../../components/clusters/common/Upgrades/clusterUpgradeActions';

const fetchUpgradeGateFromAPI = () =>
  clusterService.getUpgradeGates().then((result) => result.data.items);

const fetchUpgradeGates = () =>
  action(clustersConstants.GET_UPGRADE_GATES, fetchUpgradeGateFromAPI());

const setClusterUpgradeGate = (upgradeGateId: string) =>
  action(clustersConstants.SET_CLUSTER_UPGRADE_GATE, upgradeGateId);

const rejectGateAction = (error: AxiosError) => ({
  type: REJECTED_ACTION(POST_UPGRADE_SCHEDULE),
  error,
  payload: error,
});

const upgradeGateActions = {
  fetchUpgradeGates,
  setClusterUpgradeGate,
  rejectGateAction,
};

type UpgradeGateAction = ActionType<typeof upgradeGateActions>;

export {
  upgradeGateActions,
  fetchUpgradeGates,
  setClusterUpgradeGate,
  rejectGateAction,
  UpgradeGateAction,
};
