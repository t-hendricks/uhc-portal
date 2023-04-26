import React from 'react';
import { AxiosResponse, AxiosInstance } from 'axios';
import { useHistory } from 'react-router-dom';
import { TERMS_REQUIRED_CODE, hasOwnErrorPage, getInternalErrorCode } from '../../../common/errors';
import apiErrorInterceptor from './ApiErrorInterceptor';
import TermsError from '../../common/TermsGuard/TermsError';

type Props = {
  children: React.ReactElement;
  apiRequest: AxiosInstance;
  apiError?: AxiosResponse | null;
  showApiError: (error: AxiosResponse) => void;
  clearApiError: () => void;
};

const ApiError = ({ apiRequest, showApiError, children, apiError, clearApiError }: Props) => {
  const history = useHistory();
  React.useEffect(() => {
    const ejectApiErrorInterceptor = apiErrorInterceptor(apiRequest, showApiError);
    // when user navigates away, clear any apiError state.
    const detachHistoryListener = history.listen(() => clearApiError());
    return () => {
      ejectApiErrorInterceptor();
      detachHistoryListener();
    };
  }, [apiRequest, clearApiError, history]);

  // watch only errors that have their own error pages
  if (apiError && hasOwnErrorPage(apiError)) {
    const internalErrorCode = getInternalErrorCode(apiError);
    if (internalErrorCode === TERMS_REQUIRED_CODE) {
      return <TermsError error={apiError} restore={clearApiError} />;
    }
    // eslint-disable-next-line no-console
    console.error(`no defined error page: code=${internalErrorCode}`);
  }

  return children;
};

export default ApiError;
