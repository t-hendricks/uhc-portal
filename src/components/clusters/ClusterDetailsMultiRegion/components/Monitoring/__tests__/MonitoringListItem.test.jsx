import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import MonitoringListItem from '../components/MonitoringListItem';

import { mockOCPActiveClusterDetails } from './Monitoring.fixtures';

describe('<MonitoringListItem />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <ul>
        <MonitoringListItem title="myTitle" cluster={mockOCPActiveClusterDetails} />
      </ul>,
    );
    await checkAccessibility(container);
  });
});
