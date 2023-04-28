import React from 'react';
import { render, axe, screen, fireEvent } from '@testUtils';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CreateClusterDropDown from './CreateClusterDropDown';

const getStartedPath = '/create/rosa/getstarted';

describe('<CreateClusterDropDown />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <CreateClusterDropDown />
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is accessible expanded', async () => {
    const { container } = render(
      <MemoryRouter>
        <CreateClusterDropDown />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Create cluster' }));
    expect(screen.getByText(/With CLI/)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('CLI option goes to getting started page', () => {
    // Arrange
    const history = createMemoryHistory();

    render(
      // @ts-ignore
      <Router history={history}>
        <CreateClusterDropDown />
      </Router>,
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Create cluster' }));
    fireEvent.click(screen.getByText(/With CLI/));

    // Assert
    expect(history.location.pathname).toBe(getStartedPath);
  });

  it('Prerequisites link goes to getting started page', () => {
    // Arrange
    const history = createMemoryHistory();

    render(
      // @ts-ignore
      <Router history={history}>
        <CreateClusterDropDown />
      </Router>,
    );

    // Act
    fireEvent.click(screen.getByRole('link', { name: 'Prerequisites' }));

    // Assert
    expect(history.location.pathname).toBe(getStartedPath);
  });
});
