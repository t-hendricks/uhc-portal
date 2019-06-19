import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'patternfly-react';

function GlobalErrorBox({ errorMessage, clearGlobalError }) {
  if (errorMessage) {
    return (
      <Alert className="global-error-box" onDismiss={clearGlobalError}>
        {errorMessage}
      </Alert>
    );
  }
  return null;
}

GlobalErrorBox.propTypes = {
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  clearGlobalError: PropTypes.func.isRequired,
};

export default GlobalErrorBox;
