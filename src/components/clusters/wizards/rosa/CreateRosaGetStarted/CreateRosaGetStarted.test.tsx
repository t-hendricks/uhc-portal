import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, mockUseChrome, render, screen, waitFor } from '~/testUtils';

import CreateRosaGetStarted from './CreateRosaGetStarted';

mockUseChrome();

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

  it('navigated to quick start from aws setup', async () => {
    render(
      <MemoryRouter initialEntries={[{ search: '?source=aws' }]}>
        <CompatRouter>
          <CreateRosaGetStarted />
        </CompatRouter>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: completeAWSMessage }).querySelector('svg.success'),
      ).toBeInTheDocument();
    });
  });

  it('navigated to quick start from other site', async () => {
    render(
      <MemoryRouter>
        <CompatRouter>
          <CreateRosaGetStarted />
        </CompatRouter>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: completeAWSMessage }).querySelector('svg.warning'),
      ).toBeInTheDocument();
    });
  });
});
