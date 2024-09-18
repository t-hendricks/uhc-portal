/* eslint-disable max-len */

import { splitVersion } from '~/common/versionHelpers';

export const getFromVersionFromHelper = (cluster) => cluster.version?.raw_id || null;

export const getToVersionFromHelper = (schedules, cluster) => {
  const scheduledUpdate = schedules?.items?.find(
    (schedule) => schedule.version && schedule.version !== getFromVersionFromHelper(cluster),
  );
  if (!scheduledUpdate) {
    if (
      !cluster?.version?.available_upgrades ||
      cluster?.version?.available_upgrades.length === 0
    ) {
      return null;
    }
    const versionArray = cluster.version.available_upgrades;
    return versionArray[versionArray.length - 1];
  }
  return scheduledUpdate.version;
};

export const getClusterAcks = (schedules, cluster, upgradeGatesData, upgradeVersion) => {
  const clusterId = cluster?.id;
  const isSTSCluster = cluster?.aws?.sts?.role_arn && cluster?.aws?.sts?.role_arn !== '';
  if (!clusterId) {
    return [[], []];
  }
  const toVersion = upgradeVersion || getToVersionFromHelper(schedules, cluster);
  const fromVersion = cluster.version?.raw_id || null;
  const clusterAcks = cluster?.upgradeGates || [];
  const upgradeGates = upgradeGatesData || [];

  const [toMajor, toMinor] = splitVersion(toVersion);
  const [fromMajor, fromMinor] = splitVersion(fromVersion);

  if (!toMajor || !toMinor || !fromMajor || !fromMinor) {
    return [[], []];
  }

  const possibleGates = upgradeGates.filter((gate) => {
    if (gate.sts_only && !isSTSCluster) {
      return false;
    }
    const [gateMajor, gateMinor] = splitVersion(gate.version_raw_id_prefix);
    if (!gateMajor || !gateMinor) {
      return false;
    }
    return (
      (gateMajor > fromMajor && gateMajor <= toMajor) ||
      (gateMajor === fromMajor && gateMinor > fromMinor && gateMinor <= toMinor)
    );
  });

  const unMetAcks = [];
  const metAcks = [];

  possibleGates.forEach((gate) => {
    const clusterAck = clusterAcks.find((ack) => ack.version_gate?.id === gate.id);
    if (clusterAck) {
      metAcks.push(clusterAck);
    } else {
      unMetAcks.push(gate);
    }
  });

  return [unMetAcks, metAcks];
};

export const getClusterUnMetClusterAcks = (schedules, cluster, upgradeGates, upgradeVersion) => {
  const toVersion = upgradeVersion || getToVersionFromHelper(schedules, cluster);
  return getClusterAcks(schedules, cluster, upgradeGates, toVersion)[0];
};

export const getHasUnMetClusterAcks = (schedules, cluster, upgradeGates, upgradeVersion) =>
  getClusterUnMetClusterAcks(schedules, cluster, upgradeGates, upgradeVersion).length > 0;

export const getHasScheduledManual = (schedules, cluster) =>
  !schedules?.items.some((policy) => policy.schedule_type === 'automatic') &&
  schedules?.items.some((schedule) => schedule.version !== getFromVersionFromHelper(cluster));
