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
  mockOCPActiveClusterDetails,
  mockOCPDisconnectedClusterDetails,
  makeFutureDate,
  makeFreshCheckIn,
  makeStaleCheckIn,
} from './Monitoring.fixtures';
import { monitoringStatuses } from '../monitoringHelper';

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
      expect(clusterHealthSelector(stateWithOCPDisconnected, makeStaleCheckIn(), null)).toBe(
        monitoringStatuses.DISCONNECTED,
      );
    });

    it.todo(
      "if fresh metrics arrived for a Disconnected cluster, but subscription didn't yet switch to Active, what should we return?",
    );

    it('should return NO_METRICS when metrics are stale', () => {
      expect(clusterHealthSelector(stateWithOCPActive, makeStaleCheckIn(), null)).toBe(
        monitoringStatuses.NO_METRICS,
      );
    });

    it('should return HEALTHY when metrics are fresh & good', () => {
      expect(clusterHealthSelector(stateWithOCPActive, makeFreshCheckIn(), 0)).toBe(
        monitoringStatuses.HEALTHY,
      );
    });

    it("handles timestamp in future (relative to browser's clock)", () => {
      expect(clusterHealthSelector(stateWithOCPActive, makeFutureDate(), 0)).toBe(
        monitoringStatuses.HEALTHY,
      );
    });
  });

  describe('issuesAndWarningsSelector', () => {
    const cluster = {
      ...mockOCPActiveClusterDetails,
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
