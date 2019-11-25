import { issuesSelector } from '../MonitoringSelectors';
import { mockAlerts, mockNodes } from './Monitoring.fixtures';
import { alertsSeverity } from '../monitoringHelper';

describe('issuesSelector', () => {
  it('should count existing issues', () => {
    expect(issuesSelector(mockAlerts.data, 'severity', alertsSeverity.CRITICAL)).toEqual(2);
  });

  it('should find no issues', () => {
    expect(issuesSelector(mockNodes.data, 'up', false)).toEqual(0);
  });
});
