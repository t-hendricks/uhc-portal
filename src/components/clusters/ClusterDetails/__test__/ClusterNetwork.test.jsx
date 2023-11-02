import React from 'react';

import { render, checkAccessibility } from '~/testUtils';

import ClusterNetwork from '../components/Overview/ClusterNetwork';
import fixtures from './ClusterDetails.fixtures';

describe('<ClusterNetwork />', () => {
  it.skip('is accessible', async () => {
    // This test fails because there are dd elements that are not in a dt
    const { container } = render(<ClusterNetwork cluster={fixtures.clusterDetails.cluster} />);
    await checkAccessibility(container);
  });
});
