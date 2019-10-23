import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
} from '@patternfly/react-core';
import get from 'lodash/get';

const TokenErrorAlert = ({ token }) => {
  const code = get(token, 'error.code', '');
  const message = get(token, 'error.message', '');
  const title = code === 'ACCT-MGMT-22' ? message : (
    <React.Fragment>
      Failed to obtain authorization token:
      {' '}
      {message}
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
      title={title}
    />
  );
};
TokenErrorAlert.propTypes = {
  token: PropTypes.object.isRequired,
};

export default TokenErrorAlert;
