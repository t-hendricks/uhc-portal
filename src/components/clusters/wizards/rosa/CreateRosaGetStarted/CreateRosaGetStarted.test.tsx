import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { checkAccessibility, mockUseChrome, render, screen, waitFor } from '~/testUtils';

import CreateRosaGetStarted from './CreateRosaGetStarted';

mockUseChrome();

const completeAWSMessage = /complete aws prerequisites/i;

describe('<CreateRosaGetStarted />', () => {
  afterAll(() => jest.resetAllMocks());
  it('is accessible', async () => {
    const { container } = render(<CreateRosaGetStarted />);
    await checkAccessibility(container);
  });

  it('navigated to quick start from aws setup', async () => {
    render(
      <MemoryRouter initialEntries={[{ search: '?source=aws' }]}>
        <CreateRosaGetStarted />
      </MemoryRouter>,
      { withRouter: false },
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: completeAWSMessage }).querySelector('svg.success'),
      ).toBeInTheDocument();
    });
  });

  it('navigated to quick start from other site', async () => {
    render(<CreateRosaGetStarted />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: completeAWSMessage }).querySelector('svg.warning'),
      ).toBeInTheDocument();
    });
  });
});
