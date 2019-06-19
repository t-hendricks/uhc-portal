import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';

function GlobalErrorBox({ errorTitle, errorMessage, clearGlobalError }) {
  if (errorMessage || errorTitle) {
    return (
      <Alert
        variant="danger"
        isInline
        title={errorTitle}
        action={<AlertActionCloseButton onClose={clearGlobalError} />}
      >
        {errorMessage}
      </Alert>
    );
  }
  return null;
}

GlobalErrorBox.propTypes = {
  errorTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  clearGlobalError: PropTypes.func.isRequired,
};

export default GlobalErrorBox;
