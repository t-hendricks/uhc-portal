import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import {
  render,
  checkAccessibility,
  mockUseChrome,
  screen,
  mockRestrictedEnv,
  mockUseFeatureGate,
} from '~/testUtils';
import { HCP_ROSA_GETTING_STARTED_PAGE } from '~/redux/constants/featureConstants';
import CreateRosaGetStarted from './CreateRosaGetStarted';

mockUseChrome();

const hypershiftMessage =
  /For now, you can only create ROSA with Hosted Control Plane clusters using the CLI/;
const completeAWSMessage = /complete aws prerequisites/i;

describe('<CreateRosaGetStarted />', () => {
  afterAll(() => jest.resetAllMocks());
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <CompatRouter>
          <CreateRosaGetStarted />
        </CompatRouter>
      </MemoryRouter>,
    );

    await checkAccessibility(container);
  });

  it('shows hypershift info alert if feature flag is enabled', () => {
    // Arrange
    mockUseFeatureGate([[HCP_ROSA_GETTING_STARTED_PAGE, true]]);

    render(
      <MemoryRouter>
        <CompatRouter>
          <CreateRosaGetStarted />
        </CompatRouter>
      </MemoryRouter>,
    );
    // Assert
    // There is no natural role for this message
    expect(screen.getByText(hypershiftMessage)).toBeInTheDocument();
  });

  it('hides hypershift info alert if feature flag is not enabled', () => {
    // Arrange
    mockUseFeatureGate([[HCP_ROSA_GETTING_STARTED_PAGE, false]]);

    render(
      <MemoryRouter>
        <CompatRouter>
          <CreateRosaGetStarted />
        </CompatRouter>
      </MemoryRouter>,
    );
    // Assert
    // There is no natural role for this message
    expect(screen.queryByText(hypershiftMessage)).not.toBeInTheDocument();
  });

  it('navigated to quick start from aws setup', () => {
    render(
      <MemoryRouter initialEntries={[{ search: '?source=aws' }]}>
        <CompatRouter>
          <CreateRosaGetStarted />
        </CompatRouter>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('button', { name: completeAWSMessage }).querySelector('svg.success'),
    ).toBeInTheDocument();
  });

  it('navigated to quick start from other site', () => {
    render(
      <MemoryRouter>
        <CompatRouter>
          <CreateRosaGetStarted />
        </CompatRouter>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('button', { name: completeAWSMessage }).querySelector('svg.warning'),
    ).toBeInTheDocument();
  });

  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('does not show HCP directions', () => {
      mockUseFeatureGate([[HCP_ROSA_GETTING_STARTED_PAGE, true]]);
      const { rerender } = render(
        <MemoryRouter>
          <CompatRouter>
            <CreateRosaGetStarted />
          </CompatRouter>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('hcp-directions')).toBeInTheDocument();

      isRestrictedEnv.mockReturnValue(true);
      rerender(
        <MemoryRouter>
          <CompatRouter>
            <CreateRosaGetStarted />
          </CompatRouter>
        </MemoryRouter>,
      );

      expect(screen.queryByTestId('hcp-directions')).not.toBeInTheDocument();
    });
  });
});
