import {
  clusterHealthSelector,
  lastCheckInSelector,
  issuesAndWarningsSelector,
} from '../MonitoringSelectors';
import {
  mockAlerts,
  mockNodes,
  mockOperators,
  resourceUsageWithIssues,
  mockOSDCluserDetails,
  mockOCPActiveClusterDetails,
  mockOCPDisconnectedClusterDetails,
  mockLastCheckIn,
  oldLastCheckIn,
} from './Monitoring.fixtures';
import { monitoringStatuses } from '../monitoringHelper';
import clusterStates from '../../../../common/clusterStates';

describe('clusterHealthSelector', () => {
  describe('OCP', () => {
    const stateWithOCPActive = {
      clusters: {
        details: {
          cluster: {
            ...mockOCPActiveClusterDetails,
          },
        },
      },
    };

    const stateWithOCPDisconnected = {
      clusters: {
        details: {
          cluster: {
            ...mockOCPDisconnectedClusterDetails,
          },
        },
      },
    };

    it('should return DISCONNECTED when subscription Disconnected and checkin unknown', () => {
      expect(clusterHealthSelector(stateWithOCPDisconnected, lastCheckInSelector(null), null))
        .toBe(monitoringStatuses.DISCONNECTED);
    });

    it('should return DISCONNECTED when subscription Disconnected and metrics are stale', () => {
      expect(clusterHealthSelector(stateWithOCPDisconnected, oldLastCheckIn, null))
        .toBe(monitoringStatuses.DISCONNECTED);
    });

    it.todo("if fresh metrics arrived for a Disconnected cluster, but subscription didn't yet switch to Active, what should we return?");

    it('should return NO_METRICS when checkin unknown', () => {
      expect(clusterHealthSelector(stateWithOCPActive, lastCheckInSelector(null), null))
        .toBe(monitoringStatuses.NO_METRICS);
    });

    it('should return NO_METRICS when metrics are stale', () => {
      expect(clusterHealthSelector(stateWithOCPActive, oldLastCheckIn, null))
        .toBe(monitoringStatuses.NO_METRICS);
    });

    it('should return HEALTHY when metrics are fresh & good', () => {
      expect(clusterHealthSelector(stateWithOCPActive, mockLastCheckIn, 0))
        .toBe(monitoringStatuses.HEALTHY);
    });
  });

  describe('OSD', () => {
    const stateWithOsdCluster = {
      clusters: {
        details: {
          cluster: {
            ...mockOSDCluserDetails,
          },
        },
      },
    };

    it('should not return status DISCONNECTED for OSD cluster', () => {
      expect(clusterHealthSelector(stateWithOsdCluster, lastCheckInSelector(null), null))
        .not.toBe(monitoringStatuses.DISCONNECTED);
    });

    it('should return status UPGRADING', () => {
      const { metrics } = mockOSDCluserDetails;
      // upgrading cluster state
      const state = {
        clusters: {
          details: {
            cluster: {
              ...mockOSDCluserDetails,
              metrics: { ...metrics, upgrade: { ...metrics.upgrade, state: 'running' } },
            },
          },
        },
      };
      expect(clusterHealthSelector(state, mockLastCheckIn, 1))
        .toBe(monitoringStatuses.UPGRADING);
    });

    it('should return status INSTALLING', () => {
      // installing cluster state
      const state = {
        clusters: {
          details: {
            cluster: {
              ...mockOSDCluserDetails,
              state: clusterStates.INSTALLING,
            },
          },
        },
      };
      expect(clusterHealthSelector(state, mockLastCheckIn, null))
        .toBe(monitoringStatuses.INSTALLING);
    });

    it('should return status HAS_ISSUES', () => {
      expect(clusterHealthSelector(stateWithOsdCluster, mockLastCheckIn, 2))
        .toBe(monitoringStatuses.HAS_ISSUES);
    });

    it('return status NO_METRICS', () => {
      expect(clusterHealthSelector(stateWithOsdCluster, oldLastCheckIn, 3))
        .toBe(monitoringStatuses.NO_METRICS);
    });

    it('return status HEALTHY', () => {
      expect(clusterHealthSelector(stateWithOsdCluster, mockLastCheckIn, 0))
        .toBe(monitoringStatuses.HEALTHY);
    });
  });


  describe('issuesAndWarningsSelector', () => {
    const cluster = {
      ...mockOSDCluserDetails,
      metrics: {
        ...resourceUsageWithIssues,
        memory: {
          ...resourceUsageWithIssues.memory,
          updated_timestamp: new Date().toISOString(),
        },
        cpu: {
          ...resourceUsageWithIssues.cpu,
          updated_timestamp: new Date().toISOString(),
        },
      },
    };

    const stateWithIssues = {
      clusters: {
        details: {
          cluster,
        },
      },
      monitoring: {
        alerts: mockAlerts,
        nodes: { data: [...mockNodes.data.slice(0, 2)] },
        operators: mockOperators,
      },
    };

    it('should count issues, warnings and total issues', () => {
      const expected = {
        issues: {
          alerts: 2,
          nodes: 0,
          operators: 1,
          resourceUsage: 2,
          totalCount: 5,
        },
        warnings: {
          alerts: 3,
          operators: 0,
          resourceUsage: 2,
        },
      };

      expect(issuesAndWarningsSelector(stateWithIssues)).toEqual(expected);
    });
  });
});
