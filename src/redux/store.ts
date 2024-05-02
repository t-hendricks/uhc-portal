import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import promiseMiddleware from 'redux-promise-middleware';

import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { configureStore, Middleware } from '@reduxjs/toolkit';

import promiseRejectionMiddleware from './promiseRejectionMiddleware';
import { reduxReducers } from './reducers';
import sentryMiddleware from './sentryMiddleware';

const defaultOptions = {
  dispatchDefaultFailure: false, // automatic error notifications
};
const history = createBrowserHistory();

// NOTE: in order to keep testing accurate
// if you change the store (see below)
// also make a change to src/testUtils.tsx
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: { warnAfter: 256 }, // We can also set immutableCheck to false to prevent checking (and warnings).  Note it is false in prod builds
    })
      .concat(routerMiddleware(history))
      .concat(promiseRejectionMiddleware as Middleware)
      .concat(promiseMiddleware)
      .concat(notificationsMiddleware({ ...defaultOptions }) as Middleware) // TODO: remove type convertion as soon as @redhat-cloud-services incorporates RTK
      .concat(sentryMiddleware as Middleware),
  reducer: reduxReducers(history),
});

export type GlobalState = Omit<ReturnType<typeof store.getState>, 'rosaReducer'> & {
  // TODO temporary overrides for reducers that aren't written in typescript
  rosaReducer: {
    getAWSBillingAccountsResponse: any;
    getAWSAccountIDsResponse: {
      data: any[];
      pending: boolean;
    };
    offlineToken?: string;
  };
};

export { history, store };
export default store;
