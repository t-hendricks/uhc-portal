import moment from 'moment';
import {
  issuesCountSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
  lastCheckInSelector,
  hasDataSelector,
  issuesSelector,
} from '../MonitoringSelectors';
import {
  mockAlerts,
  mockNodes,
  mockOperators,
  resourceUsageWithIssues,
  resourceUsageWithoutIssues,
  mockOSDCluserDetails,
  mockOCPClusterDetails,
  mockLastCheckIn,
} from './Monitoring.fixtures';
import { alertsSeverity, thresholds, monitoringStatuses } from '../monitoringHelper';
import clusterStates from '../../../../common/clusterStates';

describe('issuesCountSelector', () => {
  it('should count existing issues', () => {
    expect(issuesCountSelector(mockAlerts.data, 'severity', alertsSeverity.CRITICAL)).toEqual(2);
  });

  it('should find no issues', () => {
    expect(issuesCountSelector(mockNodes.data, 'up', false)).toEqual(0);
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


describe('issuesSelector', () => {
  const cluster = {
    ...mockOSDCluserDetails,
    metrics: {
      ...resourceUsageWithIssues,
      memory: {
        ...resourceUsageWithIssues.memory,
        updated_timestamp: moment.utc(),
      },
      cpu: {
        ...resourceUsageWithIssues.cpu,
        updated_timestamp: moment.utc(),
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
      nodes: mockNodes,
      operators: mockOperators,
    },
  };


  it('should count issues and total issues', () => {
    const expected = {
      count: 5,
      alerts: 2,
      nodes: 0,
      resourceUsage: 2,
      operators: 1,
    };
    expect(issuesSelector(stateWithIssues)).toEqual(expected);
  });
});
