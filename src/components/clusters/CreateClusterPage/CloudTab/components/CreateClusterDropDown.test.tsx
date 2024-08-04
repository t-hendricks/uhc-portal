import React from 'react';
import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen } from '~/testUtils';

import CreateClusterDropDown from './CreateClusterDropDown';

const getStartedPath = '/create/rosa/getstarted';
const rosaWizardPath = '/create/rosa/wizard';

describe('<CreateClusterDropDown />', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('is accessible', async () => {
    // Arrange
    const { container } = render(
      <MemoryRouter>
        <CompatRouter>
          <CreateClusterDropDown />
        </CompatRouter>
      </MemoryRouter>,
    );

    // Assert
    await checkAccessibility(container);
  });

  it('is accessible expanded', async () => {
    // Arrange
    const { container, user } = render(
      <MemoryRouter>
        <CompatRouter>
          <CreateClusterDropDown />
        </CompatRouter>
      </MemoryRouter>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Create cluster' }));
    expect(screen.getByText(/With CLI/)).toBeInTheDocument();

    // Assert
    await checkAccessibility(container);
  });

  it('With CLI option goes to getting started page', async () => {
    // Arrange
    const history = createMemoryHistory();

    const { user } = render(
      // @ts-ignore
      <Router history={history}>
        <CompatRouter>
          <CreateClusterDropDown />
        </CompatRouter>
      </Router>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Create cluster' }));
    await user.click(screen.getByText(/With CLI/));

    // Assert
    expect(history.location.pathname).toBe(getStartedPath);
  });

  it('With web interface option goes to ROSA Wizard', async () => {
    // Arrange
    const history = createMemoryHistory();

    const { user } = render(
      // @ts-ignore
      <Router history={history}>
        <CompatRouter>
          <CreateClusterDropDown />
        </CompatRouter>
      </Router>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Create cluster' }));
    await user.click(screen.getByText(/With web interface/));

    // Assert
    expect(history.location.pathname).toBe(rosaWizardPath);
  });

  it('Prerequisites link goes to getting started page', async () => {
    // Arrange
    const history = createMemoryHistory();

    const { user } = render(
      // @ts-ignore
      <Router history={history}>
        <CompatRouter>
          <CreateClusterDropDown />
        </CompatRouter>
      </Router>,
    );

    // Act
    await user.click(screen.getByRole('link', { name: 'Prerequisites' }));

    // Assert
    expect(history.location.pathname).toBe(getStartedPath);
  });
});
