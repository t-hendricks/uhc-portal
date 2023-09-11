/* Logs Promise rejections thrown from redux-promise-middleware */
// By design, redux-promise-middleware does not catch errors thrown by a rejected promise.
// This results in API errors being logged as uncaught in the console and causes Jest tests to fail
// See https://github.com/pburtchaell/redux-promise-middleware/blob/main/docs/guides/rejected-promises.md

import type { AnyAction, Middleware } from 'redux';
import isPromise from 'is-promise';

const promiseRejectionMiddleware: Middleware = () => (next) => (action: AnyAction) => {
  if (isPromise(action.payload)) {
    return next(action).catch(
      (err: unknown) =>
        // ignore error; redux-promise-middleware will dispatch the REJECTED action
        err,
    );
  }
  return next(action);
};

export default promiseRejectionMiddleware;
