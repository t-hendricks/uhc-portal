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
import { isClusterUpgrading } from '../../../../common/clusterStates';

jest.mock('../../../../common/clusterStates');

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
      const result = clusterHealthSelector(stateWithOCPDisconnected, makeStaleCheckIn(), null);
      expect(result).toBe(monitoringStatuses.DISCONNECTED);
    });

    it.todo(
      "if fresh metrics arrived for a Disconnected cluster, but subscription didn't yet switch to Active, what should we return?",
    );

    it('should return NO_METRICS when metrics are stale', () => {
      const result = clusterHealthSelector(stateWithOCPActive, makeStaleCheckIn(), null);
      expect(result).toBe(monitoringStatuses.NO_METRICS);
    });

    it('should return UPGRADING when metrics are running', () => {
      isClusterUpgrading.mockReturnValueOnce(true);
      const result = clusterHealthSelector(stateWithOCPActive, makeFreshCheckIn(), 0);
      expect(result).toBe(monitoringStatuses.UPGRADING);
    });

    it('should return HEALTHY when metrics are fresh & good', () => {
      isClusterUpgrading.mockReturnValueOnce(false);
      const result = clusterHealthSelector(stateWithOCPActive, makeFreshCheckIn(), 0);
      expect(result).toBe(monitoringStatuses.HEALTHY);
    });

    it("handles timestamp in future (relative to browser's clock)", () => {
      isClusterUpgrading.mockReturnValueOnce(false);
      const result = clusterHealthSelector(stateWithOCPActive, makeFutureDate(), 0);
      expect(result).toBe(monitoringStatuses.HEALTHY);
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
