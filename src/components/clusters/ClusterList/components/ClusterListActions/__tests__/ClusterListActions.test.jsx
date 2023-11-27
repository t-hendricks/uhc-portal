import React from 'react';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';
import ClusterListActions from '../ClusterListActions';

jest.mock('~/redux/hooks/useGlobalState', () => ({
  useGlobalState: () => {},
}));

describe('<ClusterListActions />', () => {
  it('is accessible ', async () => {
    const { container } = render(
      <TestRouter>
        <ClusterListActions />
      </TestRouter>,
    );

    expect(screen.getByRole('button', { name: 'Create cluster' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
