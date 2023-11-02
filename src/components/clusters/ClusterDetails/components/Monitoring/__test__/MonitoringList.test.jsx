import React from 'react';
import { render, checkAccessibility } from '~/testUtils';

import MonitoringList from '../components/MonitoringList';

describe('<MonitoringList />', () => {
  it('is accessible', async () => {
    const { container } = render(<MonitoringList />);
    await checkAccessibility(container);
  });
});
