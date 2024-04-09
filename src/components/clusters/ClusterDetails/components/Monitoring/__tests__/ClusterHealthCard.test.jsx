import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import ClusterHealthCard from '../components/ClusterHealthCard';
import { monitoringStatuses } from '../monitoringHelper';

describe('<ClusterHealthCard />', () => {
  it.each(Object.keys(monitoringStatuses))(
    'is accessible with health status %s',
    async (status) => {
      const { container } = render(<ClusterHealthCard healthStatus={monitoringStatuses[status]} />);
      await checkAccessibility(container);
    },
  );
});
