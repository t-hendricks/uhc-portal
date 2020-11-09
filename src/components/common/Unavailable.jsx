import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState, EmptyStateBody, ExpandableSection, Title,
} from '@patternfly/react-core';
import { Unavailable as FcUnavailable } from '@redhat-cloud-services/frontend-components';
import * as Sentry from '@sentry/browser';
import { formatErrorDetails } from '../../common/errors';
import './Unavailable.scss';

class Unavailable extends React.Component {
  componentDidMount() {
    const { response } = this.props;
    Sentry.withScope((scope) => {
      scope.setTag('operationID', response.operationID);
      Sentry.captureException(new Error(`${response.errorCode} error from server: ${response.internalErrorCode} - ${response.errorMessage}`));
    });
  }

  render() {
    const { message = '', response } = this.props;
    return (
      <EmptyState>
        <EmptyStateBody>
          <FcUnavailable />
          <ExpandableSection
            id="error-expand"
            toggleText="Error details"
          >
            { message && (<Title headingLevel="h6">{message}</Title>) }
            <span>{`Error code: ${response.errorCode}`}</span>
            <span>{response.errorMessage}</span>
            { formatErrorDetails(response.errorDetails) }
            <br />
            <span>{`Operation ID: ${response.operationID || 'N/A'}`}</span>
          </ExpandableSection>
        </EmptyStateBody>
      </EmptyState>
    );
  }
}

Unavailable.propTypes = {
  message: PropTypes.string,
  response: PropTypes.shape({
    errorMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.element,
    ]).isRequired,
    internalErrorCode: PropTypes.number,
    errorDetails: PropTypes.array,
    operationID: PropTypes.string,
    errorCode: PropTypes.number,
  }),
};

export default Unavailable;
