/* Sentry middleware for redux, adds "breadcrumbs" logging the redux events in case of an error */

import * as Sentry from '@sentry/browser';

const sentryMiddleware = () => (next) => (action) => {
  // for some actions, we want to keep some of the parameters in the breadcrumb
  let data = {};
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      data.location = action.payload.location;
      break;
    case '@@redux-form/DESTROY':
      data.form = action.meta.form;
      break;
    case 'OPEN_MODAL':
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
