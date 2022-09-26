import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateBody,
  ExpandableSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { Unavailable as FcUnavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import * as Sentry from '@sentry/browser';
import { formatErrorDetails } from '../../common/errors';
import './Unavailable.scss';

class Unavailable extends React.Component {
  componentDidMount() {
    const reportToSentry = (r) => {
      Sentry.withScope((scope) => {
        scope.setTag('operationID', r.operationID);
        Sentry.captureException(
          new Error(`${r.errorCode} error from server: ${r.internalErrorCode} - ${r.errorMessage}`),
        );
      });
    };
    const { errors } = this.props;
    if (errors) {
      errors.forEach((error) => {
        const { response } = error;
        reportToSentry(response);
      });
    } else {
      const { response } = this.props;
      reportToSentry(response);
    }
  }

  render() {
    const { errors, message, response } = this.props;
    const errorDetails = ({ response: r, message: m, key = '' }) => (
      <StackItem key={key}>
        <Stack>
          {m && (
            <StackItem>
              <Title headingLevel="h6">{m}</Title>
            </StackItem>
          )}
          <StackItem>{`Error code: ${r.errorCode}`}</StackItem>
          <StackItem>{r.errorMessage}</StackItem>
          <StackItem>{formatErrorDetails(r.errorDetails)}</StackItem>
          <StackItem>{`Operation ID: ${r.operationID || 'N/A'}`}</StackItem>
        </Stack>
      </StackItem>
    );
    return (
      <EmptyState>
        <EmptyStateBody>
          <FcUnavailable />
          <ExpandableSection id="error-expand" toggleText="Error details">
            <Stack hasGutter>
              {errors ? errors.map(errorDetails) : errorDetails({ response, message })}
            </Stack>
          </ExpandableSection>
        </EmptyStateBody>
      </EmptyState>
    );
  }
}

Unavailable.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      message: PropTypes.string,
      response: PropTypes.shape({
        errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element])
          .isRequired,
        internalErrorCode: PropTypes.string,
        errorDetails: PropTypes.array,
        operationID: PropTypes.string,
        errorCode: PropTypes.number,
      }),
    }),
  ),
  message: PropTypes.string,
  response: PropTypes.shape({
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element])
      .isRequired,
    internalErrorCode: PropTypes.string,
    errorDetails: PropTypes.array,
    operationID: PropTypes.string,
    errorCode: PropTypes.number,
  }),
};

Unavailable.defaultProps = {
  errors: undefined,
  message: '',
  response: undefined,
};

export default Unavailable;
