import {
  getFromVersionFromState,
  splitMajorMinor,
} from '../UpgradeAcknowledge/UpgradeAcknowledgeSelectors';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';

export const getEnableMinorVersionUpgrades = (state) => {
  const automatic = state.clusterUpgrades.schedules.items.find(
    (item) => item.schedule_type === 'automatic',
  );
  if (!automatic) return true;
  return automatic.enable_minor_version_upgrades;
};

export const getUpgradeScheduleId = (state) =>
  state.clusterUpgrades.schedules.items.find((item) => item.schedule_type === 'automatic')?.id;

export const isNextMinorVersionAvailable = (state) => {
  const [fromMajor, fromMinor] = splitMajorMinor(getFromVersionFromState(state));

  const availableUpgrades = state.clusters.details.cluster?.version?.available_upgrades || [];

  return availableUpgrades.some((version) => {
    const [major, minor] = splitMajorMinor(version);
    return major === fromMajor && minor > fromMinor;
  });
};

// eslint-disable-next-line max-len
export const isRosa = (state) =>
  state.clusters.details.cluster.subscription?.plan.type === normalizedProducts.ROSA;
