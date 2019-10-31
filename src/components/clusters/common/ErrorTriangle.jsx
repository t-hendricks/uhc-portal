import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_warning_color_100 } from '@patternfly/react-tokens';
import { Tooltip } from '@patternfly/react-core';


const ErrorTriangle = ({ errorMessage }) => (
  <Tooltip content={`An error occured when fetching clusters: ${errorMessage}`}>
    <ExclamationTriangleIcon size="lg" className="cluster-error-triangle" color={global_warning_color_100.value} />
  </Tooltip>
);
ErrorTriangle.propTypes = {
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]),
};

export default ErrorTriangle;
