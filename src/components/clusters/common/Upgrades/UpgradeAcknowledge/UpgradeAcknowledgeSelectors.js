/* eslint-disable max-len */

const splitMajorMinor = version => version.split('.').map(num => parseInt(num, 10)); // returns [major, minor]

const isSTSCluster = state => state.clusters.details.cluster.aws?.sts?.role_arn && state.clusters.details.cluster.aws?.sts?.role_arn !== '';

export const getClusterIdFromState = state => state.clusters?.details?.cluster?.id;
export const getClusterOpenShiftVersion = state => state.clusters?.details?.cluster?.openshift_version;
export const getFromVersionFromState = state => state.clusters.details.cluster.version?.raw_id || null;
export const getToVersionFromState = (state) => {
  if (!state.clusters.details.cluster.version?.available_upgrades || state.clusters.details.cluster.version?.available_upgrades.length === 0) {
    return null;
  }
  const versionArray = state.clusters.details.cluster.version.available_upgrades;
  return versionArray[versionArray.length - 1];
};
export const getIsManual = state => !state.clusterUpgrades.schedules.items.some(policy => policy.schedule_type === 'automatic');
export const getModalDataFromState = state => state.modal.data;

const getClusterMetAcks = state => state.clusters.details.cluster.upgradeGates || [];

export const getUpgradeGates = state => state.clusters.upgradeGates?.gates || [];

export const getClusterAcks = (state, upgradeVersion) => {
  const clusterId = getClusterIdFromState(state);
  if (!clusterId) {
    return [[], []];
  }
  const toVersion = upgradeVersion || getToVersionFromState(state);
  const fromVersion = getFromVersionFromState(state);
  const clusterAcks = getClusterMetAcks(state);
  const upgradeGates = getUpgradeGates(state) || [];

  const [toMajor, toMinor] = splitMajorMinor(toVersion);
  const [fromMajor, fromMinor] = splitMajorMinor(fromVersion);

  const possibleGates = upgradeGates.filter((gate) => {
    if (gate.sts_only && !isSTSCluster(state)) {
      return false;
    }
    const [gateMajor, gateMinor] = splitMajorMinor(gate.version_raw_id_prefix);
    return (gateMajor > fromMajor && gateMajor <= toMajor) || (gateMajor === fromMajor && gateMinor > fromMinor && gateMinor <= toMinor);
  });

  const unMetAcks = [];
  const metAcks = [];

  possibleGates.forEach((gate) => {
    const clusterAck = clusterAcks.find(ack => ack.version_gate.id === gate.id);
    if (clusterAck) {
      metAcks.push(clusterAck);
    } else {
      (
        unMetAcks.push(gate)
      );
    }
  });

  return [unMetAcks, metAcks];
};

export const getClusterUnMetClusterAcks = (state, upgradeVersion) => {
  const toVersion = upgradeVersion || getToVersionFromState(state);
  return getClusterAcks(state, toVersion)[0];
};

export const getHasUnMetClusterAcks = (state, upgradeVersion) => getClusterUnMetClusterAcks(state, upgradeVersion).length > 0;
