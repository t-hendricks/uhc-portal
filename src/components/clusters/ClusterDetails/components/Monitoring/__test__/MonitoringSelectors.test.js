import moment from 'moment';
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
  mockOCPClusterDetails,
  mockLastCheckIn,
} from './Monitoring.fixtures';
import { monitoringStatuses } from '../monitoringHelper';
import clusterStates from '../../../../common/clusterStates';

describe('clusterHealthSelector', () => {
  const stateWithOsdCluster = {
    clusters: {
      details: {
        cluster: {
          ...mockOSDCluserDetails,
        },
      },
    },
  };

  it('should return status DISCONNECTED', () => {
    const state = {
      clusters: {
        details: {
          cluster: {
            ...mockOCPClusterDetails,
          },
        },
      },
    };
    expect(clusterHealthSelector(state, lastCheckInSelector(null), null))
      .toBe(monitoringStatuses.DISCONNECTED);
  });

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
    const oldLastCheckIn = { ...mockLastCheckIn, hours: 3 };
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
