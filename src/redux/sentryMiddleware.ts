/* Sentry middleware for redux, adds "breadcrumbs" logging the redux events in case of an error */

import * as Sentry from '@sentry/browser';
import type { AnyAction, Middleware } from 'redux';
import { LOCATION_CHANGE } from 'connected-react-router';
import { actionTypes } from 'redux-form';
import { OPEN_MODAL } from '~/components/common/Modal/ModalConstants';

const sentryMiddleware: Middleware = () => (next) => (action: AnyAction) => {
  // for some actions, we want to keep some of the parameters in the breadcrumb
  let data: Sentry.Breadcrumb['data'] = {};
  switch (action.type) {
    case LOCATION_CHANGE:
      data.location = action.payload.location;
      break;
    case actionTypes.DESTROY:
      data.form = action.meta.form;
      break;
    case OPEN_MODAL:
      data.modalName = action.payload.name;
      break;
    default:
      data = undefined;
  }
  Sentry.addBreadcrumb({
    category: 'redux',
    message: `Dispatching ${action.type}`,
    data,
    level: Sentry.Severity.Info,
  });
  return next(action);
};

export default sentryMiddleware;
