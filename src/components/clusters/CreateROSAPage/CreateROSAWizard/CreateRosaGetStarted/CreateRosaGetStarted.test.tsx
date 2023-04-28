import React from 'react';
import { render, axe } from '@testUtils';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from '../../../../../redux/store';
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

describe('<CreateRosaGetStarted />', () => {
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
});
