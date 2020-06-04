import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';

import { reduxReducers } from './reducers';
import sentryMiddleware from './sentryMiddleware';

const defaultOptions = {
  dispatchDefaultFailure: false, // automatic error notifications
};

const history = createBrowserHistory();
// eslint-disable-next-line no-underscore-dangle
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(reduxReducers),
  composeEnhancer(applyMiddleware(routerMiddleware(history), thunkMiddleware, promiseMiddleware,
    notificationsMiddleware({ ...defaultOptions }),
    sentryMiddleware)),
);

const reloadReducers = () => {
  store.replaceReducer(connectRouter(history)(reduxReducers));
};

export {
  store as default, store, reloadReducers, history,
};
