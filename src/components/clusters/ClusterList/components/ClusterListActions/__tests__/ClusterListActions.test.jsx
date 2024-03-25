import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';
import ClusterListActions from '../ClusterListActions';

jest.mock('~/redux/hooks/useGlobalState', () => ({
  useGlobalState: () => {},
}));

describe('<ClusterListActions />', () => {
  it('is accessible ', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListActions />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('button', { name: 'Create cluster' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
