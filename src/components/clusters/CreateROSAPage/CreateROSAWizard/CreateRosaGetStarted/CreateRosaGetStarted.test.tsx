import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Provider } from 'react-redux';

import { store } from '../../../../../redux/store';
import CreateRosaGetStarted from './CreateRosaGetStarted';

expect.extend(toHaveNoViolations);

global.insights = {
  chrome: {
    on: () => () => {},
    appNavClick: () => {},
    auth: {
      getOfflineToken: () => Promise.resolve({ data: { refresh_token: 'hello' } }),
    },
  },
};

describe('CreateRosaGetStarted', () => {
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <CreateRosaGetStarted />
        </Provider>
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <CreateRosaGetStarted />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
