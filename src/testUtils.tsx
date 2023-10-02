import React from 'react';
import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { toHaveNoViolations, axe } from 'jest-axe';

import { createBrowserHistory } from 'history';
import { store } from './redux/store';
import { reduxReducers } from './redux/reducers';
import * as restrictedEnv from './restrictedEnv';

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
  return { ...render(ui, { wrapper: Wrapper, ...options }), user: userEvent.setup() };
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Type not exported in the library
export type UserEventType = {
  type: (
    field: HTMLElement,
    typeValue: string,
    { initialSelectionStart }: { initialSelectionStart: number },
  ) => void;
  clear: (field: HTMLElement) => void;
};

export { renderWithState as render };

/* ***** Items outside of React Test Library ************ */
expect.extend(toHaveNoViolations);

export const checkAccessibility = async (container: HTMLElement | string) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

export const insightsMock = () => {
  global.insights = {
    chrome: {
      ...global.insights.chrome,
      on: () => () => {},
      appNavClick: () => {},
      auth: {
        getUser: () => Promise.resolve({ data: {} }),
        getToken: () => Promise.resolve(),
        getOfflineToken: () => Promise.resolve({ data: { refresh_token: 'hello' } }),
      },
    },
  };
};

export const mockRestrictedEnv = () => {
  const mock = jest.spyOn(restrictedEnv, 'isRestrictedEnv');
  mock.mockReturnValue(false);
  return mock;
};
