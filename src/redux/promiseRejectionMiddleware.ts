/* Logs Promise rejections thrown from redux-promise-middleware */
// By design, redux-promise-middleware does not catch errors thrown by a rejected promise.
// This results in API errors being logged as uncaught in the console and causes Jest tests to fail
// See https://github.com/pburtchaell/redux-promise-middleware/blob/main/docs/guides/rejected-promises.md

import isPromise from 'is-promise';
import { Dispatch, UnknownAction } from 'redux';

const promiseRejectionMiddleware =
  () =>
  (next: Dispatch<UnknownAction>) =>
  <A extends UnknownAction>(action: A) =>
    isPromise(action.payload)
      ? next(action as any).catch(
          (err: unknown) =>
            // ignore error; redux-promise-middleware will dispatch the REJECTED action
            err,
        )
      : next(action);

export default promiseRejectionMiddleware;
