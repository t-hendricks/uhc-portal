import React from 'react';
import { render, axe, screen } from '@testUtils';
import { MemoryRouter } from 'react-router-dom';
import * as hooks from '~/hooks/useFeatureGate';
import { HCP_ROSA_GETTING_STARTED_PAGE } from '~/redux/constants/featureConstants';
import CreateRosaGetStarted from './CreateRosaGetStarted';

global.insights = {
  chrome: {
    on: () => () => {},
    appNavClick: () => {},
    auth: {
      getOfflineToken: () => Promise.resolve({ data: { refresh_token: 'hello' } }),
    },
  },
};

const hypershiftMessage =
  /For now, you can only create ROSA with Hosted Control Plane \(HCP\) clusters using the CLI/;

describe('<CreateRosaGetStarted />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <CreateRosaGetStarted />
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
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
