import React from 'react';
import { render, checkAccessibility, insightsMock, screen } from '@testUtils';
import { MemoryRouter } from 'react-router-dom';
import * as hooks from '~/hooks/useFeatureGate';
import { HCP_ROSA_GETTING_STARTED_PAGE } from '~/redux/constants/featureConstants';
import CreateRosaGetStarted from './CreateRosaGetStarted';

insightsMock();

const hypershiftMessage =
  /For now, you can only create ROSA with Hosted Control Plane clusters using the CLI/;
const completeAWSMessage = /complete aws prerequisites/i;

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

  it('navigated to quick start from aws setup', () => {
    render(
      <MemoryRouter initialEntries={[{ search: '?source=aws' }]}>
        <CreateRosaGetStarted />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('button', { name: completeAWSMessage }).querySelector('svg.success'),
    ).toBeInTheDocument();
  });

  it('navigated to quick start from other site', () => {
    render(
      <MemoryRouter>
        <CreateRosaGetStarted />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('button', { name: completeAWSMessage }).querySelector('svg.warning'),
    ).toBeInTheDocument();
  });
});
