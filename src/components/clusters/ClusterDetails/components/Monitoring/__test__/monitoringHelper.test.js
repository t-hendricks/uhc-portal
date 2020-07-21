import { alertsSeverity, countByCriteria } from '../monitoringHelper';
import { mockAlerts, mockNodes } from './Monitoring.fixtures';

describe('issuesCountSelector', () => {
  it('should count existing issues', () => {
    expect(countByCriteria(mockAlerts.data, 'severity', alertsSeverity.CRITICAL)).toEqual(2);
  });

  it('should find no issues', () => {
    expect(countByCriteria(mockNodes.data, 'up', false)).toEqual(0);
  });
});
