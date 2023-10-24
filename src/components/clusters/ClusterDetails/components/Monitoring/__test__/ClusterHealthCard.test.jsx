import React from 'react';
import { render, checkAccessibility } from '~/testUtils';
import { monitoringStatuses } from '../monitoringHelper';
import ClusterHealthCard from '../components/ClusterHealthCard';

describe('<ClusterHealthCard />', () => {
  it.each(Object.keys(monitoringStatuses))(
    'is accessible with health status %s',
    async (status) => {
      const { container } = render(<ClusterHealthCard healthStatus={monitoringStatuses[status]} />);
      await checkAccessibility(container);
    },
  );
});
