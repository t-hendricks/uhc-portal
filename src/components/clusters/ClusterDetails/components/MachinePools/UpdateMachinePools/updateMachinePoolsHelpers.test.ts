import { GlobalState } from '~/redux/store';
import clusterService from '~/services/clusterService';
import {
  isHCPControlPlaneUpdating,
  updateAllMachinePools,
  isControlPlaneValidForMachinePool,
  isMachinePoolUpgrading,
  isMachinePoolScheduleError,
} from './updateMachinePoolsHelpers';
import { NodePoolWithUpgradePolicies } from '../machinePoolCustomTypes';

jest.mock('~/services/clusterService');
clusterService.patchNodePool = jest.fn();
clusterService.postNodePoolUpgradeSchedule = jest.fn();

describe('updateMachinePoolsHelpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('isHCPControlPlaneUpdating', () => {
    // This state should cause isHCPControlPlaneUpdating to return false
    const state = {
      clusters: {
        details: {
          cluster: { hypershift: { enabled: true }, version: { id: 'openshift-v4.13.3' } },
        },
      },
      clusterUpgrades: { schedules: { items: [] } },

      machinePools: {
        getMachinePools: {
          data: [{ fake: 'machine pool data' }],
          fulfilled: true,
          error: false,
        },
      },
    };
    it('returns false', () => {
      expect(isHCPControlPlaneUpdating(state as unknown as GlobalState)).toBeFalsy();
    });
    describe('returns true if', () => {
      it('not hypershift', () => {
        const newState = {
          ...state,
          clusters: {
            details: {
              cluster: { ...state.clusters.details.cluster, hypershift: { enabled: false } },
            },
          },
        };
        expect(isHCPControlPlaneUpdating(newState as unknown as GlobalState)).toBeTruthy();
      });

      it('there is not a control plane version', () => {
        const newState = {
          ...state,
          clusters: {
            details: {
              cluster: { ...state.clusters.details.cluster, version: {} },
            },
          },
        };
        expect(isHCPControlPlaneUpdating(newState as unknown as GlobalState)).toBeTruthy();
      });

      it('control plane has started on update', () => {
        const newState = {
          ...state,
          clusterUpgrades: {
            schedules: {
              items: [
                { upgrade_type: 'OSD', schedule_type: 'automatic', state: { value: 'started' } },
              ],
            },
          },
        };
        expect(isHCPControlPlaneUpdating(newState as unknown as GlobalState)).toBeTruthy();
      });

      it('the machine pool data is unknown', () => {
        const newState = {
          ...state,
          machinePools: {
            getMachinePools: {
              fulfilled: true,
              error: false,
            },
          },
        };
        expect(isHCPControlPlaneUpdating(newState as unknown as GlobalState)).toBeTruthy();
      });

      it('the machine pool data is still being fetched', () => {
        const newState = {
          ...state,
          machinePools: {
            getMachinePools: {
              data: [{ fake: 'machine pool data' }],
              fulfilled: false,
              error: false,
            },
          },
        };
        expect(isHCPControlPlaneUpdating(newState as unknown as GlobalState)).toBeTruthy();
      });

      it('there was an error getting machine pool data', () => {
        const newState = {
          ...state,
          machinePools: {
            getMachinePools: {
              data: [{ fake: 'machine pool data' }],
              fulfilled: false,
              error: true,
            },
          },
        };
        expect(isHCPControlPlaneUpdating(newState as unknown as GlobalState)).toBeTruthy();
      });
    });
  });

  describe('updateAllMachinePools', () => {
    const machinePools = [{ id: 'myPool1' }, { id: 'myPool2' }];
    const clusterId = 'myCluster';
    const toBeVersion = '4.14.1';

    it('calls patchNodePool if useNodePoolUpgradePolicies flag is false', async () => {
      expect(clusterService.patchNodePool).not.toBeCalled();
      await updateAllMachinePools(machinePools, clusterId, toBeVersion, false);
      expect(clusterService.postNodePoolUpgradeSchedule).not.toBeCalled();
      expect(clusterService.patchNodePool).toBeCalledTimes(2);

      const nodePoolPatchMock = clusterService.patchNodePool as jest.Mock;

      const callForPool1 = nodePoolPatchMock.mock.calls[0];
      const callForPool2 = nodePoolPatchMock.mock.calls[1];

      expect(callForPool1).toEqual(['myCluster', 'myPool1', { version: { id: '4.14.1' } }]);
      expect(callForPool2).toEqual(['myCluster', 'myPool2', { version: { id: '4.14.1' } }]);
    });

    it('calls postNodePoolUpgradeSchedule if useNodePoolUpgradePolicies flag is true', async () => {
      expect(clusterService.postNodePoolUpgradeSchedule).not.toBeCalled();
      await updateAllMachinePools(machinePools, clusterId, toBeVersion, true);

      expect(clusterService.patchNodePool).not.toBeCalled();
      expect(clusterService.postNodePoolUpgradeSchedule).toBeCalledTimes(2);

      const nodePoolPostMock = clusterService.postNodePoolUpgradeSchedule as jest.Mock;

      const callForPool1 = nodePoolPostMock.mock.calls[0];
      const callForPool2 = nodePoolPostMock.mock.calls[1];

      expect(callForPool1).toEqual([
        'myCluster',
        'myPool1',
        {
          next_run: expect.anything(),
          node_pool_id: 'myPool1',
          schedule_type: 'manual',
          upgrade_type: 'NodePool',
          version: '4.14.1',
        },
      ]);
      expect(callForPool2).toEqual([
        'myCluster',
        'myPool2',
        {
          next_run: expect.anything(),
          node_pool_id: 'myPool2',
          schedule_type: 'manual',
          upgrade_type: 'NodePool',
          version: '4.14.1',
        },
      ]);
    });
  });

  describe('isControlPlaneValidForMachinePool', () => {
    const controlPlaneVersion = '4.14.1';

    it('returns true if available versions are not known', () => {
      const machinePool = { id: 'myPool1', version: { available_upgrades: undefined } };
      expect(isControlPlaneValidForMachinePool(machinePool, controlPlaneVersion)).toBeTruthy();
    });

    it('returns true if control plane version is in available versions', () => {
      const machinePool = { id: 'myPool1', version: { available_upgrades: ['4.14.0', ' 4.14.1'] } };
      expect(isControlPlaneValidForMachinePool(machinePool, controlPlaneVersion)).toBeTruthy();
    });

    it('returns false if control plane version is not in available versions', () => {
      const machinePool = { id: 'myPool1', version: { available_upgrades: ['4.14.0'] } };
      expect(isControlPlaneValidForMachinePool(machinePool, controlPlaneVersion)).toBeFalsy();
    });

    it('returns false if there are not any available versions', () => {
      const machinePool = { id: 'myPool1', version: { available_upgrades: [] } };
      expect(isControlPlaneValidForMachinePool(machinePool, controlPlaneVersion)).toBeFalsy();
    });
  });

  describe('isMachinePoolUpgrading', () => {
    it('returns true if machine pool has upgrading policies', () => {
      const machinePool = {
        id: 'myPool1',
        upgradePolicies: { items: ['I am an upgrade object'] },
      } as NodePoolWithUpgradePolicies;
      expect(isMachinePoolUpgrading(machinePool)).toBeTruthy();
    });

    it('returns false if machine pool does not have upgradePolicy object - used useNodePoolUpgradePolicies gate is false', () => {
      const machinePool = { id: 'myPool1' } as NodePoolWithUpgradePolicies;
      expect(isMachinePoolUpgrading(machinePool)).toBeFalsy();
    });

    it('returns false when the number of upgrade policies is 0', () => {
      const machinePool = {
        id: 'myPool1',
        upgradePolicies: { items: [] },
      } as NodePoolWithUpgradePolicies;
      expect(isMachinePoolUpgrading(machinePool)).toBeFalsy();
    });
  });

  describe('isMachinePoolScheduleError', () => {
    it('returns false if error message is empty', () => {
      const machinePool = { id: 'myPool1', upgradePolicies: { errorMessage: '', items: [] } };
      expect(isMachinePoolScheduleError(machinePool)).toBeFalsy();
    });

    it('returns false if error message does not exist', () => {
      const machinePool = { id: 'myPool1' };
      expect(isMachinePoolScheduleError(machinePool)).toBeFalsy();
    });

    it('returns true if error message is present', () => {
      const machinePool = {
        id: 'myPool1',
        upgradePolicies: { errorMessage: 'I am an error!', items: [] },
      };
      expect(isMachinePoolScheduleError(machinePool)).toBeTruthy();
    });
  });
});
