import { getEnableMinorVersionUpgrades, isNextMinorVersionAvailable } from '../MinorVersionUpgradeSelectors';

describe('Minor Version Upgrade Selectors', () => {
  let state = {};
  beforeEach(() => {
    state = {
      clusters: { details: { cluster: { version: { raw_id: '1.2.3', available_upgrades: ['1.2.4', '1.2.5'] } } } },
      clusterUpgrades: {
        schedules: {
          items: [
            { schedule_type: 'automatic', enable_minor_version_upgrades: true, version: '1.2.4' },
          ],
        },
      },
    };
  });
  describe('GetEnableMinorVersionUpgrade tests', () => {
    test('Returns false when false in state', () => {
      state.clusterUpgrades.schedules.items[0].enable_minor_version_upgrades = false;
      expect(getEnableMinorVersionUpgrades(state)).toBe(false);
    });

    test('Returns true when true in state', () => {
      state.clusterUpgrades.schedules.items[0].enable_minor_version_upgrades = true;
      expect(getEnableMinorVersionUpgrades(state)).toBe(true);
    });

    test('Returns true when manual', () => {
      state.clusterUpgrades.schedules.items[0].schedule_type = 'manual';
      expect(getEnableMinorVersionUpgrades(state)).toBe(true);
    });
  });

  describe('IsNextMinorVersionAvailable tests', () => {
    test('Returns false when z stream is scheduled', () => {
      state.clusters.details.cluster.version.raw_id = '1.2.3';
      state.clusterUpgrades.schedules.items[0].version = '1.2.4';
      expect(isNextMinorVersionAvailable(state)).toBe(false);
    });

    test('Returns false when latest available is only z/patch update', () => {
      state.clusters.details.cluster.version.raw_id = '1.2.3';
      state.clusterUpgrades.schedules.items[0].version = '';
      state.clusters.details.cluster.version.available_upgrades = ['1.2.4', '1.2.5', '1.2.6'];
      expect(isNextMinorVersionAvailable(state)).toBe(false);
    });

    test('Returns true when latest available is y/minor update', () => {
      state.clusters.details.cluster.version.raw_id = '1.2.3';
      state.clusterUpgrades.schedules.items[0].version = '';
      state.clusters.details.cluster.version.available_upgrades = ['1.2.4', '1.2.5', '1.2.6', '1.3.1'];
      expect(isNextMinorVersionAvailable(state)).toBe(true);
    });
  });
});
