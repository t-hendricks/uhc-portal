import { defaultClusterFromSubscription } from '~/components/clusters/common/__tests__/defaultClusterFromSubscription.fixtures';
import { ClusterConsole } from '~/types/clusters_mgmt.v1';
import { ClusterResource } from '~/types/accounts_mgmt.v1';
import {
  archivedCluster,
  cpuAndMemoryCluster,
  cpuAndMemoryClusterRecentlyUpdated,
  cpuAndMemoryClusterThreshold,
  cpuCluster,
  disconnectedCluster,
  expectedMonitoringItemLinkPropsAlert,
  expectedMonitoringItemLinkPropsNode,
  expectedMonitoringItemLinkPropsOperator,
  memoryCluster,
  mockAlerts,
  mockNodes,
  resourceUsageWithIssues,
  resourceUsageWithoutIssues,
} from './Monitoring.fixtures';
import {
  resourceUsageIssuesHelper,
  thresholds,
  hasData,
  getIssuesAndWarnings,
  alertsSeverity,
  hasResourceUsageMetrics,
  monitoringItemLinkProps,
  monitoringItemTypes,
  monitoringItemLinkType,
} from '../monitoringHelper';
import config from '../../../../../../config';

describe('getIssuesAndWarnings', () => {
  it('should count issues and warnings', () => {
    const expected = {
      issuesCount: 2,
      warningsCount: 3,
    };
    const result = getIssuesAndWarnings({
      data: mockAlerts.data,
      criteria: 'severity',
      issuesMatch: alertsSeverity.CRITICAL,
      warningsMatch: alertsSeverity.WARNING,
    });
    expect(result).toEqual(expected);
  });

  it('should count issues only', () => {
    const expected = {
      issuesCount: 1,
      warningsCount: null,
    };
    const result = getIssuesAndWarnings({
      data: mockNodes.data,
      criteria: 'up',
      issuesMatch: false,
    });
    expect(result).toEqual(expected);
  });

  it('should handle no data', () => {
    const expected = {
      issuesCount: null,
      warningsCount: null,
    };
    const result = getIssuesAndWarnings({
      data: [],
      criteria: 'up',
      issuesMatch: false,
    });
    expect(result).toEqual(expected);
  });
});

describe('hasDataSelector', () => {
  it('should return true if there is data', () => {
    expect(hasData(mockNodes)).toBe(true);
  });

  it('should return false if there is no data', () => {
    expect(hasData({ data: [] })).toBe(false);
  });
});

describe('hasResourceUsageMetrics', () => {
  it.each([
    ['default cluster should be false', defaultClusterFromSubscription, undefined, false],
    ['archived cluster should be false', archivedCluster, undefined, false],
    ['disconnected cluster should be false', disconnectedCluster, undefined, false],
    ['only cpu cluster should be false', cpuCluster, undefined, false],
    ['only memory cluster should be false', memoryCluster, undefined, false],
    [
      'cpu and memory cluster and showOldMetrics undefined should be false',
      cpuAndMemoryCluster,
      undefined,
      false,
    ],
    [
      'cpu and memory cluster and showOldMetrics false should be false',
      cpuAndMemoryCluster,
      false,
      false,
    ],
    [
      'cpu and memory cluster and showOldMetrics true should be true',
      cpuAndMemoryCluster,
      true,
      true,
    ],
    [
      'cpu and memory cluster and showOldMetrics false recently updated should be true',
      cpuAndMemoryClusterRecentlyUpdated,
      false,
      true,
    ],
  ])('%p', (title, cluster, showOldMetrics, expected) => {
    // Arrange
    config.configData = {
      ...config.configData,
      showOldMetrics,
      apiGateway: '',
    };
    // Act
    const result = hasResourceUsageMetrics(cluster);
    // Assert
    expect(result).toBe(expected);
  });

  describe('resourceUsageIssuesHelper', () => {
    it.each([
      [
        'should count resource usage issues',
        resourceUsageWithIssues.cpu,
        resourceUsageWithIssues.memory,
        thresholds.DANGER,
        2,
      ],
      [
        'should find no issues',
        resourceUsageWithoutIssues.cpu,
        resourceUsageWithoutIssues.memory,
        thresholds.DANGER,
        0,
      ],
      ['only cpu cluster', cpuCluster.metrics.cpu, undefined, 0, null],
      ['only memory cluster', undefined, memoryCluster.metrics.memory, 0, null],
      [
        'cpu and memory cluster undefined threshold',
        cpuAndMemoryCluster.metrics.cpu,
        cpuAndMemoryCluster.metrics.memory,
        0,
        0,
      ],
      [
        'cpu and memory cluster no threshold',
        cpuAndMemoryCluster.metrics.cpu,
        cpuAndMemoryCluster.metrics.memory,
        0,
        0,
      ],
      [
        'cpu and memory cluster greater threshold',
        cpuAndMemoryClusterThreshold.metrics.cpu,
        cpuAndMemoryClusterThreshold.metrics.memory,
        0,
        2,
      ],
    ])(
      '%p',
      (
        title: string,
        cpu: ClusterResource | undefined,
        memory: ClusterResource | undefined,
        threshold: number,
        expected: number | null,
      ) => expect(resourceUsageIssuesHelper(cpu, memory, threshold)).toBe(expected),
    );
  });

  describe('monitoringItemLinkProps', () => {
    it.each([
      ['no clusterConsole', undefined, undefined, '', null],
      ['undefined itemType', { url: 'http://www.example.com' }, undefined, '', null],
      [
        'ALERT itemType',
        { url: 'http://www.example.com' },
        monitoringItemTypes.ALERT,
        'alertName',
        expectedMonitoringItemLinkPropsAlert,
      ],
      [
        'ALERT itemType with slash',
        { url: 'http://www.example.com/' },
        monitoringItemTypes.ALERT,
        'alertName',
        expectedMonitoringItemLinkPropsAlert,
      ],
      [
        'NODE itemType',
        { url: 'http://www.example.com' },
        monitoringItemTypes.NODE,
        'nodeName',
        expectedMonitoringItemLinkPropsNode,
      ],
      [
        'OPERATOR itemType',
        { url: 'http://www.example.com' },
        monitoringItemTypes.OPERATOR,
        'operatorName',
        expectedMonitoringItemLinkPropsOperator,
      ],
    ])(
      '%p',
      (
        title: string,
        clusterConsole: ClusterConsole | undefined,
        itemType: monitoringItemTypes | undefined,
        itemName: string,
        expected: monitoringItemLinkType | null,
      ) =>
        expect(monitoringItemLinkProps(clusterConsole, itemType, itemName)).toStrictEqual(expected),
    );
  });
});
