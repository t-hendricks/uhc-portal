/* Sentry middleware for redux, adds "breadcrumbs" logging the redux events in case of an error */

import { addBreadcrumb, Breadcrumb } from '@sentry/browser';
import { LOCATION_CHANGE } from 'connected-react-router';
import type { AnyAction, Middleware } from 'redux';
import { actionTypes } from 'redux-form';
import { OPEN_MODAL } from '~/components/common/Modal/ModalConstants';

const sentryMiddleware: Middleware = () => (next) => (action: AnyAction) => {
  // for some actions, we want to keep some of the parameters in the breadcrumb
  let data: Breadcrumb['data'] = {};
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
  addBreadcrumb({
    category: 'redux',
    message: `Dispatching ${action.type}`,
    data,
    level: 'info',
  });
  return next(action);
};

export default sentryMiddleware;
