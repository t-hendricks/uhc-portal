import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon, Tooltip, OverlayTrigger,
} from 'patternfly-react';


const ErrorTriangle = ({ errorMessage }) => (
  <OverlayTrigger
    overlay={(
      <Tooltip id="cluster-list-error-tooltip">
        An error occured when fetching clusters:
        {' '}
        {errorMessage}
      </Tooltip>
    )}
    placement="top"
    trigger={['hover', 'focus']}
    rootClose={false}
  >
    <Icon type="pf" className="fa-2x clusterlist-error-triangle" name="warning-triangle-o" />
  </OverlayTrigger>
);
ErrorTriangle.propTypes = {
  errorMessage: PropTypes.string,
};

export default ErrorTriangle;
