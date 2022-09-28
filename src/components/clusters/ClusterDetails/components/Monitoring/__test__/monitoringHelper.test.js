import {
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
} from '../monitoringHelper';

describe('resourceUsageIssuesHelper', () => {
  it('should count resource usage issues', () => {
    expect(
      resourceUsageIssuesHelper(
        resourceUsageWithIssues.cpu,
        resourceUsageWithIssues.memory,
        thresholds.DANGER,
      ),
    ).toEqual(2);
  });

  it('should find no issues', () => {
    expect(
      resourceUsageIssuesHelper(
        resourceUsageWithoutIssues.cpu,
        resourceUsageWithoutIssues.memory,
        thresholds.DANGER,
      ),
    ).toEqual(0);
  });
});

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
