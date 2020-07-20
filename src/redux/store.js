import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';

import { reduxReducers } from './reducers';
import sentryMiddleware from './sentryMiddleware';

const defaultOptions = {
  dispatchDefaultFailure: false, // automatic error notifications
};

const history = createBrowserHistory();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reduxReducers(history),
  composeEnhancer(applyMiddleware(routerMiddleware(history), thunkMiddleware, promiseMiddleware,
    notificationsMiddleware({ ...defaultOptions }),
    sentryMiddleware)),
);

export {
  store as default, store, history,
};
