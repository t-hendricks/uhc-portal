import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { reduxReducers } from './reducers';
import sentryMiddleware from './sentryMiddleware';

const defaultOptions = {
  dispatchDefaultFailure: false, // automatic error notifications
};

const history = createBrowserHistory();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['form'],
};

const persistedReducer = persistReducer(persistConfig, reduxReducers(history));

const store = createStore(
  persistedReducer,
  composeEnhancer(applyMiddleware(routerMiddleware(history), thunkMiddleware, promiseMiddleware,
    notificationsMiddleware({ ...defaultOptions }),
    sentryMiddleware)),
);

const persistor = persistStore(store, {
  manualPersist: true,
});

export {
  store as default, store, history, persistor,
};
