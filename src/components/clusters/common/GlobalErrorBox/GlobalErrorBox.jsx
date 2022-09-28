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
        actionClose={<AlertActionCloseButton onClose={clearGlobalError} />}
      >
        {errorMessage}
      </Alert>
    );
  }
  return null;
}

GlobalErrorBox.propTypes = {
  errorTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
  clearGlobalError: PropTypes.func.isRequired,
};

export default GlobalErrorBox;
