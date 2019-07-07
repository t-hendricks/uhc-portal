import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
} from 'patternfly-react';
import { Tooltip } from '@patternfly/react-core';


const ErrorTriangle = ({ errorMessage }) => (
  <Tooltip content={`An error occured when fetching clusters: ${errorMessage}`}>
    <Icon type="pf" className="fa-2x clusterlist-error-triangle" name="warning-triangle-o" />
  </Tooltip>
);
ErrorTriangle.propTypes = {
  errorMessage: PropTypes.string,
};

export default ErrorTriangle;
