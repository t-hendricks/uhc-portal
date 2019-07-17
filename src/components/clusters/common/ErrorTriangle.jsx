import React from 'react';
import PropTypes from 'prop-types';
import { WarningTriangleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_warning_color_100 } from '@patternfly/react-tokens';
import { Tooltip } from '@patternfly/react-core';


const ErrorTriangle = ({ errorMessage }) => (
  <Tooltip content={`An error occured when fetching clusters: ${errorMessage}`}>
    <WarningTriangleIcon size="lg" className="cluster-error-triangle" color={global_warning_color_100.value} />
  </Tooltip>
);
ErrorTriangle.propTypes = {
  errorMessage: PropTypes.string,
};

export default ErrorTriangle;
