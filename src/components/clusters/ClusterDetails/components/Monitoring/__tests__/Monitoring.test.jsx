import React from 'react';
import { render, checkAccessibility } from '~/testUtils';
import Monitoring from '../Monitoring';
import { monitoringStatuses } from '../monitoringHelper';

describe('<Monitoring />', () => {
  const defaultProps = {
    cluster: {},
    alerts: {},
    nodes: {},
    operators: {},
    lastCheckIn: new Date('2020-02-02'),
    discoveredIssues: 0,
  };

  // Skipping these tests because the Monitoring component
  // has accessibility issues
  xit.each(Object.keys(monitoringStatuses))(
    'is accessible with health status %s',
    async (status) => {
      const { container } = render(
        <Monitoring {...defaultProps} healthStatus={monitoringStatuses[status]} />,
      );
      await checkAccessibility(container);
    },
  );
});
