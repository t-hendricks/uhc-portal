import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@patternfly/react-core';
import helpers from '../../common/helpers';

function ErrorBox({ message, response }) {
  const errorDetails = helpers.parseErrorDetails(response.errorDetails);
  return (
    <Alert variant="danger" isInline title={message} className="error-box">
      <span>{response.errorMessage}</span>
      { errorDetails }
      <br />
      <span>{`Operation ID: ${response.operationID || 'N/A'}`}</span>
    </Alert>
  );
}

ErrorBox.propTypes = {
  message: PropTypes.string.isRequired,
  response: PropTypes.shape({
    errorMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.element,
    ]).isRequired,
    errorDetails: PropTypes.array,
    operationID: PropTypes.string,
  }),
};

export default ErrorBox;
