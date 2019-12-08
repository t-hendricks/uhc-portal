import {
  issuesSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
  lastCheckInSelector,
  hasDataSelector,
} from '../MonitoringSelectors';
import {
  mockAlerts,
  mockNodes,
  resourceUsageWithIssues,
  resourceUsageWithoutIssues,
  mockOSDCluserDetails,
  mockOCPClusterDetails,
  mockLastCheckIn,
} from './Monitoring.fixtures';
import { alertsSeverity, thresholds, monitoringStatuses } from '../monitoringHelper';
import clusterStates from '../../../../common/clusterStates';

describe('issuesSelector', () => {
  it('should count existing issues', () => {
    expect(issuesSelector(mockAlerts.data, 'severity', alertsSeverity.CRITICAL)).toEqual(2);
  });

  it('should find no issues', () => {
    expect(issuesSelector(mockNodes.data, 'up', false)).toEqual(0);
  });
});

describe('resourceUsageIssuesSelector', () => {
  it('should count existing issues', () => {
    expect(resourceUsageIssuesSelector(
      resourceUsageWithIssues.cpu,
      resourceUsageWithIssues.memory,
      thresholds.DANGER,
    ))
      .toEqual(2);
  });

  it('should find no issues', () => {
    expect(resourceUsageIssuesSelector(
      resourceUsageWithoutIssues.cpu,
      resourceUsageWithoutIssues.memory,
      thresholds.DANGER,
    ))
      .toEqual(0);
  });
});

describe('clusterHealthSelector', () => {
  it('should return status DISCONNECTED', () => {
    expect(clusterHealthSelector(mockOCPClusterDetails, lastCheckInSelector(null), null))
      .toBe(monitoringStatuses.DISCONNECTED);
  });

  it('should not return status DISCONNECTED for OSD cluster', () => {
    expect(clusterHealthSelector(mockOSDCluserDetails, lastCheckInSelector(null), null))
      .not.toBe(monitoringStatuses.DISCONNECTED);
  });

  it('should return status UPGRADING', () => {
    const { metrics } = mockOSDCluserDetails;
    const upgradingCluster = {
      ...mockOSDCluserDetails,
      metrics: { ...metrics, upgrade: { ...metrics.upgrade, state: 'running' } },
    };
    expect(clusterHealthSelector(upgradingCluster, mockLastCheckIn, 1))
      .toBe(monitoringStatuses.UPGRADING);
  });

  it('should return status INSTALLING', () => {
    const installingCluster = {
      ...mockOSDCluserDetails,
      state: clusterStates.INSTALLING,
    };
    expect(clusterHealthSelector(installingCluster, mockLastCheckIn, null))
      .toBe(monitoringStatuses.INSTALLING);
  });

  it('should return status HAS_ISSUES', () => {
    expect(clusterHealthSelector(mockOSDCluserDetails, mockLastCheckIn, 2))
      .toBe(monitoringStatuses.HAS_ISSUES);
  });

  it('return status NO_METRICS', () => {
    const oldLastCheckIn = { ...mockLastCheckIn, hours: 3 };
    expect(clusterHealthSelector(mockOSDCluserDetails, oldLastCheckIn, 3))
      .toBe(monitoringStatuses.NO_METRICS);
  });

  it('return status HEALTHY', () => {
    expect(clusterHealthSelector(mockOSDCluserDetails, mockLastCheckIn, 0))
      .toBe(monitoringStatuses.HEALTHY);
  });

  describe('hasDataSelector', () => {
    it('should return true if there is data', () => {
      expect(hasDataSelector(mockNodes)).toBe(true);
    });

    it('should return false if there is no data', () => {
      expect(hasDataSelector({ data: [] })).toBe(false);
    });
  });
});
