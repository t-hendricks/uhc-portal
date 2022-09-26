import { clustersConstants } from '../constants';
import { clusterService } from '../../services';
import { REJECTED_ACTION } from '../reduxHelpers';
import { POST_UPGRADE_SCHEDULE } from '../../components/clusters/common/Upgrades/clusterUpgradeActions';

const fetchUpgradeGateFromAPI = () =>
  clusterService.getUpgradeGates().then((result) => result.data.items);

const fetchUpgradeGates = () => ({
  type: clustersConstants.GET_UPGRADE_GATES,
  payload: fetchUpgradeGateFromAPI(),
});

const setClusterUpgradeGate = (upgradeGateId) => ({
  type: clustersConstants.SET_CLUSTER_UPGRADE_GATE,
  payload: upgradeGateId,
});

const upgradeGateActions = {
  fetchUpgradeGates,
  setClusterUpgradeGate,
};

const rejectGateAction = (error) => ({
  type: REJECTED_ACTION(POST_UPGRADE_SCHEDULE),
  error,
  payload: error,
});

export { upgradeGateActions, fetchUpgradeGates, setClusterUpgradeGate, rejectGateAction };
