import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { TERMS_REQUIRED_CODE, hasOwnErrorPage } from '../../../common/errors';
import apiErrorInterceptor from './ApiErrorInterceptor';
import TermsError from '../../common/TermsError';

class ApiError extends Component {
  componentDidMount() {
    const { history, apiRequest, showApiError, clearApiError } = this.props;
    // intercept api response and set the apiError state for watched errors
    this.ejectApiErrorInterceptor = apiErrorInterceptor(apiRequest, showApiError);
    // when user navigates away, clear any apiError state.
    this.detachHistoryListener = history.listen(() => clearApiError());
  }

  componentWillUnmount() {
    this.ejectApiErrorInterceptor();
    this.detachHistoryListener();
  }

  render() {
    const { children, apiError, clearApiError } = this.props;
    // watch only errors that have their own error pages
    if (hasOwnErrorPage(apiError)) {
      const internalErrorCode = get(apiError, 'data.code');
      if (internalErrorCode === TERMS_REQUIRED_CODE) {
        return <TermsError error={apiError} restore={clearApiError} />;
      }
      // eslint-disable-next-line no-console
      console.error(`no defined error page: code=${internalErrorCode}`);
    }

    return children;
  }
}

ApiError.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  history: PropTypes.shape({
    listen: PropTypes.func.isRequired,
  }).isRequired,
  apiRequest: PropTypes.func.isRequired,
  apiError: PropTypes.object,
  showApiError: PropTypes.func.isRequired,
  clearApiError: PropTypes.func.isRequired,
};

export default ApiError;
