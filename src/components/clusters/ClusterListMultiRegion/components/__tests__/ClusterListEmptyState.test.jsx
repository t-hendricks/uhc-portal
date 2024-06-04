import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import ClusterListEmptyState from '../ClusterListEmptyState';

describe('<ClusterListEmptyState />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListEmptyState />
        </CompatRouter>
      </TestRouter>,
    );
    expect(
      screen.getByText(
        "You don't have any clusters yet, but you can easily create or register your first OpenShift 4 cluster.",
        { exact: false },
      ),
    );
    await checkAccessibility(container);
  });
});
