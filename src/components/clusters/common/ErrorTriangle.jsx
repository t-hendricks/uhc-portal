import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_warning_color_100 } from '@patternfly/react-tokens';
import { Tooltip } from '@patternfly/react-core';

const ErrorTriangle = ({ item = 'clusters', errorMessage }) => (
  <Tooltip content={`An error occurred when fetching ${item}: ${errorMessage}`}>
    <ExclamationTriangleIcon
      size="lg"
      className="cluster-error-triangle"
      color={global_warning_color_100.value}
    />
  </Tooltip>
);
ErrorTriangle.propTypes = {
  item: PropTypes.string,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
};

export default ErrorTriangle;
