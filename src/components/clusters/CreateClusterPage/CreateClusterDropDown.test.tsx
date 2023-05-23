import React from 'react';
import { render, axe, screen, fireEvent } from '@testUtils';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CreateClusterDropDown from './CreateClusterDropDown';
import * as hooks from '~/hooks/useFeatureGate';
import { HCP_ROSA_GETTING_STARTED_PAGE } from '~/redux/constants/featureConstants';

const getStartedPath = '/create/rosa/getstarted';

describe('<CreateClusterDropDown />', () => {
  it('is accessible', async () => {
    // Arrange
    const { container } = render(
      <MemoryRouter>
        <CreateClusterDropDown />
      </MemoryRouter>,
    );

    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is accessible expanded', async () => {
    // Arrange
    const { container } = render(
      <MemoryRouter>
        <CreateClusterDropDown />
      </MemoryRouter>,
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Create cluster' }));
    expect(screen.getByText(/With CLI/)).toBeInTheDocument();

    // Assert
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

  it('shows hypershift helper text when feature flags are enabled', () => {
    // Arrange
    jest
      .spyOn(hooks, 'useFeatureGate')
      .mockImplementation((feature) => feature === HCP_ROSA_GETTING_STARTED_PAGE);

    render(
      <MemoryRouter>
        <CreateClusterDropDown />
      </MemoryRouter>,
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Create cluster' }));
    expect(screen.getByText(/With CLI/)).toBeInTheDocument();

    // Arrange
    expect(screen.getByText(/Supports ROSA with Hosted Control Plane/)).toBeInTheDocument();
    expect(screen.getByText(/ROSA with Hosted Control Plane coming soon/)).toBeInTheDocument();
  });

  it('hides hypershift helper text when feature flags are not enabled', () => {
    // Arrange
    jest
      .spyOn(hooks, 'useFeatureGate')
      .mockImplementation((feature) => feature !== HCP_ROSA_GETTING_STARTED_PAGE);

    render(
      <MemoryRouter>
        <CreateClusterDropDown />
      </MemoryRouter>,
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Create cluster' }));
    expect(screen.getByText(/With CLI/)).toBeInTheDocument();

    // Assert
    expect(screen.queryByText(/Supports ROSA with Hosted Control Plane/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/ROSA with Hosted Control Plane coming soon/),
    ).not.toBeInTheDocument();
  });
});
