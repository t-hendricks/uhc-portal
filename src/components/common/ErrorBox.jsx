import React from 'react';
import PropTypes from 'prop-types';
import { Alert, ExpandableSection } from '@patternfly/react-core';
import { formatErrorDetails } from '../../common/errors';

function ErrorBox({
  message, response, variant = 'danger', isExpandable,
}) {
  const errorDetails = formatErrorDetails(response.errorDetails);
  const detailsDisplay = (
    <>
      <span>{response.errorMessage}</span>
      { errorDetails }
      <br />
      <span>{`Operation ID: ${response.operationID || 'N/A'}`}</span>
    </>
  );
  return (
    <Alert variant={variant} isInline title={message} className="error-box">
      {isExpandable ? (
        <ExpandableSection toggleText="Error details">
          {detailsDisplay}
        </ExpandableSection>
      ) : detailsDisplay}
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
  variant: PropTypes.oneOf(['danger', 'warning']),
  isExpandable: PropTypes.bool,
};

export default ErrorBox;
