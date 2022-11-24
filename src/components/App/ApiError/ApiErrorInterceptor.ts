import get from 'lodash/get';

import { hasOwnErrorPage } from '../../../common/errors';

const apiErrorInterceptor = (apiRequest, showApiError) => {
  const interceptorID = apiRequest.interceptors.response.use(
    (response) => response,
    (error) => {
      // watch only errors that have their own error pages
      if (hasOwnErrorPage(get(error, 'response'))) {
        // show the error page and hanle error there
        showApiError(error.response);
      }
      return Promise.reject(error);
    },
  );
  // return the handle to eject this interceptor
  return () => {
    apiRequest.interceptors.response.eject(interceptorID);
  };
};

export default apiErrorInterceptor;
