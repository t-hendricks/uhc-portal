import { clustersConstants } from '../constants';
import { clusterService } from '../../services';

const fetchUpgradeGateFromAPI = () => clusterService
  .getUpgradeGates()
  .then(result => result.data.items);

const fetchUpgradeGates = () => ({
  type: clustersConstants.GET_UPGRADE_GATES,
  payload: fetchUpgradeGateFromAPI(),
});

const setClusterUpgradeGate = upgradeGateId => ({
  type: clustersConstants.SET_CLUSTER_UPGRADE_GATE,
  payload: upgradeGateId,
});

const upgradeGateActions = {
  fetchUpgradeGates,
  setClusterUpgradeGate,
};

export {
  upgradeGateActions,
  fetchUpgradeGates,
  setClusterUpgradeGate,
};
