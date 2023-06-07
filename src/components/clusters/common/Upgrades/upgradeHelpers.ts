/* eslint-disable camelcase */
import { GlobalState } from '~/redux/store';
import { AugmentedCluster } from '~/types/types';
import { UpgradePolicy, UpgradePolicyState } from '~/types/clusters_mgmt.v1';

export const hasAvailableUpdates = (cluster: AugmentedCluster) => {
  const availableUpdates = cluster?.version?.available_upgrades;
  return availableUpdates && availableUpdates.length > 0;
};

export const hasAvailableUpdatesSelector = (state: GlobalState) =>
  hasAvailableUpdates(state.clusters.details.cluster);

type UpgradePolicyWithState = UpgradePolicy & { state: UpgradePolicyState };

export const updateStartedSelector = (state: GlobalState) => {
  const { schedules } = state.clusterUpgrades;
  const scheduledUpdate = schedules.items.find(
    (schedule: UpgradePolicyWithState) =>
      schedule.upgrade_type === 'OSD' &&
      (schedule.schedule_type === 'manual' || schedule.schedule_type === 'automatic'),
  );

  // @ts-ignore - still reports scheduledUpdate as never
  const upgradeState = scheduledUpdate && scheduledUpdate?.state?.value;

  return upgradeState && (upgradeState === 'started' || upgradeState === 'delayed');
};
