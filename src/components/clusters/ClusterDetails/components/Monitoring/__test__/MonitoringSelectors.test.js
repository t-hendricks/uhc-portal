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
  makeFutureDate,
  makeFreshCheckIn,
  makeStaleCheckIn,
} from './Monitoring.fixtures';
import { monitoringStatuses } from '../monitoringHelper';
import clusterStates from '../../../../common/clusterStates';

describe('lastCheckInSelector', () => {
  it('returns something valid if activity_timestamp is missing (unrealistic)', () => {
    const checkIn = lastCheckInSelector({});
    expect(checkIn).toBeInstanceOf(Date);
    expect(checkIn.getTime() < new Date('1900-01-01').getTime()); // far in the past.
  });
});

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

    it('should return DISCONNECTED when subscription Disconnected and metrics are stale', () => {
      expect(clusterHealthSelector(stateWithOCPDisconnected, makeStaleCheckIn(), null))
        .toBe(monitoringStatuses.DISCONNECTED);
    });

    it.todo("if fresh metrics arrived for a Disconnected cluster, but subscription didn't yet switch to Active, what should we return?");

    it('should return NO_METRICS when metrics are stale', () => {
      expect(clusterHealthSelector(stateWithOCPActive, makeStaleCheckIn(), null))
        .toBe(monitoringStatuses.NO_METRICS);
    });

    it('should return HEALTHY when metrics are fresh & good', () => {
      expect(clusterHealthSelector(stateWithOCPActive, makeFreshCheckIn(), 0))
        .toBe(monitoringStatuses.HEALTHY);
    });

    it("handles timestamp in future (relative to browser's clock)", () => {
      expect(clusterHealthSelector(stateWithOCPActive, makeFutureDate(), 0))
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
      clusterUpgrades: {
        schedules: {
          items: [],
        },
      },
    };

    it('should not return status DISCONNECTED for OSD cluster', () => {
      expect(clusterHealthSelector(stateWithOsdCluster, makeStaleCheckIn(), null))
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
        clusterUpgrades: {
          schedules: {
            items: [
              {
                state: { value: 'running' },
              },
            ],
          },
        },
      };
      expect(clusterHealthSelector(state, makeFreshCheckIn(), 1))
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
        clusterUpgrades: {
          schedules: {
            items: [],
          },
        },
      };
      expect(clusterHealthSelector(state, makeFreshCheckIn(), null))
        .toBe(monitoringStatuses.INSTALLING);
    });

    it('should return status HAS_ISSUES', () => {
      expect(clusterHealthSelector(stateWithOsdCluster, makeFreshCheckIn(), 2))
        .toBe(monitoringStatuses.HAS_ISSUES);
    });

    it('return status NO_METRICS', () => {
      expect(clusterHealthSelector(stateWithOsdCluster, makeStaleCheckIn(), 3))
        .toBe(monitoringStatuses.NO_METRICS);
    });

    it('return status HEALTHY', () => {
      expect(clusterHealthSelector(stateWithOsdCluster, makeFreshCheckIn(), 0))
        .toBe(monitoringStatuses.HEALTHY);
    });

    it('return status UNINSTALLING', () => {
      const stateWithUninstallingCluster = { ...stateWithOsdCluster };
      stateWithUninstallingCluster.clusters.details.cluster.state = clusterStates.UNINSTALLING;
      expect(clusterHealthSelector(stateWithUninstallingCluster, makeFreshCheckIn(), 0))
        .toBe(monitoringStatuses.UNINSTALLING);
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
