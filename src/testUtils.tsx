import React from 'react';
import { Provider } from 'react-redux';
import { AnyAction, createStore } from 'redux';
import { act, render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { toHaveNoViolations, axe } from 'jest-axe';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import * as featureGates from '~/hooks/useFeatureGate';
import { createBrowserHistory } from 'history';

import { GlobalState, store as globalStore } from './redux/store';
import { reduxReducers } from './redux/reducers';
import * as restrictedEnv from './restrictedEnv';

// Type not exported in the library
export type UserEventType = ReturnType<typeof userEvent.setup>;

// An extended version of RTL's "custom render()" pattern.

const history = createBrowserHistory();
const reducer = reduxReducers(history);

interface TestState {
  store: typeof globalStore;
  /** Wrapper can be used as component independently of render(), notably for Enzyme. */
  Wrapper: (props: { children: React.ReactNode }) => React.ReactNode;
  /** Convenience accessor to redux state. */
  getState: () => GlobalState;
  /** Convenience alias to store.dispatch, wrapped with act() to trigger all re-renders. */
  dispatch: (action: AnyAction) => any;
  render: (
    ui: React.ReactElement,
    options?: RenderOptions,
  ) => ReturnType<typeof render> & { user: UserEventType };
}

/** Construct a local redux store + test helpers for it.
 * A simple use is `{ container } = withState(initialState).render(...);`
 * but can save `testState = withState(initialState);` and reuse it later.
 *
 * Helpers are closures, no need to call as methods, safe to destructure e.g.:
 * `const { render, dispatch } = withState(initialState);`
 *
 * Accepts any subset of state, rest gets filled by reducers initial values.
 * If not passed a state, uses the global `store` and tries to block dispatch().
 */
const withState = (initialState?: any): TestState => {
  // This could be a class with bound methods but didn't want to require `new withState()`,
  // and old-school constructor function got too annoying to TypeScript, so plain Object it is.

  const store = initialState ? createStore(reducer, initialState) : globalStore;
  // TODO: should we enable promiseMiddleware, thunkMiddleware on these stores?

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    Wrapper,

    // Our `GlobalState` type is slightly more precise.
    getState: () => store.getState() as unknown as GlobalState,

    dispatch: (action: AnyAction) => {
      if (store === globalStore) {
        throw new Error(
          'Tests must not dispatch() on global `store`; use `withState(initialState)` to create a local store.',
        );
      }
      act(() => {
        store.dispatch(action);
      });
    },

    render: (ui: React.ReactElement, options?: RenderOptions) => ({
      ...render(ui, { wrapper: Wrapper, ...options }),
      user: userEvent.setup({ delay: null }),
    }),
  };
};

/**
 * Similar to testing-library's render() but provides a redux store.
 * @param initialState - if given, initialize redux with these values.
 */
const renderWithState = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
  initialState?: any, // setting to any because only a partial state structure may be sent
) => withState(initialState).render(ui, options);

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export { withState, renderWithState as render };

/* ***** Items outside of React Test Library ************ */
expect.extend(toHaveNoViolations);

export const checkAccessibility = async (container: HTMLElement | string) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

const stubbedChrome = {
  ...global.insights.chrome,
  on: () => () => {},
  appNavClick: () => {},
  auth: {
    getUser: () => Promise.resolve({ data: {} }),
    getToken: () => Promise.resolve(),
    getOfflineToken: () => Promise.resolve({ data: { refresh_token: 'hello' } }),
  },
  getEnvironment: () => 'prod',
};

export const insightsMock = () => {
  global.insights = {
    chrome: {
      ...stubbedChrome,
    },
  };
};

export const mockRestrictedEnv = () => {
  const mock = jest.spyOn(restrictedEnv, 'isRestrictedEnv');
  mock.mockReturnValue(false);
  return mock;
};

export const mockRefreshToken = () => {
  const mock = jest.spyOn(restrictedEnv, 'getRefreshToken');
  mock.mockImplementationOnce((): Promise<any> => Promise.resolve('mock-refresh-token'));
  return mock;
};

export const mockUseChrome = () => {
  const useChromeMock = useChrome as jest.Mock;
  useChromeMock.mockReturnValue(stubbedChrome);
};

export const TestRouter = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

// Mocking Feature Gates
export type MockedGate = [string, boolean];

export const mockUseFeatureGate = (mockedGates: MockedGate[]) => {
  jest.spyOn(featureGates, 'useFeatureGate').mockImplementation((feature) => {
    const gateToMock = mockedGates.find((gate) => gate[0] === feature);
    return gateToMock ? gateToMock[1] : false;
  });
};
