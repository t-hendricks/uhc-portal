import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@patternfly/react-core';

function ErrorBox({ message, response }) {
  return (
    <Alert variant="danger" isInline title={message} className="error-box">
      <span>{response.errorMessage}</span>
      <br />
      <span>{`Operation ID: ${response.operationID || 'N/A'}`}</span>
    </Alert>
  );
}

ErrorBox.propTypes = {
  message: PropTypes.string.isRequired,
  response: PropTypes.shape({
    errorMessage: PropTypes.string.isRequired,
    operationID: PropTypes.string,
  }),
};

export default ErrorBox;
