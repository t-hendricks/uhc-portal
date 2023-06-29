import React from 'react';
import { render, checkAccessibility, insightsMock, screen } from '@testUtils';
import { MemoryRouter } from 'react-router-dom';
import * as hooks from '~/hooks/useFeatureGate';
import { HCP_ROSA_GETTING_STARTED_PAGE } from '~/redux/constants/featureConstants';
import CreateRosaGetStarted from './CreateRosaGetStarted';

insightsMock();

const hypershiftMessage =
  /For now, you can only create ROSA with Hosted Control Plane clusters using the CLI/;

describe('<CreateRosaGetStarted />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <CreateRosaGetStarted />
      </MemoryRouter>,
    );

    await checkAccessibility(container);
  });

  it('shows hypershift info alert if feature flag is enabled', () => {
    // Arrange
    jest
      .spyOn(hooks, 'useFeatureGate')
      .mockImplementation((feature) => feature === HCP_ROSA_GETTING_STARTED_PAGE);

    render(
      <MemoryRouter>
        <CreateRosaGetStarted />
      </MemoryRouter>,
    );
    // Assert
    // There is no natural role for this message
    expect(screen.getByText(hypershiftMessage)).toBeInTheDocument();
  });

  it('hides hypershift info alert if feature flag is not enabled', () => {
    // Arrange
    jest
      .spyOn(hooks, 'useFeatureGate')
      .mockImplementation((feature) => feature !== HCP_ROSA_GETTING_STARTED_PAGE);

    render(
      <MemoryRouter>
        <CreateRosaGetStarted />
      </MemoryRouter>,
    );
    // Assert
    // There is no natural role for this message
    expect(screen.queryByText(hypershiftMessage)).not.toBeInTheDocument();
  });
});
