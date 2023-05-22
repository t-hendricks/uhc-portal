import React from 'react';
import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';

import { toHaveNoViolations } from 'jest-axe';

import { createBrowserHistory } from 'history';
import { store } from './redux/store';
import { reduxReducers } from './redux/reducers';

const history = createBrowserHistory();

export const TestWrapper = ({
  children,
  initialStore,
}: {
  children: React.ReactNode;
  initialStore?: Store;
}) => <Provider store={initialStore || store}>{children}</Provider>;

const renderWithState = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
  initialState?: any, // setting to any because only a partial state structure may be sent
) => {
  const newStore = initialState ? createStore(reduxReducers(history), initialState) : store;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestWrapper initialStore={newStore}>{children}</TestWrapper>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { renderWithState as render };

/* ***** Items outside of React Test Library ************ */
expect.extend(toHaveNoViolations);
export { axe } from 'jest-axe'; // Accessibility testing

export const insightsMock = () => {
  global.insights = {
    chrome: {
      auth: {
        getUser: () => {},
        getToken: () => {},
      },
    },
  };
};
