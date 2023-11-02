import React from 'react';
import { render, checkAccessibility } from '~/testUtils';

import ClusterOperators from '../components/ClusterOperators';

describe('<ClusterOperators />', () => {
  it('is accessible', async () => {
    const { container } = render(<ClusterOperators />);
    await checkAccessibility(container);
  });
});
