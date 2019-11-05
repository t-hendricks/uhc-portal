import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
} from '@patternfly/react-core';

const TokenErrorAlert = ({ token }) => {
  const code = token.internalErrorCode || '';
  const errorMessage = token.errorMessage || '';
  const message = code === 'ACCT-MGMT-22' ? errorMessage : (
    <React.Fragment>
      {errorMessage}
      <br />
      <br />
      Try again by refreshing the page.
      If the problem persists, report the issue to
      {' '}
      <a href="mailto:ocm-feedback@redhat.com" target="_blank">
        ocm-feedback@redhat.com
        {' '}
        <span className="fa fa-external-link" aria-hidden="true" />
      </a>
      .
    </React.Fragment>
  );

  return (
    <Alert
      variant="danger"
      isInline
      className="token-error-alert"
      title="Failed to obtain authorization token"
    >
      {message}
    </Alert>
  );
};
TokenErrorAlert.propTypes = {
  token: PropTypes.object.isRequired,
};

export default TokenErrorAlert;
