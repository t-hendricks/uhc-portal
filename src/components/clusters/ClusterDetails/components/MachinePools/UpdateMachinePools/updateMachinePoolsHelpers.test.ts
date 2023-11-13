import { GlobalState } from '~/redux/store';
import { isHCPControlPlaneUpdating } from './updateMachinePoolsHelpers';

describe('updateMachinePoolsHelpers', () => {
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
});
