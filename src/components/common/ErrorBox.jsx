import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@patternfly/react-core';

function parseErrorDetails(errorDetails) {
  const customErrors = [];

  if (!errorDetails || !errorDetails.length) {
    return customErrors;
  }

  errorDetails.forEach((details) => {
    switch (details.kind) {
      case 'ExcessResources': {
        // Resource map: singular and plural
        const resourceMap = {
          'cluster.aws': ['cluster', 'clusters'],
          'compute.node.aws': ['node', 'nodes'],
          'pv.storage.aws': ['GB of storage', 'GB of storage'],
        };

        // Add extra error details
        customErrors.push((
          <ul>
            { details.items.map(excessResource => (
              <li>
                { `${excessResource.count} additional
                 ${resourceMap[excessResource.resource_type][excessResource.count === 1 ? 0 : 1]} of type
                 ${excessResource.availability_zone_type} availability zone, instance size
                 ${excessResource.resource_name}, and Red Hat provided infrastructure.`
                }
              </li>
            ))
            }
          </ul>
        ));
        break;
      }
      default:
        break;
    }
  });

  return customErrors;
}

function ErrorBox({ message, response }) {
  const errorDetails = parseErrorDetails(response.errorDetails);
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
    operationID: PropTypes.string,
  }),
};

export default ErrorBox;
