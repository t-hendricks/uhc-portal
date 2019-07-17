import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
} from '@patternfly/react-core';

const TokenErrorAlert = ({ token }) => {
  const title = (
    <React.Fragment>
      Failed to obtain authorization token:
      {' '}
      {token.error.message}
      <br />
      <br />
      Please try again by refreshing the page.
      If the problem persists, please report the issue to
      {' '}
      <a href="mailto:***REMOVED***" target="_blank">
        ***REMOVED***
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
      title={title}
    />
  );
};
TokenErrorAlert.propTypes = {
  token: PropTypes.object.isRequired,
};

export default TokenErrorAlert;
