import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { reduxReducers } from './reducers';
import sentryMiddleware from './sentryMiddleware';

const defaultOptions = {
  dispatchDefaultFailure: false, // automatic error notifications
};

const history = createBrowserHistory();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * We use redux-persist to save the "form" store to local storage when the ROSA
 * "Associate AWS Account" modal is opened since it will cause a window reload,
 * and we want to preserve already entered data
 */
const restoreStateOnTokenReload = createTransform(
  // gets called right before state is persisted
  (inboundState) => ({ ...inboundState }),
  // gets called right before state is rehydrated
  (outboundState) => {
    const tokenReload = window.localStorage.getItem('token-reload') === 'true';
    clearFormDataFromPersistor();
    return tokenReload ? outboundState : {};
  },
  // define which reducers this transform gets called for.
  { whitelist: ['form'] },
);

const persistReducerConfig = {
  key: 'form',
  storage,
  whitelist: ['form'],
  transforms: [restoreStateOnTokenReload],
};

const persistedReducer = persistReducer(persistReducerConfig, reduxReducers(history));

const store = createStore(
  persistedReducer,
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

const persistor = persistStore(store);

const clearFormDataFromPersistor = () => window.localStorage.removeItem('persist:form');

export { store as default, store, history, persistor, clearFormDataFromPersistor };
