import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'connected-react-router';
// TODO, Both 'history' & '@redhat-cloud-services' modules implicitly have an 'any' type.
// @ts-ignore
import { createBrowserHistory } from 'history';
// @ts-ignore
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

import { reduxReducers } from './reducers';
import sentryMiddleware from './sentryMiddleware';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const defaultOptions = {
  dispatchDefaultFailure: false, // automatic error notifications
};
const history = createBrowserHistory();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reduxReducers(history),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
      thunkMiddleware,
      promiseMiddleware,
      notificationsMiddleware({ ...defaultOptions }),
      sentryMiddleware,
    ),
  ),
);

export type GlobalState = Omit<ReturnType<typeof store.getState>, 'rosaReducer'> & {
  // TODO temporary overrides for reducers that aren't written in typescript
  rosaReducer: {
    getAWSAccountIDsResponse: {
      data: any[];
    };
    offlineToken?: string | Error;
  };
};

export { store as default, store, history };
